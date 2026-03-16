<template>
  <div class="admin-shell">
    <!-- Admin Sidebar -->
    <aside class="admin-sidebar hidden lg:flex flex-col">
      <div class="px-5 pt-7 pb-5">
        <RouterLink to="/" class="flex items-center gap-2 text-ink-400 hover:text-cream-200 transition-colors text-xs font-medium mb-4">
          <ArrowLeft class="w-3.5 h-3.5" />
          Вернуться в приложение
        </RouterLink>
        <div class="flex items-center gap-3">
          <div class="w-9 h-9 rounded-xl bg-terra-500/20 flex items-center justify-center">
            <Shield class="w-5 h-5 text-terra-400" />
          </div>
          <div>
            <h1 class="font-display text-lg font-bold text-cream-100 leading-tight">Admin</h1>
            <p class="text-[11px] text-ink-500 font-medium">Diary of Feelings</p>
          </div>
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
              ? 'bg-white/10 text-cream-100'
              : 'text-ink-400 hover:bg-white/5 hover:text-cream-300'
          "
        >
          <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :stroke-width="isActive(item.to) ? 2.2 : 1.8" />
          {{ item.label }}
        </RouterLink>
      </nav>

      <div v-if="auth.user" class="px-4 py-4 border-t border-white/10 mt-auto">
        <div class="flex items-center gap-3">
          <div class="w-8 h-8 rounded-full bg-terra-500/20 flex items-center justify-center text-terra-400 text-xs font-bold shrink-0">
            {{ auth.user.username?.[0]?.toUpperCase() || '?' }}
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-sm font-medium text-cream-200 truncate">{{ auth.user.username }}</p>
            <p class="text-[11px] text-ink-500 truncate">{{ auth.user.email }}</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Mobile admin header -->
    <header class="lg:hidden fixed top-0 left-0 right-0 z-40 admin-mobile-header">
      <div class="flex items-center justify-between px-4 h-14">
        <div class="flex items-center gap-3">
          <RouterLink to="/" class="p-1.5 rounded-lg hover:bg-white/10 text-ink-400 transition-colors">
            <ArrowLeft class="w-4.5 h-4.5" />
          </RouterLink>
          <div class="flex items-center gap-2">
            <Shield class="w-4.5 h-4.5 text-terra-400" />
            <span class="font-display font-bold text-cream-100">Admin</span>
          </div>
        </div>
        <button @click="mobileMenuOpen = !mobileMenuOpen" class="p-1.5 rounded-lg hover:bg-white/10 text-ink-400 transition-colors">
          <Menu v-if="!mobileMenuOpen" class="w-5 h-5" />
          <X v-else class="w-5 h-5" />
        </button>
      </div>
    </header>

    <!-- Mobile menu overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="mobileMenuOpen" class="fixed inset-0 left-64 z-50 bg-ink-900/60 backdrop-blur-sm lg:hidden" @click="mobileMenuOpen = false" />
      </Transition>
      <Transition name="slide-menu">
        <nav v-if="mobileMenuOpen" class="fixed top-0 left-0 bottom-0 z-50 w-64 admin-sidebar flex flex-col lg:hidden">
          <div class="px-5 pt-6 pb-4 flex items-center justify-between">
            <div class="flex items-center gap-2">
              <Shield class="w-5 h-5 text-terra-400" />
              <span class="font-display font-bold text-cream-100 text-lg">Admin</span>
            </div>
            <button @click="mobileMenuOpen = false" class="p-1.5 rounded-lg hover:bg-white/10 text-ink-400">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="px-3 space-y-0.5 flex-1">
            <RouterLink
              v-for="item in navItems"
              :key="item.to"
              :to="item.to"
              @click="mobileMenuOpen = false"
              class="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150"
              :class="
                isActive(item.to)
                  ? 'bg-white/10 text-cream-100'
                  : 'text-ink-400 hover:bg-white/5 hover:text-cream-300'
              "
            >
              <component :is="item.icon" class="w-[18px] h-[18px] shrink-0" :stroke-width="isActive(item.to) ? 2.2 : 1.8" />
              {{ item.label }}
            </RouterLink>
          </div>
          <div class="px-4 py-4 border-t border-white/10">
            <RouterLink to="/" @click="mobileMenuOpen = false" class="flex items-center gap-2 text-ink-400 hover:text-cream-300 text-sm font-medium transition-colors">
              <ArrowLeft class="w-4 h-4" />
              Вернуться в приложение
            </RouterLink>
          </div>
        </nav>
      </Transition>
    </Teleport>

    <!-- Main content -->
    <main class="admin-main">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Shield,
  LayoutDashboard,
  Users,
  KeyRound,
  Bot,
  ScrollText,
  ArrowLeft,
  Menu,
  X,
} from 'lucide-vue-next'

const route = useRoute()
const auth = useAuthStore()
const mobileMenuOpen = ref(false)

const navItems = [
  { to: '/admin', label: 'Дашборд', icon: LayoutDashboard, exact: true },
  { to: '/admin/users', label: 'Пользователи', icon: Users },
  { to: '/admin/roles', label: 'Роли', icon: KeyRound },
  { to: '/admin/assistant', label: 'Ассистент', icon: Bot },
  { to: '/admin/audit', label: 'Аудит', icon: ScrollText },
]

function isActive(path) {
  if (path === '/admin') return route.path === '/admin'
  return route.path.startsWith(path)
}
</script>

<style scoped>
.admin-shell {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-cream-50);
}

.admin-sidebar {
  background: linear-gradient(180deg, var(--color-ink-900) 0%, #151310 100%);
  width: 16rem;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 30;
}

.admin-mobile-header {
  background: linear-gradient(90deg, var(--color-ink-900) 0%, #151310 100%);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.admin-main {
  min-height: 100vh;
  min-height: 100dvh;
}

@media (min-width: 1024px) {
  .admin-main {
    margin-left: 16rem;
  }
}

@media (max-width: 1023px) {
  .admin-main {
    padding-top: 3.5rem;
  }
}

.slide-menu-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-menu-leave-active {
  transition: transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.slide-menu-enter-from,
.slide-menu-leave-to {
  transform: translateX(-100%);
}
</style>
