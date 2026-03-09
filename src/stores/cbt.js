import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as cbtApi from '@/api/cbt'
import { getDistortion } from '@/api/mock/data/distortions'

export const useCbtStore = defineStore('cbt', () => {
  const entries = ref([])
  const currentEntry = ref(null)
  const isLoading = ref(false)

  const stats = computed(() => {
    const total = entries.value.length

    const distortionCounts = {}
    for (const entry of entries.value) {
      if (entry.distortion) {
        distortionCounts[entry.distortion] = (distortionCounts[entry.distortion] || 0) + 1
      }
    }

    let topDistortion = null
    let topCount = 0
    for (const [key, count] of Object.entries(distortionCounts)) {
      if (count > topCount) {
        topCount = count
        topDistortion = key
      }
    }

    const topDistortionInfo = topDistortion ? getDistortion(topDistortion) : null

    const now = new Date()
    const weekAgo = new Date(now.getTime() - 7 * 86400000)
    const weekCount = entries.value.filter((e) => new Date(e.createdAt) >= weekAgo).length

    return {
      total,
      topDistortion: topDistortionInfo ? topDistortionInfo.label : null,
      weekCount,
    }
  })

  async function loadEntries() {
    isLoading.value = true
    try {
      entries.value = await cbtApi.getAll()
    } finally {
      isLoading.value = false
    }
  }

  async function loadEntry(id) {
    isLoading.value = true
    try {
      currentEntry.value = await cbtApi.getById(id)
      return currentEntry.value
    } finally {
      isLoading.value = false
    }
  }

  async function createEntry(data) {
    isLoading.value = true
    try {
      const entry = await cbtApi.create(data)
      entries.value.unshift(entry)
      return entry
    } finally {
      isLoading.value = false
    }
  }

  async function updateEntry(id, data) {
    isLoading.value = true
    try {
      const updated = await cbtApi.update(id, data)
      const idx = entries.value.findIndex((e) => e.id === id)
      if (idx !== -1) entries.value[idx] = updated
      if (currentEntry.value?.id === id) {
        currentEntry.value = updated
      }
      return updated
    } finally {
      isLoading.value = false
    }
  }

  async function updateStatus(id, status) {
    const updated = await cbtApi.update(id, { status })
    const idx = entries.value.findIndex((e) => e.id === id)
    if (idx !== -1) entries.value[idx] = { ...entries.value[idx], status }
    return updated
  }

  async function deleteEntry(id) {
    await cbtApi.remove(id)
    entries.value = entries.value.filter((e) => e.id !== id)
    if (currentEntry.value?.id === id) {
      currentEntry.value = null
    }
  }

  return {
    entries,
    currentEntry,
    isLoading,
    stats,
    loadEntries,
    fetchEntries: loadEntries,
    loadEntry,
    createEntry,
    updateEntry,
    updateStatus,
    deleteEntry,
  }
})
