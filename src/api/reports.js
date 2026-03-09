import { api } from './client.js'

export const reportsApi = {
  getEmotionReport: (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    return api.get(`/reports/emotions${q}`)
  },
  getCbtReport: (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    return api.get(`/reports/cbt${q}`)
  },
  getTasksReport: (params) => {
    const q = params ? `?${new URLSearchParams(params)}` : ''
    return api.get(`/reports/tasks${q}`)
  },
}
