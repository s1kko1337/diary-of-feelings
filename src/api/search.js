import { api } from './client.js'

export async function search(query, types, limit = 20) {
  const params = new URLSearchParams({ q: query })
  if (types) params.set('type', types)
  if (limit) params.set('limit', limit)
  const res = await api.get(`/search?${params}`)
  return res.items ?? res
}
