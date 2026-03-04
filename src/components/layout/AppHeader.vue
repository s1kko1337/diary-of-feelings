<template>
  <header class="mobile-header lg:hidden">
    <router-link to="/" class="mobile-header-logo">
      <div class="mobile-header-orb" />
      <span>Diary of Feelings</span>
    </router-link>

    <button class="mobile-header-btn" @click="toggleTheme">
      <MoonIcon v-if="!isDark" :size="18" :stroke-width="1.8" />
      <SunIcon v-else :size="18" :stroke-width="1.8" />
    </button>
  </header>
</template>

<script setup>
import { MoonIcon, SunIcon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()
</script>

<style scoped>
.mobile-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
}

.mobile-header-logo {
  display: flex;
  align-items: center;
  gap: 10px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.mobile-header-orb {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-lavender), var(--color-peach), var(--color-mint));
  box-shadow: 0 2px 8px rgb(184 165 216 / 0.3);
}

.mobile-header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  color: var(--color-text-muted);
  background: var(--color-surface);
  backdrop-filter: blur(12px);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-header-btn:hover {
  color: var(--color-primary);
}
</style>
