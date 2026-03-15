<template>
  <div class="space-y-6">
    <!-- Greeting hero -->
    <div class="relative overflow-hidden bg-gradient-to-br from-terra-500 to-terra-600 rounded-2xl p-6 sm:p-8 text-white">
      <div class="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
      <div class="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4" />
      <div class="relative z-10">
        <p class="text-terra-200 text-sm font-medium">{{ formattedDate }}</p>
        <h1 class="font-display text-3xl sm:text-4xl font-bold mt-1 leading-tight">
          {{ greeting }}<span v-if="auth.user">,<br />{{ auth.user.username }}</span>
        </h1>
      </div>
    </div>

    <!-- Quick emotion picker (compact) -->
    <section class="bg-white rounded-2xl p-5 border border-ink-100 shadow-sm animate-fadeIn" style="animation-delay: 50ms">
      <div class="flex items-center justify-between mb-4">
        <h2 class="font-display text-lg font-semibold text-ink-900">Как вы себя чувствуете?</h2>
        <RouterLink to="/emotions" class="text-xs text-terra-500 hover:text-terra-600 font-semibold">Подробнее</RouterLink>
      </div>
      <div class="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          v-for="q in quickEmotions"
          :key="q.category"
          @click="quickLog(q)"
          :disabled="quickLogging"
          class="flex flex-col items-center gap-1.5 px-4 py-3 rounded-2xl transition-all hover:shadow-md active:scale-95 shrink-0 min-w-[72px] disabled:opacity-50"
          :class="q.bg"
        >
          <span class="text-2xl">{{ q.emoji }}</span>
          <span class="text-[10px] font-semibold" :class="q.text">{{ q.label }}</span>
        </button>
      </div>
      <div v-if="todayEmotions.length" class="mt-4 pt-3 border-t border-ink-100">
        <div class="flex items-center gap-1.5 flex-wrap">
          <span class="text-[10px] text-ink-400 uppercase tracking-wider font-semibold mr-1">Сегодня:</span>
          <span
            v-for="em in todayEmotions.slice(0, 6)"
            :key="em.id"
            class="text-xs px-2 py-0.5 rounded-full font-medium"
            :class="emotionChipClass(em.emotionCategory)"
          >
            {{ em.emotionName }}
          </span>
          <span v-if="todayEmotions.length > 6" class="text-xs text-ink-400">+{{ todayEmotions.length - 6 }}</span>
        </div>
      </div>
    </section>

    <!-- Streak widget -->
    <div v-if="streaks?.currentStreak" class="bg-white rounded-2xl p-4 border border-ink-100 shadow-sm flex items-center gap-4 animate-fadeIn" style="animation-delay: 80ms">
      <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-coral-400 to-coral-500 flex items-center justify-center shadow-sm">
        <Flame class="w-6 h-6 text-white" />
      </div>
      <div>
        <p class="font-display text-2xl font-bold text-ink-900">{{ streaks.currentStreak }} {{ streakWord(streaks.currentStreak) }}</p>
        <p class="text-xs text-ink-400">Серия записей подряд</p>
      </div>
      <div class="ml-auto text-right">
        <p class="text-xs text-ink-400">Рекорд</p>
        <p class="font-display font-bold text-gold-600">{{ streaks.longestStreak ?? 0 }}</p>
      </div>
    </div>

    <!-- Portrait + Tasks row -->
    <div class="grid sm:grid-cols-2 gap-4 animate-fadeIn" style="animation-delay: 100ms">
      <!-- Mini portrait -->
      <RouterLink v-if="portrait" to="/portrait" class="bg-white rounded-2xl p-5 border border-ink-100 shadow-sm hover:shadow-md transition-shadow block">
        <h2 class="font-display text-sm font-semibold text-ink-500 mb-3 uppercase tracking-wider">Ваш портрет</h2>
        <div class="space-y-3">
          <div class="flex items-center justify-between">
            <span class="text-xs text-ink-500">Тренд</span>
            <span class="font-display font-bold text-lg" :class="trendColor">{{ trendLabel }}</span>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-ink-500">Стресс</span>
            <div class="flex items-center gap-2">
              <div class="w-20 h-1.5 bg-cream-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all"
                  :class="stressBarColor"
                  :style="{ width: `${(portrait.stressLevel || 0) * 10}%` }"
                />
              </div>
              <span class="text-xs font-bold tabular-nums" :class="stressColor">{{ portrait.stressLevel?.toFixed(1) || '—' }}</span>
            </div>
          </div>
          <div class="flex items-center justify-between">
            <span class="text-xs text-ink-500">Продуктивность</span>
            <span class="font-display font-bold text-lg text-forest-600">{{ productivityPercent }}%</span>
          </div>
        </div>
      </RouterLink>

      <!-- Tasks summary -->
      <div class="bg-white rounded-2xl p-5 border border-ink-100 shadow-sm">
        <div class="flex items-center justify-between mb-3">
          <h2 class="font-display text-sm font-semibold text-ink-500 uppercase tracking-wider">Задачи</h2>
          <RouterLink to="/tasks" class="text-xs text-terra-500 hover:text-terra-600 font-semibold">Все</RouterLink>
        </div>
        <div v-if="todayTasks.length" class="space-y-2">
          <TaskCard
            v-for="task in todayTasks.slice(0, 4)"
            :key="task.id"
            :task="task"
            @update="handleTaskUpdate"
            @remove="handleTaskRemove"
          />
          <p v-if="todayTasks.length > 4" class="text-xs text-ink-400 text-center pt-1">
            ещё {{ todayTasks.length - 4 }}
          </p>
        </div>
        <div v-else class="py-6 text-center">
          <p class="text-sm text-ink-400 mb-2">Нет задач</p>
        </div>
        <div class="mt-3 pt-3 border-t border-ink-100">
          <TaskInput @add="handleTaskAdd" />
        </div>
      </div>
    </div>

    <!-- Recommendations -->
    <section v-if="recs.length" class="animate-fadeIn" style="animation-delay: 150ms">
      <div class="flex items-center justify-between mb-3">
        <h2 class="font-display text-lg font-semibold text-ink-900">Рекомендации на сегодня</h2>
        <RouterLink to="/recommendations" class="text-xs text-terra-500 hover:text-terra-600 font-semibold">Все</RouterLink>
      </div>
      <div class="grid sm:grid-cols-3 gap-3">
        <ArticleCard
          v-for="rec in recs"
          :key="rec.id"
          :rec="rec"
          @read="recsStore.read"
          @helpful="recsStore.helpful"
        />
      </div>
    </section>

    <!-- Leya card -->
    <RouterLink
      to="/assistant"
      class="block bg-gradient-to-r from-forest-600 to-forest-700 rounded-2xl p-5 text-white transition-all hover:shadow-xl hover:scale-[1.01] active:scale-[0.99] animate-fadeIn"
      style="animation-delay: 200ms"
    >
      <div class="flex items-center gap-4">
        <div class="w-14 h-14 bg-white/15 rounded-full flex items-center justify-center shrink-0 backdrop-blur-sm">
          <MessageCircle class="w-7 h-7" />
        </div>
        <div>
          <h3 class="font-display text-xl font-bold">Поговорить с Леей</h3>
          <p class="text-forest-200 text-sm mt-0.5">Ваш личный AI-ассистент всегда рядом</p>
        </div>
        <ChevronRight class="w-5 h-5 text-forest-300 ml-auto shrink-0" />
      </div>
    </RouterLink>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useEmotionsStore } from '@/stores/emotions'
