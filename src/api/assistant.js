import { api } from './client.js'

export function getHistory() {
  return api.get('/assistant/history')
}

export function sendMessage(content) {
  return api.post('/assistant/chat', { content })
}

export function clearHistory() {
  return api.delete('/assistant/history')
}
