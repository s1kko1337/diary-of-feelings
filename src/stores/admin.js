import { defineStore } from 'pinia'
import { ref, reactive } from 'vue'
import * as adminApi from '@/api/admin'

export const useAdminStore = defineStore('admin', () => {
  // ── Dashboard ───────────────────────────────────────
  const stats = ref(null)
  const statsLoading = ref(false)

  async function fetchStats() {
    statsLoading.value = true
    try {
      stats.value = await adminApi.getDashboardStats()
    } finally {
      statsLoading.value = false
    }
  }

  // ── Users ───────────────────────────────────────────
  const users = ref([])
  const usersTotal = ref(0)
  const usersPage = ref(1)
  const usersPages = ref(1)
  const usersLoading = ref(false)
  const usersFilters = reactive({
    search: '',
    isActive: null,
    role: '',
    sortBy: 'created_at',
    sortOrder: 'desc',
    perPage: 20,
  })

  async function fetchUsers(page = 1) {
    usersLoading.value = true
    try {
      const res = await adminApi.getUsers({
        page,
        perPage: usersFilters.perPage,
        search: usersFilters.search || undefined,
        isActive: usersFilters.isActive,
        role: usersFilters.role || undefined,
        sortBy: usersFilters.sortBy,
        sortOrder: usersFilters.sortOrder,
      })
      users.value = res.items || []
      usersTotal.value = res.total || 0
      usersPage.value = res.page || 1
      usersPages.value = res.pages || 1
    } finally {
      usersLoading.value = false
    }
  }

  const currentUser = ref(null)
  const currentUserLoading = ref(false)

  async function fetchUser(id) {
    currentUserLoading.value = true
    try {
      currentUser.value = await adminApi.getUser(id)
    } finally {
      currentUserLoading.value = false
    }
  }

  async function updateUser(id, data) {
    const updated = await adminApi.updateUser(id, data)
    currentUser.value = updated
    return updated
  }

  async function blockUser(id) {
    await adminApi.blockUser(id)
    if (currentUser.value?.id === id) currentUser.value.isActive = false
  }

  async function unblockUser(id) {
    await adminApi.unblockUser(id)
    if (currentUser.value?.id === id) currentUser.value.isActive = true
  }

  async function resetPassword(id, newPassword) {
    await adminApi.resetUserPassword(id, newPassword)
  }

  async function deleteUser(id) {
    await adminApi.deleteUser(id)
  }

  // ── User Content ────────────────────────────────────
  const userContent = ref([])
  const userContentTotal = ref(0)
  const userContentPage = ref(1)
  const userContentPages = ref(1)
  const userContentLoading = ref(false)

  async function fetchUserContent(userId, type, page = 1) {
    userContentLoading.value = true
    try {
      const res = await adminApi.getUserContent(userId, type, { page, perPage: 20 })
      userContent.value = res.items || []
      userContentTotal.value = res.total || 0
      userContentPage.value = res.page || 1
      userContentPages.value = res.pages || 1
    } finally {
      userContentLoading.value = false
    }
  }

  async function deleteContent(userId, type, contentId) {
    await adminApi.deleteUserContent(userId, type, contentId)
    userContent.value = userContent.value.filter(c => c.id !== contentId)
    userContentTotal.value = Math.max(0, userContentTotal.value - 1)
  }

  // ── Roles ───────────────────────────────────────────
  const roles = ref([])
  const rolesLoading = ref(false)
  const currentRole = ref(null)

  async function fetchRoles() {
    rolesLoading.value = true
    try {
      roles.value = await adminApi.getRoles()
    } finally {
      rolesLoading.value = false
    }
  }

  async function fetchRole(id) {
    currentRole.value = await adminApi.getRole(id)
    return currentRole.value
  }

  async function createRole(data) {
    const role = await adminApi.createRole(data)
    roles.value.push(role)
    return role
  }

  async function updateRole(id, data) {
    const updated = await adminApi.updateRole(id, data)
    const idx = roles.value.findIndex(r => r.id === id)
    if (idx >= 0) roles.value[idx] = { ...roles.value[idx], ...updated }
    if (currentRole.value?.id === id) currentRole.value = { ...currentRole.value, ...updated }
    return updated
  }

  async function deleteRole(id) {
    await adminApi.deleteRole(id)
    roles.value = roles.value.filter(r => r.id !== id)
    if (currentRole.value?.id === id) currentRole.value = null
  }

  async function setRolePermissions(roleId, permissionIds) {
    const updated = await adminApi.setRolePermissions(roleId, permissionIds)
    if (currentRole.value?.id === roleId) currentRole.value = updated
    return updated
  }

  // ── Permissions ─────────────────────────────────────
  const permissionGroups = ref([])

  async function fetchPermissions() {
    permissionGroups.value = await adminApi.getPermissions()
  }

  // ── User Roles ──────────────────────────────────────
  async function assignUserRole(userId, roleId) {
    await adminApi.assignUserRole(userId, roleId)
    await fetchUser(userId)
  }

  async function removeUserRole(userId, roleId) {
    await adminApi.removeUserRole(userId, roleId)
    await fetchUser(userId)
  }

  // ── Assistant Configs ───────────────────────────────
  const configs = ref([])
  const configsLoading = ref(false)
  const currentConfig = ref(null)
  const models = ref({ local: [], anthropic: [] })

  async function fetchConfigs() {
    configsLoading.value = true
    try {
      configs.value = await adminApi.getAssistantConfigs()
    } finally {
      configsLoading.value = false
    }
  }

  async function fetchConfig(id) {
    currentConfig.value = await adminApi.getAssistantConfig(id)
    return currentConfig.value
  }

  async function createConfig(data) {
    const config = await adminApi.createAssistantConfig(data)
    configs.value.push(config)
    return config
  }

  async function updateConfig(id, data) {
    const updated = await adminApi.updateAssistantConfig(id, data)
    const idx = configs.value.findIndex(c => c.id === id)
    if (idx >= 0) configs.value[idx] = updated
    if (currentConfig.value?.id === id) currentConfig.value = updated
    return updated
  }

  async function deleteConfig(id) {
    await adminApi.deleteAssistantConfig(id)
    configs.value = configs.value.filter(c => c.id !== id)
    if (currentConfig.value?.id === id) currentConfig.value = null
  }

  async function testConfig(id) {
    return adminApi.testAssistantConfig(id)
  }

  async function activateConfig(id) {
    await adminApi.activateAssistantConfig(id)
    configs.value.forEach(c => {
      if (c.isGlobal) c.isActive = c.id === id
    })
  }

  async function fetchModels() {
    models.value = await adminApi.getAssistantModels()
  }

  // ── Audit Logs ──────────────────────────────────────
  const auditLogs = ref([])
  const auditTotal = ref(0)
  const auditPage = ref(1)
  const auditPages = ref(1)
  const auditLoading = ref(false)
  const auditFilters = reactive({
    adminId: '',
    action: '',
    targetType: '',
    dateFrom: '',
    dateTo: '',
    perPage: 20,
  })

  async function fetchAuditLogs(page = 1) {
    auditLoading.value = true
    try {
      const res = await adminApi.getAuditLogs({
        page,
        perPage: auditFilters.perPage,
        adminId: auditFilters.adminId || undefined,
        action: auditFilters.action || undefined,
        targetType: auditFilters.targetType || undefined,
        dateFrom: auditFilters.dateFrom || undefined,
        dateTo: auditFilters.dateTo || undefined,
      })
      auditLogs.value = res.items || []
      auditTotal.value = res.total || 0
      auditPage.value = res.page || 1
      auditPages.value = res.pages || 1
    } finally {
      auditLoading.value = false
    }
  }

  async function fetchAuditLog(id) {
    return adminApi.getAuditLog(id)
  }

  return {
    stats, statsLoading, fetchStats,
    users, usersTotal, usersPage, usersPages, usersLoading, usersFilters, fetchUsers,
    currentUser, currentUserLoading, fetchUser, updateUser, blockUser, unblockUser, resetPassword, deleteUser,
    userContent, userContentTotal, userContentPage, userContentPages, userContentLoading, fetchUserContent, deleteContent,
    roles, rolesLoading, currentRole, fetchRoles, fetchRole, createRole, updateRole, deleteRole, setRolePermissions,
    permissionGroups, fetchPermissions,
    assignUserRole, removeUserRole,
    configs, configsLoading, currentConfig, models, fetchConfigs, fetchConfig, createConfig, updateConfig, deleteConfig, testConfig, activateConfig, fetchModels,
    auditLogs, auditTotal, auditPage, auditPages, auditLoading, auditFilters, fetchAuditLogs, fetchAuditLog,
  }
})
