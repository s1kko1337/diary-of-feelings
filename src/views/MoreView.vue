<template>
  <div>
    <h1 class="more-title">Ещё</h1>

    <div class="flex flex-col gap-2">
      <router-link
        v-for="item in links"
        :key="item.to"
        :to="item.to"
        class="more-link"
      >
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
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.more-link {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  color: var(--color-text);
  text-decoration: none;
  transition: background 0.2s ease;
}

.more-link:hover {
  background: var(--color-surface-hover);
}

.more-link-icon {
  color: var(--color-primary);
}
</style>
