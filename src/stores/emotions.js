import { defineStore } from 'pinia'
import { ref } from 'vue'
import { create, getByDate, getHistory, getStats, remove, update, getCapsules, getRevealedCapsules } from '@/api/emotions'

export const useEmotionsStore = defineStore('emotions', () => {
  const entries = ref([])
  const stats = ref(null)
  const loading = ref(false)
  const capsules = ref([])
  const revealedCapsules = ref([])

  async function fetchByDate(date) {
    loading.value = true
    try {
      entries.value = await getByDate(date)
    } finally {
      loading.value = false
    }
  }

  async function fetchHistory(params) {
    loading.value = true
    try {
      entries.value = await getHistory(params)
    } finally {
      loading.value = false
    }
  }

  async function fetchStats() {
    stats.value = await getStats()
  }

  async function addEmotion(data) {
    const entry = await create(data)
    entries.value.unshift(entry)
    return entry
  }

  async function updateEmotion(id, data) {
    const updated = await update(id, data)
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) entries.value[idx] = { ...entries.value[idx], ...updated }
    return updated
  }

  async function removeEmotion(id) {
    await remove(id)
    entries.value = entries.value.filter(e => e.id !== id)
  }

  async function fetchCapsules() {
    capsules.value = await getCapsules()
  }

  async function fetchRevealedCapsules() {
    revealedCapsules.value = await getRevealedCapsules()
  }

  return {
    entries, stats, loading, capsules, revealedCapsules,
    fetchByDate, fetchHistory, fetchStats, addEmotion, updateEmotion, removeEmotion,
    fetchCapsules, fetchRevealedCapsules,
  }
})
