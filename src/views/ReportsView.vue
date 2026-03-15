<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <h1 class="font-display text-3xl font-bold text-ink-900">Аналитика</h1>
      <div class="flex bg-cream-200 rounded-xl p-1">
        <button
          v-for="p in periods"
          :key="p.value"
          @click="changePeriod(p.value)"
          class="px-4 py-1.5 rounded-lg text-xs font-semibold transition-all"
          :class="store.period === p.value ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'"
        >
          {{ p.label }}
        </button>
      </div>
    </div>

    <!-- Custom date range -->
    <Transition name="fade">
      <div v-if="store.period === 'custom'" class="flex items-center gap-3 bg-white rounded-xl p-3 border border-ink-100">
        <input
          type="date"
          v-model="customFrom"
          class="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none"
        />
        <span class="text-ink-400 text-sm">&mdash;</span>
        <input
          type="date"
          v-model="customTo"
          class="flex-1 rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-700 focus:border-terra-400 focus:outline-none"
        />
        <button
          @click="applyCustomRange"
          class="px-3 py-1.5 rounded-lg bg-terra-500 text-white text-sm font-medium hover:bg-terra-600 transition-colors"
        >
          Показать
        </button>
      </div>
    </Transition>

    <div v-if="store.loading" class="text-sm text-ink-400 text-center py-16">Загрузка отчётов...</div>

    <template v-else>
      <!-- Emotion Report -->
      <section v-if="store.emotionReport" class="bg-white rounded-2xl border border-ink-100 overflow-hidden">
        <div class="px-5 pt-5 pb-0">
          <h2 class="font-display text-lg font-semibold text-ink-900">Эмоции</h2>
        </div>
        <div class="grid grid-cols-3 gap-px bg-ink-100 mt-4">
          <div class="bg-white p-4 text-center">
            <p class="text-2xl font-display font-bold text-ink-900">{{ store.emotionReport.total }}</p>
            <p class="text-[10px] text-ink-400 mt-1 uppercase tracking-wider">Записей</p>
          </div>
          <div class="bg-white p-4 text-center">
            <p class="text-2xl font-display font-bold text-coral-500">{{ store.emotionReport.averageIntensity?.toFixed(1) || '—' }}</p>
            <p class="text-[10px] text-ink-400 mt-1 uppercase tracking-wider">Ср. сила</p>
          </div>
          <div class="bg-white p-4 text-center">
            <p class="text-2xl font-display font-bold text-violet-500 truncate">{{ topEmotionName }}</p>
            <p class="text-[10px] text-ink-400 mt-1 uppercase tracking-wider">Частая</p>
          </div>
        </div>

        <!-- Top emotions chart -->
        <div v-if="store.emotionReport.topEmotions?.length" class="p-5 pt-4">
          <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-3">Топ эмоций</p>
          <div class="space-y-3">
            <div v-for="(em, i) in store.emotionReport.topEmotions.slice(0, 6)" :key="em.name" class="flex items-center gap-3">
              <span class="text-xs font-semibold text-ink-500 w-5 text-right">{{ i + 1 }}</span>
              <span class="text-sm text-ink-700 w-28 truncate">{{ em.name }}</span>
              <div class="flex-1 h-4 bg-cream-200 rounded-full overflow-hidden">
                <div
                  class="h-full rounded-full transition-all duration-700"
                  :class="barColors[i % barColors.length]"
                  :style="{ width: `${(em.count / maxEmotionCount) * 100}%` }"
                />
              </div>
              <span class="text-xs font-bold text-ink-600 w-6 text-right tabular-nums">{{ em.count }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- CBT Report -->
      <section v-if="store.cbtReport" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">КПТ записи</h2>

        <div class="flex gap-2 mb-4">
          <div v-for="s in cbtStatuses" :key="s.key" class="flex-1 rounded-xl p-3 text-center" :class="s.bg">
            <p class="text-xl font-display font-bold" :class="s.text">{{ cbtStatusCount(s.key) }}</p>
            <p class="text-[10px] mt-0.5 font-semibold" :class="s.subtext">{{ s.label }}</p>
          </div>
        </div>

        <div v-if="store.cbtReport.total" class="h-3 bg-cream-200 rounded-full overflow-hidden flex">
          <div class="bg-sky-400 transition-all" :style="{ width: `${cbtPct('new')}%` }" />
          <div class="bg-gold-400 transition-all" :style="{ width: `${cbtPct('inProgress')}%` }" />
          <div class="bg-forest-400 transition-all" :style="{ width: `${cbtPct('processed')}%` }" />
        </div>

        <div v-if="store.cbtReport.topDistortions?.length" class="mt-5 pt-4 border-t border-ink-100">
          <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-3">Частые искажения</p>
          <div class="space-y-2">
            <div v-for="d in store.cbtReport.topDistortions.slice(0, 5)" :key="d.name" class="flex items-center gap-3">
              <span class="text-sm text-ink-700 flex-1">{{ d.name }}</span>
              <div class="w-20 h-2 bg-cream-200 rounded-full overflow-hidden">
                <div
                  class="h-full bg-violet-400 rounded-full"
                  :style="{ width: `${(d.count / maxDistortionCount) * 100}%` }"
                />
              </div>
              <span class="text-xs font-bold text-ink-500 w-4 text-right tabular-nums">{{ d.count }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Tasks Report -->
      <section v-if="store.tasksReport" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">Задачи</h2>
        <div class="flex items-center gap-6">
          <div class="text-center">
            <p class="text-3xl font-display font-bold text-ink-900">{{ store.tasksReport.total }}</p>
            <p class="text-[10px] text-ink-400 mt-1 uppercase tracking-wider">Всего</p>
          </div>
          <div v-if="store.tasksReport.completedCount != null" class="text-center">
            <p class="text-3xl font-display font-bold text-forest-600">{{ store.tasksReport.completedCount }}</p>
            <p class="text-[10px] text-ink-400 mt-1 uppercase tracking-wider">Выполнено</p>
          </div>
          <div v-if="store.tasksReport.byColor && Object.keys(store.tasksReport.byColor).length" class="flex-1">
            <div class="flex gap-1 h-6 rounded-full overflow-hidden">
              <div
                v-for="(count, color) in store.tasksReport.byColor"
                :key="color"
                class="transition-all"
                :class="taskBarColor(color)"
                :style="{ flex: count }"
              />
            </div>
            <div class="flex flex-wrap gap-3 mt-2">
              <div v-for="(count, color) in store.tasksReport.byColor" :key="color" class="flex items-center gap-1.5">
                <span class="w-2.5 h-2.5 rounded-full" :class="taskDotColor(color)" />
                <span class="text-xs text-ink-600">{{ count }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Completion rate bar -->
        <div v-if="completionRate !== null" class="mt-4 pt-4 border-t border-ink-100">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs text-ink-500">Выполнение</span>
            <span class="text-sm font-bold text-forest-600 tabular-nums">{{ completionRate }}%</span>
          </div>
          <div class="h-2.5 bg-cream-200 rounded-full overflow-hidden">
            <div
              class="h-full bg-forest-400 rounded-full transition-all duration-700"
              :style="{ width: `${completionRate}%` }"
            />
          </div>
        </div>
      </section>

      <!-- Insights: Streaks -->
      <section v-if="store.streaks" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">Серии записей</h2>
        <div class="grid grid-cols-3 gap-3">
          <div class="rounded-xl bg-terra-50 p-4 text-center">
            <p class="text-2xl font-display font-bold text-terra-600">{{ store.streaks.currentStreak ?? 0 }}</p>
            <p class="text-[10px] text-terra-500 mt-1 uppercase tracking-wider font-semibold">Текущая</p>
          </div>
          <div class="rounded-xl bg-gold-200/40 p-4 text-center">
            <p class="text-2xl font-display font-bold text-gold-600">{{ store.streaks.longestStreak ?? 0 }}</p>
            <p class="text-[10px] text-gold-500 mt-1 uppercase tracking-wider font-semibold">Рекорд</p>
          </div>
          <div class="rounded-xl bg-forest-200/40 p-4 text-center">
            <p class="text-2xl font-display font-bold text-forest-600">{{ store.streaks.totalDays ?? 0 }}</p>
            <p class="text-[10px] text-forest-500 mt-1 uppercase tracking-wider font-semibold">Всего дней</p>
          </div>
        </div>
      </section>

      <!-- Insights: Mood Score -->
      <section v-if="store.moodScore?.scores?.length" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">Настроение по дням</h2>
        <div class="h-48">
          <div class="flex items-end gap-1 h-full">
            <div
              v-for="(point, i) in store.moodScore.scores"
              :key="i"
              class="flex-1 flex flex-col items-center justify-end h-full"
            >
              <div
                class="w-full max-w-[10px] rounded-full transition-all duration-500"
                :class="moodBarColor(point.score)"
                :style="{ height: `${Math.max(4, (point.score / 10) * 100)}%` }"
                :title="`${point.date}: ${point.score?.toFixed(1)}`"
              />
            </div>
          </div>
          <div class="flex justify-between mt-2 text-[9px] text-ink-400">
            <span>{{ formatShortDate(store.moodScore.scores[0]?.date) }}</span>
            <span>{{ formatShortDate(store.moodScore.scores[store.moodScore.scores.length - 1]?.date) }}</span>
          </div>
        </div>
      </section>

      <!-- Insights: Patterns -->
      <section v-if="store.patterns" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">Паттерны</h2>
        <div class="grid sm:grid-cols-2 gap-6">
          <!-- By hour -->
          <div v-if="store.patterns.byHour?.length">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-3">По часам</p>
            <div class="flex items-end gap-0.5 h-24">
              <div
                v-for="h in store.patterns.byHour"
                :key="h.hour"
                class="flex-1 bg-terra-400 rounded-t transition-all duration-500 min-h-[2px]"
                :style="{ height: `${Math.max(2, (h.count / maxHourCount) * 100)}%` }"
                :title="`${h.hour}:00 — ${h.count}`"
              />
            </div>
            <div class="flex justify-between mt-1 text-[9px] text-ink-400">
              <span>0:00</span>
              <span>12:00</span>
              <span>23:00</span>
            </div>
          </div>

          <!-- By weekday -->
          <div v-if="store.patterns.byWeekday?.length">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-3">По дням недели</p>
            <div class="flex items-end gap-1.5 h-24">
              <div
                v-for="d in store.patterns.byWeekday"
                :key="d.day"
                class="flex-1 flex flex-col items-center justify-end h-full"
              >
                <div
                  class="w-full bg-violet-400 rounded-t transition-all duration-500 min-h-[2px]"
                  :style="{ height: `${Math.max(2, (d.count / maxWeekdayCount) * 100)}%` }"
                />
                <span class="text-[9px] text-ink-400 mt-1">{{ weekdayLabels[d.day] || d.day }}</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Empty state -->
      <div v-if="!store.emotionReport?.total && !store.cbtReport?.total && !store.tasksReport?.total" class="text-center py-10">
        <BarChart3 class="w-8 h-8 text-ink-300 mx-auto mb-3" />
        <p class="text-ink-400 text-sm">Недостаточно данных для аналитики</p>
        <p class="text-ink-400 text-xs mt-1">Записывайте эмоции и задачи, чтобы увидеть статистику</p>
      </div>
    </template>
  </div>
</template>

<script setup>
import { computed, ref, onMounted, watch } from 'vue'
import { useReportsStore } from '@/stores/reports'
import { BarChart3 } from 'lucide-vue-next'

const store = useReportsStore()

const periods = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
  { value: 'custom', label: 'Период' },
]

const customFrom = ref('')
const customTo = ref('')

const barColors = [
  'bg-terra-400', 'bg-violet-400', 'bg-sky-400', 'bg-gold-400', 'bg-coral-400', 'bg-forest-400'
]

const cbtStatuses = [
  { key: 'new', label: 'Новые', bg: 'bg-sky-300/20', text: 'text-sky-600', subtext: 'text-sky-500' },
  { key: 'inProgress', label: 'В работе', bg: 'bg-gold-200/40', text: 'text-gold-600', subtext: 'text-gold-500' },
  { key: 'processed', label: 'Готово', bg: 'bg-forest-200/40', text: 'text-forest-600', subtext: 'text-forest-500' },
]

const weekdayLabels = { 0: 'Пн', 1: 'Вт', 2: 'Ср', 3: 'Чт', 4: 'Пт', 5: 'Сб', 6: 'Вс' }

onMounted(() => {
  store.fetchAll()
  store.fetchInsights()
})

watch(() => store.period, (val) => {
  if (val !== 'custom') store.fetchAll()
})

const topEmotionName = computed(() => store.emotionReport?.topEmotions?.[0]?.name || '—')
const maxEmotionCount = computed(() => {
  const tops = store.emotionReport?.topEmotions || []
  return tops.length ? Math.max(...tops.map(e => e.count)) : 1
})

const maxDistortionCount = computed(() => {
  const tops = store.cbtReport?.topDistortions || []
  return tops.length ? Math.max(...tops.map(d => d.count)) : 1
})

const completionRate = computed(() => {
  const report = store.tasksReport
  if (!report || !report.total) return null
  const completed = report.completedCount ?? 0
  return Math.round((completed / report.total) * 100)
})

const maxHourCount = computed(() => {
  const hours = store.patterns?.byHour || []
  return hours.length ? Math.max(...hours.map(h => h.count)) : 1
})

const maxWeekdayCount = computed(() => {
  const days = store.patterns?.byWeekday || []
  return days.length ? Math.max(...days.map(d => d.count)) : 1
})

function cbtStatusCount(key) {
  const bs = store.cbtReport?.byStatus
  if (!bs) return 0
  if (key === 'inProgress') return bs.inProgress || bs.in_progress || 0
  return bs[key] || 0
}

function cbtPct(key) {
  const total = store.cbtReport?.total || 1
  return (cbtStatusCount(key) / total) * 100
}

function changePeriod(p) {
  store.setPeriod(p)
}

function applyCustomRange() {
  if (customFrom.value && customTo.value) {
    store.setCustomRange(customFrom.value, customTo.value)
    store.fetchAll()
  }
}

function moodBarColor(score) {
  if (score <= 3) return 'bg-forest-400'
  if (score <= 6) return 'bg-gold-400'
  return 'bg-coral-400'
}

function formatShortDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

const taskColorMap = { yellow: 'bg-gold-400', green: 'bg-forest-400', pink: 'bg-coral-400', blue: 'bg-sky-500', purple: 'bg-violet-500' }
function taskBarColor(c) { return taskColorMap[c] || 'bg-ink-300' }
function taskDotColor(c) { return taskColorMap[c] || 'bg-ink-300' }
</script>
