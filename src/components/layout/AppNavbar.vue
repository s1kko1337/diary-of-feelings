<template>
  <nav class="navbar hidden lg:flex">
    <div class="navbar-inner">
      <!-- Logo -->
      <router-link to="/" class="navbar-logo">
        <div class="navbar-logo-orb" />
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
  top: 16px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 50;
  width: calc(100% - 48px);
  max-width: 960px;
}

.navbar-inner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--color-surface);
  -webkit-backdrop-filter: blur(24px);
  backdrop-filter: blur(24px);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-card);
}

/* Logo */
.navbar-logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 14px 6px 10px;
  text-decoration: none;
  color: var(--color-text);
  font-size: 0.85rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  white-space: nowrap;
  flex-shrink: 0;
}

.navbar-logo-orb {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-lavender), var(--color-peach), var(--color-mint));
  box-shadow: 0 2px 8px rgb(184 165 216 / 0.3);
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
  border-radius: var(--radius-full);
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
  color: var(--color-text);
  background: var(--color-primary-soft);
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
