import { api, BASE_URL } from './client.js'

export async function getHistory() {
  const res = await api.get('/assistant/history')
  return res.items ?? res
}

export function sendMessage(content) {
  return api.post('/assistant/chat', { content })
}

export function clearHistory() {
  return api.delete('/assistant/history')
}

/**
 * SSE streaming chat. Calls onToken(text) for each token, returns full text on completion.
 * @param {string} content
 * @param {(token: string) => void} onToken
 * @param {AbortSignal} [signal]
 * @returns {Promise<string>}
 */
export async function sendMessageStream(content, onToken, signal) {
  const token = localStorage.getItem('dof-token')
  const res = await fetch(`${BASE_URL}/assistant/chat/stream`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: JSON.stringify({ content }),
    signal,
  })

  if (!res.ok) {
    const data = await res.json().catch(() => ({}))
    throw new Error(data.detail || `Ошибка ${res.status}`)
  }

  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let fullText = ''
  let buffer = ''

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    buffer += decoder.decode(value, { stream: true })
    const lines = buffer.split('\n')
    buffer = lines.pop() || ''

    for (const line of lines) {
      if (!line.startsWith('data: ')) continue
      const raw = line.slice(6).trim()
      if (!raw) continue

      try {
        const evt = JSON.parse(raw)
        if (evt.type === 'token' && evt.content) {
          fullText += evt.content
          onToken(evt.content)
        } else if (evt.type === 'done') {
          return fullText
        } else if (evt.type === 'error') {
          throw new Error(evt.content || 'Ошибка стриминга')
        }
      } catch (e) {
        if (e.message !== 'Ошибка стриминга') continue
        throw e
      }
    }
  }

  return fullText
}
