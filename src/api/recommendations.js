import { api } from '@/api/client'

export const getTodayRecommendations = () =>
  api.get('/recommendations/today')

export const markRead = (id) =>
  api.patch(`/recommendations/${id}/read`, {})

export const markHelpful = (id, helpful) =>
  api.patch(`/recommendations/${id}/helpful`, { helpful })

export const markOpened = (id) =>
  api.patch(`/recommendations/${id}/opened`)

export const getPortrait = () =>
  api.get('/recommendations/portrait')
