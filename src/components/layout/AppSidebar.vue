<template>
  <aside class="fixed left-0 top-0 h-screen w-64 bg-white border-r border-ink-100 flex-col z-30">
    <div class="px-6 pt-8 pb-6">
      <div class="flex items-start justify-between">
        <RouterLink to="/" class="block">
          <h1 class="font-display text-2xl font-bold tracking-tight leading-tight">
            Diary of<br /><span class="text-terra-500">Feelings</span>
          </h1>
        </RouterLink>
        <button
          @click="$emit('openSearch')"
          class="p-2 rounded-xl hover:bg-cream-200 text-ink-400 hover:text-ink-600 transition-colors mt-0.5"
          title="Поиск (Ctrl+K)"
        >
          <Search class="w-4.5 h-4.5" />
        </button>
      </div>
    </div>

    <nav class="flex-1 px-3 space-y-0.5 overflow-y-auto">
      <RouterLink
        v-for="item in navItems"
        :key="item.to"
        :to="item.to"
        class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
        :class="
          isActive(item.to)
            ? 'bg-terra-50 text-terra-600'
            : 'text-ink-500 hover:bg-cream-100 hover:text-ink-700'
        "
      >
        <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :stroke-width="isActive(item.to) ? 2.2 : 1.8" />
        {{ item.label }}
      </RouterLink>
    </nav>

    <div v-if="auth.user" class="px-4 py-4 border-t border-ink-100 mt-auto">
      <div class="flex items-center gap-3">
        <RouterLink to="/settings" class="flex items-center gap-3 flex-1 min-w-0 rounded-lg hover:bg-cream-100 -ml-1 pl-1 py-0.5 transition-colors">
          <div
            class="w-9 h-9 rounded-full bg-terra-100 flex items-center justify-center text-terra-600 text-sm font-bold shrink-0"
          >
            {{ auth.user.username?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-ink-800 truncate">{{ auth.user.username }}</p>
            <p class="text-xs text-ink-400 truncate">{{ auth.user.email }}</p>
          </div>
        </RouterLink>
        <button
          @click="handleLogout"
          class="p-1.5 rounded-lg hover:bg-cream-200 text-ink-400 hover:text-ink-600 transition-colors"
          title="Выйти"
        >
          <LogOut class="w-4 h-4" />
        </button>
      </div>
    </div>
  </aside>
</template>

<script setup>
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Home,
  Heart,
  CheckSquare,
  BookOpen,
  Brain,
  MessageCircle,
  BarChart3,
  Sparkles,
  Fingerprint,
  Settings,
  Search,
  LogOut,
} from 'lucide-vue-next'

const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const navItems = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/emotions', label: 'Эмоции', icon: Heart },
  { to: '/tasks', label: 'Задачи', icon: CheckSquare },
  { to: '/notes', label: 'Заметки', icon: BookOpen },
  { to: '/cbt', label: 'КПТ дневник', icon: Brain },
  { to: '/assistant', label: 'Лея', icon: MessageCircle },
  { to: '/reports', label: 'Аналитика', icon: BarChart3 },
  { to: '/recommendations', label: 'Статьи', icon: Sparkles },
  { to: '/portrait', label: 'Портрет', icon: Fingerprint },
  { to: '/settings', label: 'Настройки', icon: Settings },
]

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

defineEmits(['openSearch'])

async function handleLogout() {
  await auth.logout()
  router.push({ name: 'auth' })
}
</script>
