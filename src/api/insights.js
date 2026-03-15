import { api } from './client.js'

export function getMoodScore(days = 30) {
  return api.get(`/insights/mood-score?days=${days}`)
}

export function getStreaks() {
  return api.get('/insights/streaks')
}

export function getPatterns() {
  return api.get('/insights/patterns')
}
