import { ref, watch } from 'vue'

const STORAGE_KEY = 'dof-theme'

const isDark = ref(false)
let initialized = false

function applyTheme(dark) {
  document.documentElement.classList.toggle('dark', dark)
}

export function useTheme() {
  function initTheme() {
    if (initialized) return
    initialized = true

    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme(isDark.value)
  }

  function toggleTheme() {
    isDark.value = !isDark.value
  }

  watch(isDark, (val) => {
    localStorage.setItem(STORAGE_KEY, val ? 'dark' : 'light')
    applyTheme(val)
  })

  return { isDark, toggleTheme, initTheme }
}
