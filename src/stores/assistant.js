import { ref } from 'vue'
import { defineStore } from 'pinia'
import * as assistantApi from '@/api/assistant'

export const useAssistantStore = defineStore('assistant', () => {
  const messages = ref([])
  const loading = ref(false)
  const sending = ref(false)

  const MAX_MESSAGES = 100

  async function fetchHistory() {
    loading.value = true
    try {
      const history = await assistantApi.getHistory()
      messages.value = history.slice(-MAX_MESSAGES)
    } finally {
      loading.value = false
    }
  }

  async function sendMessage(content) {
    if (!content.trim() || sending.value) return
    sending.value = true

    const tempId = 'temp-' + Date.now()
    messages.value.push({
      id: tempId,
      role: 'user',
      content,
      createdAt: new Date().toISOString(),
    })

    messages.value.push({
      id: 'typing',
      role: 'assistant',
      content: '',
      isTyping: true,
      createdAt: new Date().toISOString(),
    })

    try {
      const result = await assistantApi.sendMessage(content)
      messages.value = messages.value.filter((m) => m.id !== tempId && m.id !== 'typing')
      messages.value.push(result.userMessage)

      messages.value.push({
        ...result.assistantMessage,
        displayContent: '',
        isStreaming: true,
      })
      if (messages.value.length > MAX_MESSAGES) {
        messages.value = messages.value.slice(-MAX_MESSAGES)
      }

      // Use the reactive proxy from the array, not the plain object we pushed
      const reactiveMsg = messages.value[messages.value.length - 1]
      await typewriter(reactiveMsg, result.assistantMessage.content)
    } catch {
      messages.value = messages.value.filter((m) => m.id !== 'typing')
    } finally {
      sending.value = false
    }
  }

  async function typewriter(msg, fullText) {
    const words = fullText.split(' ')
    let built = ''
    for (const word of words) {
      built += (built ? ' ' : '') + word
      msg.displayContent = built
      await sleep(28)
    }
    msg.isStreaming = false
  }

  async function clearHistory() {
    await assistantApi.clearHistory()
    messages.value = []
  }

  return { messages, loading, sending, fetchHistory, sendMessage, clearHistory }
})

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms))
}
