<template>
  <div class="space-y-6">
    <!-- Hero -->
    <div class="relative overflow-hidden bg-gradient-to-br from-ink-900 via-ink-800 to-ink-900 rounded-2xl p-6 sm:p-8 text-white">
      <div class="absolute top-0 right-0 w-56 h-56 bg-terra-500/8 rounded-full -translate-y-1/3 translate-x-1/4" />
      <div class="absolute bottom-0 left-0 w-40 h-40 bg-terra-500/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div class="relative z-10">
        <p class="text-ink-400 text-sm font-medium">{{ formattedDate }}</p>
        <h1 class="font-display text-3xl sm:text-4xl font-bold mt-1 leading-tight">
          Админ-панель
        </h1>
        <p class="text-ink-400 mt-2 text-sm">Управление системой Diary of Feelings</p>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="admin.statsLoading && !admin.stats" class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div v-for="i in 4" :key="i" class="bg-white rounded-2xl p-5 border border-ink-100 animate-pulse">
        <div class="h-4 bg-cream-200 rounded w-24 mb-3" />
        <div class="h-8 bg-cream-200 rounded w-16" />
      </div>
    </div>

    <template v-if="admin.stats">
      <!-- User stats -->
      <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          v-for="(card, i) in userCards"
          :key="card.label"
          v-bind="card"
          :delay="i * 50"
        />
      </div>

      <!-- Content stats -->
      <div>
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-3">Контент</h2>
        <div class="grid sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <ContentCard
            v-for="(card, i) in contentCards"
            :key="card.label"
            v-bind="card"
            :delay="200 + i * 40"
          />
        </div>
      </div>

      <!-- LLM Config -->
      <div class="bg-white rounded-2xl p-5 border border-ink-100 shadow-sm animate-fadeIn" style="animation-delay: 400ms">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 rounded-xl bg-forest-100 flex items-center justify-center">
            <Bot class="w-5 h-5 text-forest-600" />
          </div>
          <div>
            <h3 class="font-display font-semibold text-ink-900">Активный ассистент</h3>
            <p class="text-xs text-ink-400">Текущая конфигурация LLM</p>
          </div>
        </div>
        <div class="grid sm:grid-cols-3 gap-4">
          <div>
            <p class="text-xs text-ink-400 uppercase tracking-wider font-semibold mb-1">Конфигурация</p>
            <p class="text-sm font-medium text-ink-800">{{ admin.stats.activeAssistantConfig || 'Не задана' }}</p>
          </div>
          <div>
            <p class="text-xs text-ink-400 uppercase tracking-wider font-semibold mb-1">Провайдер</p>
            <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="admin.stats.llmProvider === 'anthropic' ? 'bg-violet-300/30 text-violet-600' : 'bg-forest-200/50 text-forest-700'">
              {{ admin.stats.llmProvider || '—' }}
            </span>
          </div>
          <div>
            <p class="text-xs text-ink-400 uppercase tracking-wider font-semibold mb-1">Модель</p>
            <p class="text-sm font-medium text-ink-800 font-mono">{{ admin.stats.llmModel || '—' }}</p>
          </div>
        </div>
      </div>

      <!-- Quick links -->
      <div class="grid sm:grid-cols-3 gap-3">
        <RouterLink
          v-for="link in quickLinks"
          :key="link.to"
          :to="link.to"
          class="flex items-center gap-3 bg-white rounded-xl p-4 border border-ink-100 hover:border-terra-200 hover:shadow-sm transition-all group"
        >
          <div class="w-9 h-9 rounded-lg flex items-center justify-center transition-colors" :class="link.iconBg">
            <component :is="link.icon" class="w-4.5 h-4.5" :class="link.iconColor" />
          </div>
          <div>
            <p class="text-sm font-medium text-ink-800 group-hover:text-terra-600 transition-colors">{{ link.label }}</p>
            <p class="text-xs text-ink-400">{{ link.desc }}</p>
          </div>
          <ChevronRight class="w-4 h-4 text-ink-300 ml-auto shrink-0" />
        </RouterLink>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useAdminStore } from '@/stores/admin'
import { Bot, Users, KeyRound, ScrollText, ChevronRight, UserPlus, UserCheck, Heart, BookOpen, CheckSquare, Brain, MessageCircle } from 'lucide-vue-next'

const admin = useAdminStore()

onMounted(() => {
  admin.fetchStats()
})

const formattedDate = computed(() =>
  new Date().toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
)

