<template>
  <div>
    <!-- Bottom navigation bar — always fixed at viewport bottom -->
    <nav class="mobile-nav">
      <div class="mobile-nav-inner">
        <RouterLink
          v-for="item in mainItems"
          :key="item.to"
          :to="item.to"
          class="nav-item"
          :class="isActive(item.to) ? 'nav-item--active' : 'nav-item--idle'"
        >
          <span class="nav-icon-wrap" :class="isActive(item.to) ? 'nav-icon-wrap--active' : ''">
            <component :is="item.icon" class="w-[20px] h-[20px]" :stroke-width="isActive(item.to) ? 2.4 : 1.6" />
          </span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="isActive(item.to)" class="nav-dot" />
        </RouterLink>

        <button
          @click="menuOpen = !menuOpen"
          class="nav-item"
          :class="menuOpen || moreIsActive ? 'nav-item--active' : 'nav-item--idle'"
        >
          <span class="nav-icon-wrap" :class="menuOpen || moreIsActive ? 'nav-icon-wrap--active' : ''">
            <LayoutGrid v-if="!menuOpen" class="w-[20px] h-[20px]" :stroke-width="moreIsActive ? 2.4 : 1.6" />
            <X v-else class="w-[20px] h-[20px]" :stroke-width="2" />
          </span>
          <span class="nav-label">Ещё</span>
          <span v-if="moreIsActive && !menuOpen" class="nav-dot" />
        </button>
      </div>
    </nav>

    <!-- Slide-up "More" panel -->
    <Teleport to="body">
      <Transition name="overlay">
        <div v-if="menuOpen" class="fixed inset-0 z-[99] bg-ink-900/25 backdrop-blur-[2px]" @click="menuOpen = false" />
      </Transition>

      <Transition name="sheet">
        <div v-if="menuOpen" class="more-sheet">
          <div class="w-9 h-1 bg-ink-200 rounded-full mx-auto mb-4 shrink-0" />

          <div class="grid grid-cols-3 gap-3">
            <RouterLink
              v-for="item in moreItems"
              :key="item.to"
              :to="item.to"
              @click="menuOpen = false"
              class="more-item"
              :class="isActive(item.to) ? 'more-item--active' : 'more-item--idle'"
            >
              <div
                class="w-11 h-11 rounded-2xl flex items-center justify-center mb-1.5 transition-colors"
                :class="isActive(item.to) ? 'bg-terra-100 text-terra-600' : 'bg-cream-200 text-ink-500'"
              >
                <component :is="item.icon" class="w-5 h-5" :stroke-width="1.8" />
              </div>
              <span class="text-[11px] font-semibold leading-tight text-center">{{ item.label }}</span>
            </RouterLink>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import {
  Home,
  Heart,
  MessageCircle,
  CheckSquare,
  LayoutGrid,
  X,
  BookOpen,
  Brain,
  BarChart3,
  Sparkles,
  Fingerprint,
  Settings,
  Shield,
} from 'lucide-vue-next'

const route = useRoute()
const auth = useAuthStore()
const menuOpen = ref(false)

const mainItems = [
  { to: '/', label: 'Главная', icon: Home },
  { to: '/emotions', label: 'Эмоции', icon: Heart },
  { to: '/assistant', label: 'Лея', icon: MessageCircle },
  { to: '/tasks', label: 'Задачи', icon: CheckSquare },
]

const baseMoreItems = [
  { to: '/notes', label: 'Заметки', icon: BookOpen },
  { to: '/cbt', label: 'КПТ', icon: Brain },
  { to: '/reports', label: 'Аналитика', icon: BarChart3 },
  { to: '/recommendations', label: 'Статьи', icon: Sparkles },
  { to: '/portrait', label: 'Портрет', icon: Fingerprint },
  { to: '/settings', label: 'Настройки', icon: Settings },
]

const moreItems = computed(() => {
  if (auth.isAdmin) {
    return [...baseMoreItems, { to: '/admin', label: 'Админ', icon: Shield }]
  }
  return baseMoreItems
})

const morePaths = computed(() => moreItems.value.map(i => i.to))

function isActive(path) {
  if (path === '/') return route.path === '/'
  return route.path.startsWith(path)
}

const moreIsActive = computed(() => morePaths.value.some(p => route.path.startsWith(p)))
</script>

<style scoped>
/* ---- Bottom nav bar ---- */
.mobile-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 90;
  background: rgba(255, 255, 255, 0.92);
  backdrop-filter: blur(16px) saturate(1.4);
  -webkit-backdrop-filter: blur(16px) saturate(1.4);
  border-top: 1px solid var(--color-ink-100);
  padding-bottom: env(safe-area-inset-bottom, 0px);
}

.mobile-nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-around;
  height: 56px;
  max-width: 480px;
  margin: 0 auto;
  padding: 0 4px;
}

/* ---- Nav item ---- */
.nav-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  min-width: 56px;
  padding: 4px 8px;
  border-radius: 12px;
  transition: color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
  user-select: none;
}

.nav-item--active {
  color: var(--color-terra-500);
}

.nav-item--idle {
  color: var(--color-ink-400);
}

.nav-item--idle:active {
  color: var(--color-ink-600);
}

/* Icon wrap with subtle bg on active */
.nav-icon-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 28px;
  border-radius: 10px;
  transition: background-color 0.2s ease, transform 0.15s ease;
}

.nav-icon-wrap--active {
  background-color: var(--color-terra-50);
}

.nav-item:active .nav-icon-wrap {
  transform: scale(0.9);
}

.nav-label {
  font-size: 10px;
  font-weight: 600;
  line-height: 1;
  letter-spacing: 0.01em;
}

/* Active indicator dot */
.nav-dot {
  position: absolute;
  bottom: 0px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-terra-500);
  animation: dotIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
}

@keyframes dotIn {
  from { transform: scale(0); opacity: 0; }
  to { transform: scale(1); opacity: 1; }
}

/* ---- More sheet ---- */
.more-sheet {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
  background: white;
  border-radius: 20px 20px 0 0;
  padding: 14px 20px calc(76px + env(safe-area-inset-bottom, 0px));
  box-shadow: 0 -8px 40px rgba(0, 0, 0, 0.08);
}

.more-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 12px 4px;
  border-radius: 16px;
  transition: background-color 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.more-item--active {
  color: var(--color-terra-600);
}

.more-item--idle {
  color: var(--color-ink-700);
}

.more-item:active {
  background-color: var(--color-cream-200);
}

/* ---- Transitions ---- */
.overlay-enter-active,
.overlay-leave-active {
  transition: opacity 0.2s ease;
}
.overlay-enter-from,
.overlay-leave-to {
  opacity: 0;
}

.sheet-enter-active {
  transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.2s ease;
}
.sheet-leave-active {
  transition: transform 0.25s cubic-bezier(0.4, 0, 1, 1), opacity 0.15s ease;
}
.sheet-enter-from {
  transform: translateY(100%);
  opacity: 0;
}
.sheet-leave-to {
  transform: translateY(100%);
  opacity: 0;
}
</style>
