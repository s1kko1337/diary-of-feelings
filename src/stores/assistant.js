import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { getHistory, sendMessage as apiSend, clearHistory as apiClear, sendMessageStream } from '@/api/assistant'

const PENDING_KEY = 'dof-chat-pending'

export const useAssistantStore = defineStore('assistant', () => {
  const messages = ref([])
  const sending = ref(false)
  const streaming = ref(false)
  const loaded = ref(false)
  const abortController = ref(null)

  // Typewriter state (fallback for non-streaming)
  const typewriter = ref(null)
  const isTypewriting = computed(() => !!typewriter.value)

  async function loadHistory() {
    messages.value = await getHistory()
    loaded.value = true

    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY))
      if (pending?.status === 'sending' && Date.now() - pending.sentAt < 120000) {
        const last = messages.value[messages.value.length - 1]
        if (last?.role === 'assistant') {
          startTypewriter(messages.value.length - 1, last.content)
        } else {
          localStorage.removeItem(PENDING_KEY)
        }
      } else if (pending?.status === 'typing') {
        const last = messages.value[messages.value.length - 1]
        if (last?.role === 'assistant') {
          startTypewriter(messages.value.length - 1, last.content)
        } else {
          localStorage.removeItem(PENDING_KEY)
        }
      } else {
        localStorage.removeItem(PENDING_KEY)
      }
    } catch {
      localStorage.removeItem(PENDING_KEY)
    }
  }

  async function sendStream(content) {
    sending.value = true
    streaming.value = true
    const userMsg = { role: 'user', content, createdAt: new Date().toISOString() }
    messages.value.push(userMsg)

    // Create empty assistant message that will be filled by streaming
    const assistantMsg = { role: 'assistant', content: '', createdAt: new Date().toISOString() }
    messages.value.push(assistantMsg)
    const msgIndex = messages.value.length - 1

    const ac = new AbortController()
    abortController.value = ac

    try {
      await sendMessageStream(
        content,
        (token) => {
          messages.value[msgIndex] = {
            ...messages.value[msgIndex],
            content: messages.value[msgIndex].content + token,
          }
        },
        ac.signal,
      )
    } catch (err) {
      if (err.name === 'AbortError') {
        // User stopped — keep what we have
        return
      }
      // Remove the empty assistant message and fallback to non-streaming
      messages.value.splice(msgIndex, 1)
      messages.value.pop() // remove user msg
      streaming.value = false
      return send(content)
    } finally {
      sending.value = false
      streaming.value = false
      abortController.value = null
    }
  }

  function stopStream() {
    if (abortController.value) {
      abortController.value.abort()
      abortController.value = null
    }
    sending.value = false
    streaming.value = false
  }

  async function send(content) {
    sending.value = true
    const userMsg = { role: 'user', content, createdAt: new Date().toISOString() }
    messages.value.push(userMsg)

    localStorage.setItem(PENDING_KEY, JSON.stringify({
      status: 'sending',
      sentAt: Date.now(),
      userContent: content,
    }))

    try {
      const response = await apiSend(content)
      messages.value.push(response)
      localStorage.setItem(PENDING_KEY, JSON.stringify({ status: 'typing' }))
      startTypewriter(messages.value.length - 1, response.content)
      return response
    } catch (err) {
      messages.value.pop()
      localStorage.removeItem(PENDING_KEY)
      throw err
    } finally {
      sending.value = false
    }
  }

  function startTypewriter(msgIndex, fullText) {
    stopTypewriter()
    typewriter.value = { msgIndex, fullText, charIndex: 0, timerId: null }

    const tick = () => {
      if (!typewriter.value) return
      const char = typewriter.value.fullText[typewriter.value.charIndex]
      const step = (char === ' ' || char === '\n') ? 3 : (1 + Math.floor(Math.random() * 2))
      typewriter.value.charIndex = Math.min(typewriter.value.charIndex + step, fullText.length)

      if (typewriter.value.charIndex >= fullText.length) {
        finishTypewriter()
        return
      }
      typewriter.value.timerId = setTimeout(tick, 12 + Math.random() * 18)
    }

    typewriter.value.timerId = setTimeout(tick, 200)
  }

  function stopTypewriter() {
    if (typewriter.value?.timerId) clearTimeout(typewriter.value.timerId)
    typewriter.value = null
  }

  function finishTypewriter() {
    stopTypewriter()
    localStorage.removeItem(PENDING_KEY)
  }

  function skipTypewriter() {
    if (typewriter.value) {
      typewriter.value.charIndex = typewriter.value.fullText.length
    }
    finishTypewriter()
  }

  function getDisplayText(index) {
    if (typewriter.value && typewriter.value.msgIndex === index) {
      return typewriter.value.fullText.slice(0, typewriter.value.charIndex)
    }
    return null
  }

  function isTypingAt(index) {
    return typewriter.value?.msgIndex === index && typewriter.value.charIndex < typewriter.value.fullText.length
  }

  async function clearAll() {
    stopTypewriter()
    stopStream()
    await apiClear()
    messages.value = []
    localStorage.removeItem(PENDING_KEY)
  }

  return {
    messages, sending, streaming, loaded, isTypewriting,
    loadHistory, send, sendStream, stopStream, clearAll,
    startTypewriter, stopTypewriter, skipTypewriter, finishTypewriter,
    getDisplayText, isTypingAt,
  }
})
