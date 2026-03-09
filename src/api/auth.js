import { api, setToken, clearToken } from './client.js'

export async function login(email, password) {
  const data = await api.post('/auth/login', { email, password })
  // transformKeys converts access_token → accessToken
  if (data?.accessToken) setToken(data.accessToken)
  return data
}

export async function register(email, username, password) {
  const data = await api.post('/auth/register', { email, username, password })
  if (data?.accessToken) setToken(data.accessToken)
  return data
}

export function getMe() {
  return api.get('/auth/me')
}

export function logout() {
  clearToken()
}
