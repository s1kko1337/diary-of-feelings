import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as emotionsApi from '@/api/emotions'

export const useEmotionsStore = defineStore('emotions', () => {
  const todayEntries = ref([])
  const history = ref([])
  const patterns = ref(null)
  const isLoading = ref(false)

  const hasEntryToday = computed(() => todayEntries.value.length > 0)

  const recentEmotions = computed(() => history.value.slice(0, 10))

  async function createEntry(data) {
    isLoading.value = true
    try {
      const entry = await emotionsApi.create(data)
      todayEntries.value.unshift(entry)
      history.value.unshift(entry)
      return entry
    } finally {
      isLoading.value = false
    }
  }

  async function loadToday() {
    const date = new Date().toISOString().slice(0, 10)
    todayEntries.value = await emotionsApi.getByDate(date)
  }

  async function loadHistory(range) {
    isLoading.value = true
    try {
      history.value = await emotionsApi.getHistory(range)
    } finally {
      isLoading.value = false
    }
  }

  async function loadPatterns() {
    patterns.value = await emotionsApi.getPatterns()
  }

  async function removeEntry(id) {
    await emotionsApi.remove(id)
    todayEntries.value = todayEntries.value.filter((e) => e.id !== id)
    history.value = history.value.filter((e) => e.id !== id)
  }

  return {
    todayEntries,
    history,
    patterns,
    isLoading,
    hasEntryToday,
    recentEmotions,
    createEntry,
    loadToday,
    loadHistory,
    loadPatterns,
    removeEntry,
  }
})
