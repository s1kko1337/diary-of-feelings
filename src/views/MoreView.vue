<template>
  <div>
    <h1 class="more-title">Ещё</h1>

    <div class="flex flex-col gap-2">
      <router-link v-for="item in links" :key="item.to" :to="item.to" class="more-link">
        <component :is="item.icon" :size="20" class="more-link-icon" />
        <span>{{ item.label }}</span>
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { PencilIcon, BookOpenIcon, ClockIcon, BarChart3Icon, UserIcon } from 'lucide-vue-next'

const links = [
  { to: '/notes', icon: PencilIcon, label: 'Заметки' },
  { to: '/library', icon: BookOpenIcon, label: 'Библиотека' },
  { to: '/time', icon: ClockIcon, label: 'Трекер времени' },
  { to: '/report', icon: BarChart3Icon, label: 'Отчёт' },
  { to: '/profile', icon: UserIcon, label: 'Профиль' },
]
</script>

<style scoped>
.more-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1.125rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  border: 1px solid var(--color-border);
  box-shadow: var(--shadow-soft);
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 500;
  transition: all 0.2s ease;
}

.more-link:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
  background: var(--color-surface-hover);
}

.more-link-icon {
  color: var(--color-primary);
}
</style>
