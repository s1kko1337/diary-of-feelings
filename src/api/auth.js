import { api, setToken, clearToken, setRefreshToken } from './client.js'

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password })
  if (data?.accessToken) setToken(data.accessToken)
  if (data?.refreshToken) setRefreshToken(data.refreshToken)
  return data
}

export async function register(email, username, password) {
  const data = await api.post('/auth/register', { email, username, password })
  if (data?.accessToken) setToken(data.accessToken)
  if (data?.refreshToken) setRefreshToken(data.refreshToken)
  return data
}

export function getMe() {
  return api.get('/auth/me')
}

export async function logout() {
  try {
    await api.post('/auth/logout')
  } catch {
    // Ignore errors — clear local state regardless
  }
  clearToken()
}