import { useTasksStore } from '@/stores/tasks'
import { useRecommendationsStore } from '@/stores/recommendations'
import { getStreaks } from '@/api/insights'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskInput from '@/components/tasks/TaskInput.vue'
import ArticleCard from '@/components/recommendations/ArticleCard.vue'
import { MessageCircle, ChevronRight, Flame } from 'lucide-vue-next'

const auth = useAuthStore()
const emotionsStore = useEmotionsStore()
const tasksStore = useTasksStore()
const recsStore = useRecommendationsStore()
const streaks = ref(null)

const today = new Date()
const todayStr = today.toISOString().slice(0, 10)
const quickLogging = ref(false)

onMounted(() => {
  emotionsStore.fetchByDate(todayStr)
  tasksStore.fetchTasks({ month: today.getMonth() + 1, year: today.getFullYear() })
  recsStore.fetchToday()
  recsStore.fetchPortrait()
  getStreaks().then(s => { streaks.value = s }).catch(() => {})
})

const greeting = computed(() => {
  const h = new Date().getHours()
  if (h < 6) return 'Доброй ночи'
  if (h < 12) return 'Доброе утро'
  if (h < 18) return 'Добрый день'
  return 'Добрый вечер'
})

const formattedDate = computed(() =>
  today.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
)

