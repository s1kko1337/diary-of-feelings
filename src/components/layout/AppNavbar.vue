<template>
  <nav class="navbar hidden lg:flex">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <div class="navbar-logo-mark" />
        <span>Diary of Feelings</span>
      </router-link>

      <!-- Links -->
      <div class="navbar-links">
        <router-link
          v-for="item in navItems"
          :key="item.to"
          :to="item.to"
          class="navbar-link"
          active-class="navbar-link--active"
        >
          {{ item.label }}
        </router-link>
      </div>

      <!-- Right side -->
      <div class="navbar-actions">
        <router-link
          to="/profile"
          class="navbar-link navbar-link--icon"
          active-class="navbar-link--active"
        >
          <UserIcon :size="18" :stroke-width="1.8" />
        </router-link>
        <button class="navbar-link navbar-link--icon" @click="toggleTheme">
          <MoonIcon v-if="!isDark" :size="18" :stroke-width="1.8" />
          <SunIcon v-else :size="18" :stroke-width="1.8" />
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { UserIcon, MoonIcon, SunIcon } from 'lucide-vue-next'
import { useTheme } from '@/composables/useTheme'

const { isDark, toggleTheme } = useTheme()

const navItems = [
  { to: '/', label: 'Главная' },
  { to: '/emotions', label: 'Эмоции' },
  { to: '/cbt', label: 'КПТ' },
  { to: '/tasks', label: 'Задачи' },
  { to: '/notes', label: 'Заметки' },
  { to: '/library', label: 'Библиотека' },
  { to: '/report', label: 'Отчёт' },
]
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 24px;
  height: 56px;
  max-width: 960px;
  margin: 0 auto;
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 0;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  white-space: nowrap;
  flex-shrink: 0;
}

.navbar-logo-mark {
  width: 20px;
  height: 20px;
  background: var(--color-accent);
}

/* Links */
.navbar-links {
  display: flex;
  align-items: center;
  gap: 2px;
  flex: 1;
  justify-content: center;
}

.navbar-link {
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  text-decoration: none;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.navbar-link:hover {
  color: var(--color-text);
  background: var(--color-surface-hover);
}

.navbar-link--active {
  color: var(--color-accent-text);
  background: var(--color-accent-soft);
}

.navbar-link--icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  cursor: pointer;
  border: none;
  background: none;
}

/* Right actions */
.navbar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
  flex-shrink: 0;
}
</style>