const userCards = computed(() => {
  const s = admin.stats
  if (!s) return []
  return [
    { label: 'Всего', value: s.totalUsers, icon: Users, color: 'terra' },
    { label: 'Активных', value: s.activeUsers, icon: UserCheck, color: 'forest' },
    { label: 'Новых сегодня', value: s.newUsersToday, icon: UserPlus, color: 'sky' },
    { label: 'За неделю', value: s.newUsersWeek, icon: UserPlus, color: 'violet' },
  ]
})

const contentCards = computed(() => {
  const s = admin.stats
  if (!s) return []
  return [
    { label: 'Эмоции', value: s.totalEmotions, icon: Heart, color: 'coral' },
    { label: 'Заметки', value: s.totalNotes, icon: BookOpen, color: 'gold' },
    { label: 'Задачи', value: s.totalTasks, icon: CheckSquare, color: 'forest' },
    { label: 'КПТ', value: s.totalCbt, icon: Brain, color: 'violet' },
    { label: 'Сообщения', value: s.totalChatMessages, icon: MessageCircle, color: 'sky' },
  ]
})

const quickLinks = [
  { to: '/admin/users', label: 'Пользователи', desc: 'Управление аккаунтами', icon: Users, iconBg: 'bg-terra-50 group-hover:bg-terra-100', iconColor: 'text-terra-500' },
  { to: '/admin/roles', label: 'Роли и права', desc: 'Настройка доступа', icon: KeyRound, iconBg: 'bg-violet-300/20 group-hover:bg-violet-300/30', iconColor: 'text-violet-600' },
  { to: '/admin/audit', label: 'Аудит', desc: 'Журнал действий', icon: ScrollText, iconBg: 'bg-ink-100 group-hover:bg-ink-200', iconColor: 'text-ink-600' },
]
</script>

<script>
import { h } from 'vue'

const colorMap = {
  terra: { bg: 'bg-terra-50', iconBg: 'bg-terra-100', text: 'text-terra-600' },
  forest: { bg: 'bg-forest-200/30', iconBg: 'bg-forest-200/60', text: 'text-forest-600' },
  sky: { bg: 'bg-sky-300/20', iconBg: 'bg-sky-300/40', text: 'text-sky-600' },
  violet: { bg: 'bg-violet-300/20', iconBg: 'bg-violet-300/40', text: 'text-violet-600' },
  coral: { bg: 'bg-coral-300/20', iconBg: 'bg-coral-300/40', text: 'text-coral-600' },
  gold: { bg: 'bg-gold-200/40', iconBg: 'bg-gold-200/70', text: 'text-gold-600' },
}

const StatCard = {
  props: ['label', 'value', 'icon', 'color', 'delay'],
  setup(props) {
    const c = colorMap[props.color] || colorMap.terra
    return () => h('div', {
      class: 'bg-white rounded-2xl p-5 border border-ink-100 shadow-sm animate-fadeIn',
      style: `animation-delay: ${props.delay || 0}ms`,
    }, [
      h('div', { class: 'flex items-center justify-between mb-3' }, [
        h('p', { class: 'text-xs text-ink-400 uppercase tracking-wider font-semibold' }, props.label),
        h('div', { class: `w-8 h-8 rounded-lg ${c.iconBg} flex items-center justify-center` }, [
          h(props.icon, { class: `w-4 h-4 ${c.text}`, 'stroke-width': 2 }),
        ]),
      ]),
      h('p', { class: `font-display text-3xl font-bold ${c.text}` }, formatNum(props.value)),
    ])
  },
}

const ContentCard = {
  props: ['label', 'value', 'icon', 'color', 'delay'],
  setup(props) {
    const c = colorMap[props.color] || colorMap.terra
    return () => h('div', {
      class: `${c.bg} rounded-xl p-4 animate-fadeIn`,
      style: `animation-delay: ${props.delay || 0}ms`,
    }, [
      h('div', { class: 'flex items-center gap-2 mb-2' }, [
        h(props.icon, { class: `w-4 h-4 ${c.text}`, 'stroke-width': 2 }),
        h('span', { class: 'text-xs font-semibold text-ink-500' }, props.label),
      ]),
      h('p', { class: `font-display text-2xl font-bold ${c.text}` }, formatNum(props.value)),
    ])
  },
}

function formatNum(n) {
  if (n == null) return '—'
  if (n >= 10000) return (n / 1000).toFixed(1) + 'k'
  return n.toLocaleString('ru-RU')
}

export default {
  components: { StatCard, ContentCard },
}
</script>

<style scoped>
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.animate-fadeIn { animation: fadeIn 0.4s ease both; }
</style>
