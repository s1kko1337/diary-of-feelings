import { ref } from 'vue'
import { defineStore } from 'pinia'
import {
  getTodayRecommendations,
  markRead as markReadApi,
  markHelpful as markHelpfulApi,
  markOpened as markOpenedApi,
  getPortrait as getPortraitApi,
} from '@/api/recommendations'

export const useRecommendationsStore = defineStore(
  'recommendations',
  () => {
    const recommendations = ref([])
    const portrait = ref(null)
    const loading = ref(false)

    async function fetchToday() {
      loading.value = true
      try {
        recommendations.value = await getTodayRecommendations()
      } catch {
        // Degrade gracefully — empty list shown
        recommendations.value = []
      } finally {
        loading.value = false
      }
    }

    async function fetchPortrait() {
      try {
        portrait.value = await getPortraitApi()
      } catch {
        portrait.value = null
      }
    }

    async function markRead(id) {
      // Optimistic update
      const item = recommendations.value.find((r) => r.id === id)
      if (item) item.isRead = true

      try {
        await markReadApi(id)
      } catch {
        // Revert on failure
        if (item) item.isRead = false
      }
    }

    async function markHelpful(id, helpful) {
      const item = recommendations.value.find((r) => r.id === id)
      if (!item) return
      const prev = item.helpful
      item.helpful = helpful

      try {
        await markHelpfulApi(id, helpful)
      } catch {
        item.helpful = prev
      }
    }

    async function markOpened(id) {
      const item = recommendations.value.find((r) => r.id === id)
      if (!item || item.openedAt) return
      item.openedAt = new Date().toISOString()

      try {
        await markOpenedApi(id)
      } catch {
        item.openedAt = null
      }
    }

    return {
      recommendations,
      portrait,
      loading,
      fetchToday,
      fetchPortrait,
      markRead,
      markHelpful,
      markOpened,
    }
  },
)
