import { api } from './client.js'

// ── Dashboard ───────────────────────────────────────────
export function getDashboardStats() {
  return api.get('/admin/dashboard/stats')
}

// ── Users ───────────────────────────────────────────────
export function getUsers(params = {}) {
  const q = new URLSearchParams()
  if (params.page) q.set('page', params.page)
  if (params.perPage) q.set('per_page', params.perPage)
  if (params.search) q.set('search', params.search)
  if (params.isActive !== undefined && params.isActive !== null) q.set('is_active', params.isActive)
  if (params.role) q.set('role', params.role)
  if (params.sortBy) q.set('sort_by', params.sortBy)
  if (params.sortOrder) q.set('sort_order', params.sortOrder)
  const qs = q.toString()
  return api.get(`/admin/users${qs ? '?' + qs : ''}`)
}

export function getUser(id) {
  return api.get(`/admin/users/${id}`)
}

export function updateUser(id, data) {
  return api.patch(`/admin/users/${id}`, data)
}

export function blockUser(id) {
  return api.post(`/admin/users/${id}/block`)
}

export function unblockUser(id) {
  return api.post(`/admin/users/${id}/unblock`)
}

export function resetUserPassword(id, newPassword) {
  return api.post(`/admin/users/${id}/reset-password`, { new_password: newPassword })
}

export function deleteUser(id) {
  return api.delete(`/admin/users/${id}`)
}

// ── User Content ────────────────────────────────────────
export function getUserContent(userId, type, params = {}) {
  const q = new URLSearchParams()
  if (params.page) q.set('page', params.page)
  if (params.perPage) q.set('per_page', params.perPage)
  const qs = q.toString()
  return api.get(`/admin/users/${userId}/${type}${qs ? '?' + qs : ''}`)
}

export function deleteUserContent(userId, type, contentId) {
  return api.delete(`/admin/users/${userId}/content/${type}/${contentId}`)
}

// ── Roles ───────────────────────────────────────────────
export function getRoles() {
  return api.get('/admin/roles')
}

export function getRole(id) {
  return api.get(`/admin/roles/${id}`)
}

export function createRole(data) {
  return api.post('/admin/roles', data)
}

export function updateRole(id, data) {
  return api.patch(`/admin/roles/${id}`, data)
}

export function deleteRole(id) {
  return api.delete(`/admin/roles/${id}`)
}

export function setRolePermissions(roleId, permissionIds) {
  return api.put(`/admin/roles/${roleId}/permissions`, { permission_ids: permissionIds })
}

// ── Permissions ─────────────────────────────────────────
export function getPermissions() {
  return api.get('/admin/permissions')
}

// ── User Roles ──────────────────────────────────────────
export function assignUserRole(userId, roleId) {
  return api.post(`/admin/users/${userId}/roles`, { role_id: roleId })
}

export function removeUserRole(userId, roleId) {
  return api.delete(`/admin/users/${userId}/roles/${roleId}`)
}

// ── Assistant Configs ───────────────────────────────────
export function getAssistantConfigs() {
  return api.get('/admin/assistant/configs')
}

export function getAssistantConfig(id) {
  return api.get(`/admin/assistant/configs/${id}`)
}

export function createAssistantConfig(data) {
  return api.post('/admin/assistant/configs', {
    name: data.name,
    is_global: data.isGlobal,
    user_id: data.userId || undefined,
    provider: data.provider,
    model_name: data.modelName,
    api_url: data.apiUrl || undefined,
    api_key: data.apiKey || undefined,
    system_prompt: data.systemPrompt || undefined,
    temperature: data.temperature,
    max_tokens: data.maxTokens,
  })
}

export function updateAssistantConfig(id, data) {
  const body = {}
  if (data.name !== undefined) body.name = data.name
  if (data.provider !== undefined) body.provider = data.provider
  if (data.modelName !== undefined) body.model_name = data.modelName
  if (data.apiUrl !== undefined) body.api_url = data.apiUrl
  if (data.apiKey !== undefined) body.api_key = data.apiKey
  if (data.systemPrompt !== undefined) body.system_prompt = data.systemPrompt
  if (data.temperature !== undefined) body.temperature = data.temperature
  if (data.maxTokens !== undefined) body.max_tokens = data.maxTokens
  if (data.isActive !== undefined) body.is_active = data.isActive
  return api.patch(`/admin/assistant/configs/${id}`, body)
}

export function deleteAssistantConfig(id) {
  return api.delete(`/admin/assistant/configs/${id}`)
}

export function testAssistantConfig(id) {
  return api.post(`/admin/assistant/configs/${id}/test`)
}

export function activateAssistantConfig(id) {
  return api.post(`/admin/assistant/configs/${id}/activate`)
}

export function getAssistantModels() {
  return api.get('/admin/assistant/models')
}

export function setUserAssistantConfig(userId, configId) {
  return api.post(`/admin/users/${userId}/assistant-config`, { config_id: configId })
}

export function removeUserAssistantConfig(userId) {
  return api.delete(`/admin/users/${userId}/assistant-config`)
}

// ── Audit Log ───────────────────────────────────────────
export function getAuditLogs(params = {}) {
  const q = new URLSearchParams()
  if (params.page) q.set('page', params.page)
  if (params.perPage) q.set('per_page', params.perPage)
  if (params.adminId) q.set('admin_id', params.adminId)
  if (params.action) q.set('action', params.action)
  if (params.targetType) q.set('target_type', params.targetType)
  if (params.dateFrom) q.set('date_from', params.dateFrom)
  if (params.dateTo) q.set('date_to', params.dateTo)
  const qs = q.toString()
  return api.get(`/admin/audit${qs ? '?' + qs : ''}`)
}

export function getAuditLog(id) {
  return api.get(`/admin/audit/${id}`)
}
