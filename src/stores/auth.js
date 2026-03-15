import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '@/api/auth'
import { updateProfile as apiUpdateProfile, changePassword as apiChangePassword, deleteAccount as apiDeleteAccount } from '@/api/user'
import { clearToken } from '@/api/client'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const loading = ref(false)
  const isAuthenticated = computed(() => !!user.value)

  async function login(email, password) {
    loading.value = true
    try {
      await apiLogin(email, password)
      user.value = await getMe()
    } finally {
      loading.value = false
    }
  }

  async function register(email, username, password) {
    loading.value = true
    try {
      await apiRegister(email, username, password)
      user.value = await getMe()
    } finally {
      loading.value = false
    }
  }

  async function fetchProfile() {
    try {
      user.value = await getMe()
    } catch {
      user.value = null
    }
  }

  async function logout() {
    await apiLogout()
    user.value = null
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
  }

  return { user, loading, isAuthenticated, login, register, fetchProfile, logout, updateProfile, changePassword, deleteAccount }
})
