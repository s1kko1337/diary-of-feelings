<template>
  <header class="mobile-header lg:hidden">
    <router-link to="/" class="mobile-header-logo">
      <div class="mobile-header-mark" />
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

.mobile-header-mark {
  width: 18px;
  height: 18px;
  background: var(--color-accent);
}

.mobile-header-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  cursor: pointer;
  transition: all 0.2s ease;
}

.mobile-header-btn:hover {
  color: var(--color-accent);
}
</style>
