import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import {
  getHistory,
  sendMessage as apiSend,
  sendMessageStream,
  getConversations as apiGetConversations,
  createConversation as apiCreateConversation,
  renameConversation as apiRenameConversation,
  deleteConversation as apiDeleteConversation,
} from '@/api/assistant'

const PENDING_KEY = 'dof-chat-pending'

export const useAssistantStore = defineStore('assistant', () => {
  // Messages state
  const messages = ref([])
  const sending = ref(false)
  const streaming = ref(false)
  const loaded = ref(false)
  const abortController = ref(null)

  // Conversations state
  const conversations = ref([])
  const activeConversationId = ref(null)
  const conversationsLoaded = ref(false)

  // Typewriter state (fallback for non-streaming)
  const typewriter = ref(null)
  const isTypewriting = computed(() => !!typewriter.value)

  // ── Conversations ──────────────────────────────────────

  async function loadConversations() {
    const res = await apiGetConversations()
    conversations.value = res.items ?? res
    conversationsLoaded.value = true
  }

  async function createConversation(title = null) {
    const conv = await apiCreateConversation(title)
    conversations.value.unshift(conv)
    activeConversationId.value = conv.id
    messages.value = []
    loaded.value = true
    return conv
  }

  async function selectConversation(id) {
    if (activeConversationId.value === id) return
    stopTypewriter()
    stopStream()
    activeConversationId.value = id
    loaded.value = false
    await loadHistory(id)
  }

  async function renameConversation(id, title) {
    const conv = await apiRenameConversation(id, title)
    const idx = conversations.value.findIndex(c => c.id === id)
    if (idx !== -1) conversations.value[idx] = { ...conversations.value[idx], title: conv.title }
    return conv
  }

  async function deleteConversation(id) {
    stopTypewriter()
    stopStream()
    await apiDeleteConversation(id)
    conversations.value = conversations.value.filter(c => c.id !== id)
    localStorage.removeItem(PENDING_KEY)

    if (activeConversationId.value === id) {
      if (conversations.value.length) {
        await selectConversation(conversations.value[0].id)
      } else {
        await createConversation()
      }
    }
  }

  // ── Messages ───────────────────────────────────────────

  async function loadHistory(conversationId) {
    const cid = conversationId || activeConversationId.value
    if (!cid) return
    messages.value = await getHistory(cid)
    loaded.value = true

    // Restore typewriter state if pending for this conversation
    try {
      const pending = JSON.parse(localStorage.getItem(PENDING_KEY))
      if (pending?.conversationId !== cid) {
        localStorage.removeItem(PENDING_KEY)
        return
      }
      if (
        (pending?.status === 'sending' && Date.now() - pending.sentAt < 120000) ||
        pending?.status === 'typing'
      ) {
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
    const cid = activeConversationId.value
    if (!cid) return

    sending.value = true
    streaming.value = true
    const userMsg = { role: 'user', content, createdAt: new Date().toISOString() }
    messages.value.push(userMsg)

    const assistantMsg = { role: 'assistant', content: '', createdAt: new Date().toISOString() }
    messages.value.push(assistantMsg)
    const msgIndex = messages.value.length - 1

    const ac = new AbortController()
    abortController.value = ac

    try {
      await sendMessageStream(
        content,
        cid,
        (token) => {
          messages.value[msgIndex] = {
            ...messages.value[msgIndex],
            content: messages.value[msgIndex].content + token,
          }
        },
        ac.signal,
      )
      // Update conversation in sidebar (bump to top, show assistant response as preview)
      const assistantContent = messages.value[msgIndex]?.content
      _bumpConversation(cid, assistantContent || content)
      // Refresh conversations after delay to pick up auto-generated title
      const conv = conversations.value.find(c => c.id === cid)
      if (conv && !conv.title) {
        setTimeout(() => loadConversations(), 3000)
      }
    } catch (err) {
      if (err.name === 'AbortError') return
      // Remove both user + empty assistant messages before non-stream retry
      messages.value.splice(messages.value.length - 2, 2)
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
    const cid = activeConversationId.value
    if (!cid) return

    sending.value = true
    const userMsg = { role: 'user', content, createdAt: new Date().toISOString() }
    messages.value.push(userMsg)

    localStorage.setItem(PENDING_KEY, JSON.stringify({
      status: 'sending',
      sentAt: Date.now(),
      userContent: content,
      conversationId: cid,
    }))

    try {
      const response = await apiSend(content, cid)
      messages.value.push(response.assistantMessage)
      localStorage.setItem(PENDING_KEY, JSON.stringify({
        status: 'typing',
        conversationId: cid,
      }))
      startTypewriter(messages.value.length - 1, response.assistantMessage.content)
      _bumpConversation(cid, response.assistantMessage?.content || content)
      // Refresh conversations after delay to pick up auto-generated title
      const conv = conversations.value.find(c => c.id === cid)
      if (conv && !conv.title) {
        setTimeout(() => loadConversations(), 3000)
      }
      return response
    } catch (err) {
      messages.value.pop()
      localStorage.removeItem(PENDING_KEY)
      throw err
    } finally {
      sending.value = false
    }
  }

  function _bumpConversation(cid, lastContent) {
    const idx = conversations.value.findIndex(c => c.id === cid)
    if (idx > 0) {
      const [conv] = conversations.value.splice(idx, 1)
      conv.lastMessage = lastContent?.slice(0, 100)
      conv.updatedAt = new Date().toISOString()
      conversations.value.unshift(conv)
    } else if (idx === 0) {
      conversations.value[0] = {
        ...conversations.value[0],
        lastMessage: lastContent?.slice(0, 100),
        updatedAt: new Date().toISOString(),
      }
    }
  }

  // ── Typewriter ─────────────────────────────────────────

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

  return {
    // Messages
    messages, sending, streaming, loaded, isTypewriting,
    loadHistory, send, sendStream, stopStream,
    startTypewriter, stopTypewriter, skipTypewriter, finishTypewriter,
    getDisplayText, isTypingAt,
    // Conversations
    conversations, activeConversationId, conversationsLoaded,
    loadConversations, createConversation, selectConversation,
    renameConversation, deleteConversation,
  }
})
