import { api } from './client.js'

export const tasksApi = {
  getTasks: async (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    const res = await api.get(`/tasks${q}`)
    return res.items ?? res
  },
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.patch(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  moveToDate: (id, date) => api.patch(`/tasks/${id}/date`, { date }),
}
