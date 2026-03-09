const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

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

function userFriendlyError(status, detail) {
  if (status === 429) return 'Слишком много запросов. Попробуйте через минуту.'
  if (status >= 500) return 'Сервер временно недоступен. Попробуйте позже.'
  return detail || `Ошибка ${status}`
}

async function http(method, path, body) {
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

    if (res.status === 401) {
      clearToken()
      // Redirect to auth only if not already there
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
