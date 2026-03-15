export const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export class ApiError extends Error {
  constructor(message, code = 500) {
    super(message)
    this.name = 'ApiError'
    this.code = code
  }
}

function getToken() {
  return localStorage.getItem('dof-token')
}

export function setToken(token) {
  localStorage.setItem('dof-token', token)
}

export function clearToken() {
  localStorage.removeItem('dof-token')
  localStorage.removeItem('dof-refresh-token')
}

export function getRefreshToken() {
  return localStorage.getItem('dof-refresh-token')
}

export function setRefreshToken(token) {
  localStorage.setItem('dof-refresh-token', token)
}

function camelize(str) {
  return str.replace(/_([a-z])/g, (_, c) => c.toUpperCase())
}

function transformKeys(val) {
  if (Array.isArray(val)) return val.map(transformKeys)
  if (val && typeof val === 'object' && !(val instanceof Date)) {
    return Object.fromEntries(Object.entries(val).map(([k, v]) => [camelize(k), transformKeys(v)]))
  }
  return val
}

const _inflight = new Map()
let _refreshPromise = null

function userFriendlyError(status, detail) {
  if (status === 429) return 'Слишком много запросов. Попробуйте через минуту.'
  if (status >= 500) return 'Сервер временно недоступен. Попробуйте позже.'
  return detail || `Ошибка ${status}`
}

async function tryRefresh() {
  if (_refreshPromise) return _refreshPromise
  const rt = getRefreshToken()
  if (!rt) return false
  _refreshPromise = fetch(`${BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh_token: rt }),
  }).then(async (res) => {
    if (!res.ok) return false
    const data = transformKeys(await res.json())
    if (data.accessToken) setToken(data.accessToken)
    if (data.refreshToken) setRefreshToken(data.refreshToken)
    return true
  }).catch(() => false).finally(() => { _refreshPromise = null })
  return _refreshPromise
}

async function http(method, path, body, _retried = false) {
  const token = getToken()
  const headers = { 'Content-Type': 'application/json' }
  if (token) headers['Authorization'] = `Bearer ${token}`

  const options = { method, headers }
  if (body != null) options.body = JSON.stringify(body)

  const url = `${BASE_URL}${path}`

  if (method === 'GET' && _inflight.has(url)) {
    return _inflight.get(url)
  }

  const promise = fetch(url, options).then(async (res) => {
    if (res.status === 204) return null

    const data = await res.json().catch(() => ({}))

    if (res.status === 401 && !_retried) {
      const refreshed = await tryRefresh()
      if (refreshed) return http(method, path, body, true)
      clearToken()
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.replace('/auth')
      }
      throw new ApiError('Сессия истекла. Войдите снова.', 401)
    }

    if (res.status === 401) {
      clearToken()
      if (!window.location.pathname.startsWith('/auth')) {
        window.location.replace('/auth')
      }
      throw new ApiError('Сессия истекла. Войдите снова.', 401)
    }

    if (!res.ok) {
      const detail = data?.detail || data?.message
      throw new ApiError(userFriendlyError(res.status, detail), res.status)
    }

    return transformKeys(data)
  })

  if (method === 'GET') {
    _inflight.set(url, promise)
    promise.finally(() => _inflight.delete(url))
  }

  return promise
}

export const api = {
  get: (path) => http('GET', path),
  post: (path, body) => http('POST', path, body),
  patch: (path, body) => http('PATCH', path, body),
  put: (path, body) => http('PUT', path, body),
  delete: (path) => http('DELETE', path),
}

export async function request(handler) {
  return handler()
}
