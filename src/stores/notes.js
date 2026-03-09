import { ref } from 'vue'
import { defineStore } from 'pinia'
import { notesApi } from '@/api/notes.js'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const loading = ref(false)
  const search = ref('')

  async function fetchNotes() {
    loading.value = true
    try {
      notes.value = await notesApi.getNotes({ search: search.value })
    } finally {
      loading.value = false
    }
  }

  async function createNote(data) {
    const note = await notesApi.createNote(data)
    notes.value.unshift(note)
    return note
  }

  async function updateNote(id, data) {
    const updated = await notesApi.updateNote(id, data)
    const idx = notes.value.findIndex((n) => n.id === id)
    if (idx !== -1) notes.value[idx] = updated
    return updated
  }

  async function deleteNote(id) {
    await notesApi.deleteNote(id)
    notes.value = notes.value.filter((n) => n.id !== id)
  }

  return { notes, loading, search, fetchNotes, createNote, updateNote, deleteNote }
})
