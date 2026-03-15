import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notesApi } from '@/api/notes'

export const useNotesStore = defineStore('notes', () => {
  const notes = ref([])
  const loading = ref(false)

  async function fetchNotes(params) {
    loading.value = true
    try {
      notes.value = await notesApi.getNotes(params)
    } finally {
      loading.value = false
    }
  }

  async function addNote(data) {
    const note = await notesApi.createNote(data)
    notes.value.unshift(note)
    return note
  }

  async function updateNote(id, data) {
    const updated = await notesApi.updateNote(id, data)
    const idx = notes.value.findIndex(n => n.id === id)
    if (idx !== -1) notes.value[idx] = updated
    return updated
  }

  async function removeNote(id) {
    await notesApi.deleteNote(id)
    notes.value = notes.value.filter(n => n.id !== id)
  }

  return { notes, loading, fetchNotes, addNote, updateNote, removeNote }
})
