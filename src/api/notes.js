import { api } from './client.js'

export const notesApi = {
  getNotes: (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    return api.get(`/notes${q}`)
  },
  createNote: (data) => api.post('/notes', data),
  updateNote: (id, data) => api.patch(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
}
