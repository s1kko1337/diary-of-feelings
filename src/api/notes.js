import { api } from './client.js'

export const notesApi = {
  getNotes: async (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    const res = await api.get(`/notes${q}`)
    return res.items ?? res
  },
  createNote: (data) => api.post('/notes', data),
  updateNote: (id, data) => api.patch(`/notes/${id}`, data),
  deleteNote: (id) => api.delete(`/notes/${id}`),
}
