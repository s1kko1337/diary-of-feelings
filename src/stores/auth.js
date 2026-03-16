import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '@/api/auth'
import { updateProfile as apiUpdateProfile, changePassword as apiChangePassword, deleteAccount as apiDeleteAccount } from '@/api/user'
import { clearToken } from '@/api/client'
import { getPermissions as apiGetPermissions } from '@/api/admin'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const adminPermissions = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const isAdmin = computed(() => adminPermissions.value !== null && adminPermissions.value.length > 0)

  function hasPermission(codename) {
    if (!adminPermissions.value) return false
    return adminPermissions.value.some(p => p.codename === codename)
  }

  async function checkAdminAccess() {
    try {
      const groups = await apiGetPermissions()
      const allPerms = Array.isArray(groups) ? groups.flatMap(g => g.permissions || []) : []
      adminPermissions.value = allPerms.length > 0 ? allPerms : null
    } catch {
      adminPermissions.value = null
    }
  }

  async function login(email, password) {
    loading.value = true
    try {
      await apiLogin(email, password)
      user.value = await getMe()
      await checkAdminAccess()
    } finally {
      loading.value = false
    }
  }

  async function register(email, username, password) {
    loading.value = true
    try {
      await apiRegister(email, username, password)
      user.value = await getMe()
      adminPermissions.value = null
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    try {
      user.value = await getMe()
      await checkAdminAccess()
    } catch {
      user.value = null
      adminPermissions.value = null
    }
  }

  async function logout() {
    await apiLogout()
    user.value = null
    adminPermissions.value = null
  }

  async function updateProfile(data) {
    const updated = await apiUpdateProfile(data)
    if (updated) user.value = { ...user.value, ...updated }
    return updated
  }

  async function changePassword(data) {
    return apiChangePassword(data)
  }

  async function deleteAccount() {
    await apiDeleteAccount()
    clearToken()
    user.value = null
    adminPermissions.value = null
  }

  return { user, loading, isAuthenticated, isAdmin, adminPermissions, hasPermission, login, register, fetchProfile, logout, updateProfile, changePassword, deleteAccount }
})
