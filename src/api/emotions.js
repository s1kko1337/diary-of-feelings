import { api } from './client.js'

export function create(data) {
  return api.post('/emotions', data)
}

export function getByDate(date) {
  return api.get(`/emotions?date=${date}`)
}

export function getHistory(range) {
  const q = range ? `?${new URLSearchParams(range)}` : ''
  return api.get(`/emotions${q}`)
}

export function getStats() {
  return api.get('/emotions/stats')
}

// alias used by store
export function getPatterns() {
  return api.get('/emotions/stats')
}

export function remove(id) {
  return api.delete(`/emotions/${id}`)
}
