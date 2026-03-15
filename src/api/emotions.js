import { api } from './client.js'

export function create(data) {
  const body = {
    emotion_name: data.emotion,
    emotion_category: data.emotionCategory,
    intensity: data.intensity,
    note: data.note,
    is_time_capsule: data.isTimeCapsule ?? false,
  }
  if (data.capsuleRevealDate) {
    body.capsule_reveal_date = data.capsuleRevealDate
  }
  return api.post('/emotions', body)
}

export async function getByDate(date) {
  const res = await api.get(`/emotions?date=${date}`)
  return res.items ?? res
}

export async function getHistory(range) {
  const q = range ? `?${new URLSearchParams(range)}` : ''
  const res = await api.get(`/emotions${q}`)
  return res.items ?? res
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

export function update(id, data) {
  return api.patch(`/emotions/${id}`, data)
}

export async function getCapsules() {
  const res = await api.get('/emotions/capsules')
  return res.items ?? res
}

export async function getRevealedCapsules() {
  const res = await api.get('/emotions/capsules/revealed')
  return res.items ?? res
}
