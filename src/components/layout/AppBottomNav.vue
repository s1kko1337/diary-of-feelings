<template>
  <nav class="bottom-nav lg:hidden">
    <div class="bottom-nav-inner">
      <router-link
        v-for="item in items"
        :key="item.to"
        :to="item.to"
        class="bottom-nav-item"
        active-class="bottom-nav-item--active"
      >
        <component :is="item.icon" :size="22" :stroke-width="1.8" />
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </nav>
</template>

<script setup>
import { HomeIcon, HeartIcon, BrainIcon, CheckSquareIcon, EllipsisIcon } from 'lucide-vue-next'

const items = [
  { to: '/', icon: HomeIcon, label: 'Главная' },
  { to: '/emotions', icon: HeartIcon, label: 'Эмоции' },
  { to: '/cbt', icon: BrainIcon, label: 'КПТ' },
  { to: '/tasks', icon: CheckSquareIcon, label: 'Задачи' },
  { to: '/more', icon: EllipsisIcon, label: 'Ещё' },
]
</script>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 30;
  background: var(--color-bg);
  border-top: 1px solid var(--color-border);
}

.bottom-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: calc(var(--bottom-nav-height) - 12px);
  padding: 0 8px;
}

.bottom-nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  padding: 8px 14px;
  border-radius: var(--radius-md);
  font-size: 0.65rem;
  font-weight: 500;
  letter-spacing: 0.02em;
  color: var(--color-text-muted);
  text-decoration: none;
  transition: color 0.2s ease;
}

.bottom-nav-item:hover:not(.bottom-nav-item--active) {
  color: var(--color-text-secondary);
}

.bottom-nav-item--active {
  color: var(--color-accent);
  background: transparent;
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
</style>
