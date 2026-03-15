import { defineStore } from 'pinia'
import { ref } from 'vue'
import { getAll, getById, create, update, updateStatus, remove } from '@/api/cbt'

export const useCbtStore = defineStore('cbt', () => {
  const entries = ref([])
  const current = ref(null)
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      entries.value = await getAll()
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id) {
    current.value = await getById(id)
    return current.value
  }

  async function addEntry(data) {
    const entry = await create(data)
    entries.value.unshift(entry)
    return entry
  }

  async function updateEntry(id, data) {
    const updated = await update(id, data)
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) entries.value[idx] = updated
    return updated
  }

  async function changeStatus(id, status) {
    const updated = await updateStatus(id, status)
    const idx = entries.value.findIndex(e => e.id === id)
    if (idx !== -1) entries.value[idx] = updated
    return updated
  }

  async function removeEntry(id) {
    await remove(id)
    entries.value = entries.value.filter(e => e.id !== id)
  }

  return { entries, current, loading, fetchAll, fetchById, addEntry, updateEntry, changeStatus, removeEntry }
})
