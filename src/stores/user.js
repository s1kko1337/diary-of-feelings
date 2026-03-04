import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import * as userApi from '@/api/user'

export const useUserStore = defineStore('user', () => {
  const profile = ref(null)
  const isLoading = ref(false)

  const isOnboarded = computed(() => profile.value?.onboardingCompleted ?? false)
  const userName = computed(() => profile.value?.name ?? '')
  const theme = computed(() => profile.value?.preferences?.theme ?? 'light')
  const cbtMode = computed(() => profile.value?.preferences?.cbtMode ?? 'basic')
  const preferences = computed(() => profile.value?.preferences ?? {})

  async function fetchProfile() {
    isLoading.value = true
    try {
      profile.value = await userApi.getProfile()
    } finally {
      isLoading.value = false
    }
  }

  async function updateProfile(data) {
    profile.value = await userApi.updateProfile(data)
  }

  async function updatePreferences(data) {
    profile.value = await userApi.updatePreferences(data)
  }

  async function completeOnboarding(answers) {
    profile.value = await userApi.completeOnboarding(answers)
  }

  return {
    profile,
    isLoading,
    isOnboarded,
    userName,
    theme,
    cbtMode,
    preferences,
    fetchProfile,
    updateProfile,
    updatePreferences,
    completeOnboarding,
  }
})