const todayEmotions = computed(() => emotionsStore.entries)
const portrait = computed(() => recsStore.portrait)
const recs = computed(() => recsStore.recommendations)
const todayTasks = computed(() =>
  tasksStore.tasks.filter(t => t.date === todayStr || !t.date).sort((a, b) => a.completed - b.completed)
)

const quickEmotions = [
  { category: 'joy', label: 'Радость', emoji: '\u2728', bg: 'bg-gradient-to-b from-gold-200 to-gold-300/60', text: 'text-gold-600' },
  { category: 'sadness', label: 'Грусть', emoji: '\uD83D\uDCA7', bg: 'bg-gradient-to-b from-sky-300/50 to-sky-400/30', text: 'text-sky-600' },
  { category: 'anxiety', label: 'Тревога', emoji: '\uD83C\uDF00', bg: 'bg-gradient-to-b from-coral-300/50 to-coral-400/30', text: 'text-coral-600' },
  { category: 'anger', label: 'Злость', emoji: '\uD83D\uDD25', bg: 'bg-gradient-to-b from-rose-300/50 to-rose-400/30', text: 'text-rose-600' },
  { category: 'fear', label: 'Страх', emoji: '\uD83D\uDCA8', bg: 'bg-gradient-to-b from-violet-300/50 to-violet-400/30', text: 'text-violet-600' },
]

const emotionChipClasses = {
  joy: 'bg-gold-200/60 text-gold-600',
  sadness: 'bg-sky-300/40 text-sky-600',
  anger: 'bg-rose-300/40 text-rose-600',
  anxiety: 'bg-coral-300/40 text-coral-600',
  fear: 'bg-violet-300/40 text-violet-600',
  disgust: 'bg-forest-200/50 text-forest-700',
}
function emotionChipClass(cat) {
  return emotionChipClasses[cat] || 'bg-cream-200 text-ink-600'
}

const trendLabel = computed(() => {
  const t = portrait.value?.moodTrend
  if (t === 'improving') return '\u2197 Улучшается'
  if (t === 'declining') return '\u2198 Ухудшается'
  return '\u2192 Стабильно'
})
const trendColor = computed(() => {
  const t = portrait.value?.moodTrend
  if (t === 'improving') return 'text-forest-500'
  if (t === 'declining') return 'text-coral-500'
  return 'text-gold-500'
})
const stressColor = computed(() => {
  const s = portrait.value?.stressLevel || 0
  if (s <= 3) return 'text-forest-500'
  if (s <= 6) return 'text-gold-500'
  return 'text-coral-500'
})
const stressBarColor = computed(() => {
  const s = portrait.value?.stressLevel || 0
  if (s <= 3) return 'bg-forest-500'
  if (s <= 6) return 'bg-gold-500'
  return 'bg-coral-500'
})
const productivityPercent = computed(() =>
  portrait.value?.productivityRate != null ? Math.round(portrait.value.productivityRate * 100) : '—'
)

function streakWord(n) {
  const r = n % 10
  const t = n % 100
  if (t >= 11 && t <= 19) return 'дней'
  if (r === 1) return 'день'
  if (r >= 2 && r <= 4) return 'дня'
  return 'дней'
}

async function quickLog(q) {
  quickLogging.value = true
  try {
    await emotionsStore.addEmotion({ emotionCategory: q.category, emotion: q.label, intensity: 5 })
  } finally {
    quickLogging.value = false
  }
}
async function handleTaskAdd(data) { await tasksStore.addTask({ ...data, date: todayStr }) }
async function handleTaskUpdate(id, data) { await tasksStore.updateTask(id, data) }
async function handleTaskRemove(id) { await tasksStore.removeTask(id) }
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
.animate-fadeIn { animation: fadeIn 0.4s ease both; }
</style>
