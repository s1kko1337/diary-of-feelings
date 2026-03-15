import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  getTodayRecommendations,
  markRead,
  markHelpful,
  markOpened,
  getPortrait,
} from '@/api/recommendations'

export const useRecommendationsStore = defineStore('recommendations', () => {
  const recommendations = ref([])
  const portrait = ref(null)
  const loading = ref(false)

  async function fetchToday() {
    loading.value = true
    try {
      recommendations.value = await getTodayRecommendations()
    } finally {
      loading.value = false
    }
  }

  async function read(id) {
    await markRead(id)
    const rec = recommendations.value.find(r => r.id === id)
    if (rec) rec.isRead = true
  }

  async function helpful(id, isHelpful) {
    await markHelpful(id, isHelpful)
    const rec = recommendations.value.find(r => r.id === id)
    if (rec) rec.helpful = isHelpful
  }

  async function opened(id) {
    await markOpened(id)
    const rec = recommendations.value.find(r => r.id === id)
    if (rec) rec.openedAt = new Date().toISOString()
  }

  async function fetchPortrait() {
    portrait.value = await getPortrait()
    return portrait.value
  }

  return { recommendations, portrait, loading, fetchToday, read, helpful, opened, fetchPortrait }
})
