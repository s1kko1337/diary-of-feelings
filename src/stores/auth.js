import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { login as apiLogin, register as apiRegister, getMe, logout as apiLogout } from '@/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isLoading = ref(false)

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.username ?? '')

  async function fetchMe() {
    try {
      user.value = await getMe()
    } catch {
      user.value = null
    }
  }

  async function login(email, password) {
    isLoading.value = true
    try {
      await apiLogin(email, password)
      await fetchMe()
    } finally {
      isLoading.value = false
    }
  }

  async function register(email, username, password) {
    isLoading.value = true
    try {
      await apiRegister(email, username, password)
      await fetchMe()
    } finally {
      isLoading.value = false
    }
  }

  function logout() {
    apiLogout()
    user.value = null
  }

  return { user, isLoading, isAuthenticated, userName, fetchMe, login, register, logout }
})
