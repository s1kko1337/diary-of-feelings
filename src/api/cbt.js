import { api } from './client.js'

export async function getAll() {
  const res = await api.get('/cbt')
  return res.items ?? res
}

export function getById(id) {
  return api.get(`/cbt/${id}`)
}

export function create(data) {
  return api.post('/cbt', data)
}

export function update(id, data) {
  return api.patch(`/cbt/${id}`, data)
}

export function updateStatus(id, status) {
  return api.patch(`/cbt/${id}/status`, { status })
}

export function remove(id) {
  return api.delete(`/cbt/${id}`)
}
