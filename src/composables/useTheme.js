import { ref, watch } from 'vue'

const STORAGE_KEY = 'diary-theme'

const isDark = ref(localStorage.getItem(STORAGE_KEY) === 'dark')

function applyTheme() {
  document.documentElement.classList.toggle('dark', isDark.value)
}

applyTheme()

watch(isDark, () => {
  localStorage.setItem(STORAGE_KEY, isDark.value ? 'dark' : 'light')
  applyTheme()
})

export function useTheme() {
  function toggleTheme() {
    isDark.value = !isDark.value
  }

  return { isDark, toggleTheme }
}
