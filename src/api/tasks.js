import { api } from './client.js'

export const tasksApi = {
  getTasks: (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    return api.get(`/tasks${q}`)
  },
  createTask: (data) => api.post('/tasks', data),
  updateTask: (id, data) => api.patch(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  moveToDate: (id, date) => api.patch(`/tasks/${id}/date`, { date }),
}
