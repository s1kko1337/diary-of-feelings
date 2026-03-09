<template>
  <nav class="bottom-nav">
    <div class="bottom-nav-inner">
      <router-link
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="bottom-nav-item"
        :class="{
          'bottom-nav-item--active': isActive(item),
          'bottom-nav-item--center': item.isCenter,
        }"
      >
        <div class="bottom-nav-item__icon">
          <component :is="item.icon" :size="item.isCenter ? 24 : 22" :stroke-width="1.8" />
        </div>
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { useRoute } from 'vue-router'
import {
  CheckSquareIcon,
  HeartIcon,
  HomeIcon,
  BotIcon,
  BarChart3Icon,
} from 'lucide-vue-next'

const route = useRoute()

const navItems = [
  { to: '/tasks', icon: CheckSquareIcon, label: 'Задачи', group: ['tasks'] },
  { to: '/emotions', icon: HeartIcon, label: 'Эмоции', group: ['emotions', 'cbt', 'cbt-new', 'cbt-entry'] },
  { to: '/home', icon: HomeIcon, label: 'Главная', isCenter: true, group: ['home'] },
  { to: '/assistant', icon: BotIcon, label: 'Помощник', group: ['assistant'] },
  { to: '/report', icon: BarChart3Icon, label: 'Отчёт', group: ['report'] },
]

function isActive(item) {
  return item.group.includes(route.name)
}
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  display: flex;
  justify-content: center;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
  padding-bottom: env(safe-area-inset-bottom);
}

.bottom-nav-inner {
  display: flex;
  align-items: flex-end;
  justify-content: space-around;
  width: 100%;
  max-width: 720px;
  height: var(--bottom-nav-height);
  padding: 0 4px 8px;
}

.bottom-nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  flex: 1;
  padding: 6px 4px;
  border-radius: var(--radius-md);
  font-size: 0.63rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.bottom-nav-item__icon {
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s ease;
}

.bottom-nav-item:active .bottom-nav-item__icon {
  transform: scale(0.9);
}

.bottom-nav-item--active {
  color: var(--color-accent);
}

.bottom-nav-item--active::before {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 20px;
  height: 2px;
  background: var(--color-accent);
  border-radius: 0 0 2px 2px;
}

/* Center home — elevated circle button */
.bottom-nav-item--center {
  flex: 0 0 64px;
  position: relative;
  top: -10px;
  gap: 2px;
  padding: 0 0 4px;
}

.bottom-nav-item--center .bottom-nav-item__icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--color-bg);
  border: 1.5px solid var(--color-border);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.bottom-nav-item--center.bottom-nav-item--active .bottom-nav-item__icon {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: #fff;
  box-shadow: 0 4px 16px color-mix(in srgb, var(--color-accent) 40%, transparent);
}

.bottom-nav-item--center::before {
  display: none;
}
</style>
