<template>
  <div class="emotions-page">
    <header class="emotions-header">
      <div class="emotions-title-row">
        <h1 class="emotions-title">Эмоции</h1>
        <span v-if="streak > 0" class="streak-badge">
          <FlameIcon :size="16" :stroke-width="1.8" />
          {{ streak }}
          {{ streakLabel }}
        </span>
      </div>
      <nav class="section-tabs">
        <router-link to="/emotions" class="section-tab" :class="{ 'section-tab--active': $route.name === 'emotions' }">Дневник</router-link>
        <router-link to="/cbt" class="section-tab" :class="{ 'section-tab--active': ['cbt','cbt-new','cbt-entry'].includes($route.name) }">КПТ</router-link>
      </nav>

      <!-- Weekly mini-graph -->
      <div class="week-dots">
        <div
          v-for="day in weekDays"
          :key="day.key"
          class="week-dot-col"
        >
          <span
            class="week-dot"
            :style="day.color
              ? { background: day.color }
              : {}"
            :class="{ 'week-dot--empty': !day.color }"
          />
          <span class="week-dot-label">{{ day.label }}</span>
        </div>
      </div>

      <div class="emotions-tabs">
        <button
          class="emotions-tab"
          :class="{ active: activeTab === 'diary' }"
          @click="switchTab('diary')"
        >
          Дневник
        </button>
        <button
          class="emotions-tab"
          :class="{ active: activeTab === 'cbt' }"
          @click="switchTab('cbt')"
        >
          КПТ
        </button>
      </div>
    </header>

    <!-- DIARY TAB -->
    <template v-if="activeTab === 'diary'">
      <div v-if="loading" class="skeleton-list">
        <div v-for="i in 3" :key="i" class="skeleton-card" />
      </div>

      <div v-else-if="error" class="error-banner">
        <AlertCircleIcon :size="18" :stroke-width="1.8" />
        <span>
          Не удалось загрузить данные. Попробуй обновить страницу.
        </span>
      </div>

      <template v-else>
        <!-- Soft nudge if already logged today -->
        <div
          v-if="showNudge && !nudgeDismissed"
          class="nudge-banner"
        >
          <span class="nudge-text">
            Ты уже записал(а) своё состояние сегодня.
            Хочешь обновить?
          </span>
          <button
            class="nudge-dismiss"
            @click="dismissNudge"
          >
            Продолжить
          </button>
        </div>

        <section class="flat-card section-card">
          <p class="section-label">Что ты сейчас чувствуешь?</p>
          <EmotionWheel
            v-if="!selectedEmotion"
            @select="handleEmotionSelect"
          />
          <EmotionEntryForm
            v-else
            :emotion="selectedEmotion"
            :emotion-category="selectedCategory"
            @submit="handleSubmit"
            @change-emotion="resetSelection"
          />
        </section>

        <section
          v-if="patterns && patterns.totalEntries > 0"
          class="flat-card section-card"
        >
          <p class="section-label">Паттерны за неделю</p>
          <div class="patterns">
            <div class="pattern-stat">
              <span class="pattern-value">
                {{ patterns.totalEntries }}
              </span>
              <span class="pattern-name">записей</span>
            </div>
            <div class="pattern-stat">
              <span class="pattern-value">
                {{ patterns.averageIntensity }}
              </span>
              <span class="pattern-name">
                средняя интенсивность
              </span>
            </div>
            <div
              v-for="top in patterns.topEmotions"
              :key="top.emotion"
              class="pattern-stat"
            >
              <span class="pattern-value">
                {{ emotionEmoji(top.emotion) }} {{ top.count }}
              </span>
              <span class="pattern-name">
                {{ emotionLabel(top.emotion) }}
              </span>
            </div>
          </div>
        </section>

        <section
          v-if="history.length > 1"
          class="flat-card section-card"
        >
          <p class="section-label">Динамика</p>
          <EmotionChart :entries="history" />
        </section>

        <!-- Filter chips -->
        <div class="filter-chips">
          <button
            v-for="f in filters"
            :key="f.key"
            class="filter-chip"
            :class="{ active: activeFilter === f.key }"
            @click="setFilter(f.key)"
          >
            {{ f.label }}
          </button>
        </div>

        <section class="flat-card section-card">
          <p class="section-label">Сегодня</p>
          <EmotionHistory
            :entries="filteredTodayEntries"
            timeline
            @delete="handleDelete"
          />
        </section>

        <section
          v-if="filteredOlderEntries.length > 0"
          class="flat-card section-card"
        >
          <p class="section-label">Ранее</p>
          <EmotionHistory
            :entries="filteredOlderEntries"
            timeline
            @delete="handleDelete"
          />
        </section>
      </template>
    </template>

    <!-- CBT TAB -->
    <template v-else>
      <CbtBoard @open="openCbtEntry" @create="openCbtCreate" />
    </template>

    <CbtCardEditor
      :model-value="cbtEditingEntry"
      :show="cbtShowEditor"
      :initial-status="cbtCreateStatus"
      @save="handleCbtSave"
      @close="closeCbtEditor"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { AlertCircleIcon, FlameIcon } from 'lucide-vue-next'
import { useEmotionsStore } from '@/stores/emotions'
import { useCbtStore } from '@/stores/cbt'
import { getEmotion } from '@/api/mock/data/emotions-wheel'
import EmotionWheel from '@/components/emotions/EmotionWheel.vue'
import EmotionEntryForm
  from '@/components/emotions/EmotionEntryForm.vue'
import EmotionHistory
  from '@/components/emotions/EmotionHistory.vue'
import EmotionChart from '@/components/emotions/EmotionChart.vue'
import CbtBoard from '@/components/cbt/CbtBoard.vue'
import CbtCardEditor from '@/components/cbt/CbtCardEditor.vue'

const store = useEmotionsStore()
const cbtStore = useCbtStore()

// --- Tabs ---
const activeTab = ref('diary')

function switchTab(tab) {
  activeTab.value = tab
}

// --- Diary state ---
const loading = ref(true)
const error = ref(false)
const selectedEmotion = ref(null)
const selectedCategory = ref(null)
const nudgeDismissed = ref(false)

const todayEntries = computed(() => store.todayEntries)
const history = computed(() => store.history)
const patterns = computed(() => store.patterns)
const today = new Date().toISOString().slice(0, 10)
const olderEntries = computed(
  () => store.history.filter((e) => e.date !== today)
)

// --- Show nudge when user has entries today and selects emotion ---
const showNudge = computed(
  () => todayEntries.value.length > 0 && selectedEmotion.value
)

function dismissNudge() {
  nudgeDismissed.value = true
}

// --- Filter chips ---
const filters = [
  { key: 'all', label: 'Всё' },
  { key: 'week', label: 'Эта неделя' },
  { key: 'month', label: 'Этот месяц' },
]
const activeFilter = ref('all')

function setFilter(key) {
  activeFilter.value = key
}

function isWithinFilter(entry) {
  if (activeFilter.value === 'all') return true
  const d = new Date(entry.date || entry.createdAt)
  const now = new Date()
  if (activeFilter.value === 'week') {
    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    return d >= weekAgo
  }
  if (activeFilter.value === 'month') {
    return (
      d.getMonth() === now.getMonth()
      && d.getFullYear() === now.getFullYear()
    )
  }
  return true
}

const filteredTodayEntries = computed(
  () => todayEntries.value.filter(isWithinFilter)
)
const filteredOlderEntries = computed(
  () => olderEntries.value.filter(isWithinFilter)
)

// --- Streak ---
const streak = computed(() => {
  const entries = store.history
  if (!entries.length) return 0

  const dateSet = new Set(entries.map((e) => e.date))
  let count = 0
  const d = new Date()

  while (true) {
    const key = d.toISOString().slice(0, 10)
    if (dateSet.has(key)) {
      count++
      d.setDate(d.getDate() - 1)
    } else {
      break
    }
  }
  return count
})

const streakLabel = computed(() => {
  const n = streak.value
  if (n % 10 === 1 && n % 100 !== 11) return 'день'
  if (
    n % 10 >= 2
    && n % 10 <= 4
    && (n % 100 < 10 || n % 100 >= 20)
  ) {
    return 'дня'
  }
  return 'дней'
})

// --- Weekly mini-graph ---
const DAY_LABELS = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']

const EMOTION_COLORS = {
  joy: '#f97316',
  calm: '#10b981',
  sadness: '#6366f1',
  anxiety: '#f43f5e',
  anger: '#ef4444',
  fatigue: '#818cf8',
  surprise: '#fb923c',
}

const weekDays = computed(() => {
  const result = []
  const now = new Date()

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now)
    d.setDate(d.getDate() - i)
    const dateKey = d.toISOString().slice(0, 10)
    const dayLabel = DAY_LABELS[d.getDay()]

    const dayEntry = store.history.find((e) => e.date === dateKey)
    let color = null
    if (dayEntry) {
      const cat = dayEntry.emotionCategory || 'joy'
      color = EMOTION_COLORS[cat] || 'var(--color-accent)'
    }

    result.push({ key: dateKey, label: dayLabel, color })
  }

  return result
})

// --- Emotion helpers ---
function emotionEmoji(key) {
  return getEmotion(key)?.emoji ?? ''
}

function emotionLabel(key) {
  return getEmotion(key)?.label ?? key
}

function handleEmotionSelect({ emotion, emotionCategory }) {
  selectedEmotion.value = emotion
  selectedCategory.value = emotionCategory
  nudgeDismissed.value = false
}

function resetSelection() {
  selectedEmotion.value = null
  selectedCategory.value = null
}

async function handleSubmit(data) {
  await store.createEntry(data)
  resetSelection()
  await store.loadPatterns()
}

async function handleDelete(id) {
  await store.removeEntry(id)
  await store.loadPatterns()
}

// --- CBT state ---
const cbtShowEditor = ref(false)
const cbtEditingEntry = ref(null)
const cbtCreateStatus = ref('new')

function openCbtEntry(entry) {
  cbtEditingEntry.value = entry
  cbtShowEditor.value = true
}

function openCbtCreate(status) {
  cbtEditingEntry.value = null
  cbtCreateStatus.value = status
  cbtShowEditor.value = true
}

function closeCbtEditor() {
  cbtShowEditor.value = false
}

async function handleCbtSave(formData) {
  if (formData.id) {
    await cbtStore.updateEntry(formData.id, formData)
  } else {
    await cbtStore.createEntry(formData)
  }
  cbtShowEditor.value = false
}

onMounted(async () => {
  try {
    await Promise.all([
      store.loadToday(),
      store.loadHistory(),
      store.loadPatterns(),
      cbtStore.loadEntries(),
    ])
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.emotions-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl, 1.25rem);
  padding: 1rem 0 5rem;
}

.emotions-header {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.emotions-title-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.section-tabs {
  display: flex;
  gap: 0.25rem;
}

.section-tab {
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.78rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-decoration: none;
  background: transparent;
  border: 1px solid transparent;
  transition: all 0.2s ease;
}

.section-tab:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.section-tab--active {
  color: var(--color-accent);
  background: color-mix(in srgb, var(--color-accent) 10%, transparent);
  border-color: color-mix(in srgb, var(--color-accent) 20%, transparent);
}

.emotions-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin: 0;
}

.streak-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-warm-soft);
  color: var(--color-warm);
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
}

/* Weekly dots */
.week-dots {
  display: flex;
  gap: 10px;
  align-items: center;
  padding: 8px 0;
}

.week-dot-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.week-dot {
  width: 10px;
  height: 10px;
  border-radius: var(--radius-full);
  transition: background 0.2s ease;
}

.week-dot--empty {
  background: var(--color-surface-hover);
}

.week-dot-label {
  font-size: 0.6rem;
  font-weight: 500;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

/* Tabs */
.emotions-tabs {
  display: flex;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  padding: 3px;
  gap: 2px;
  width: fit-content;
}

.emotions-tab {
  padding: 0.4rem 1rem;
  border-radius: var(--radius-full);
  border: none;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-text-muted);
  background: transparent;
  transition:
    background 0.15s,
    color 0.15s;
}

.emotions-tab.active {
  background: white;
  color: var(--color-text);
  font-weight: 600;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.08);
}

/* Nudge banner */
.nudge-banner {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  background: var(--color-warm-soft);
  border: 1px solid rgb(245 158 11 / 0.15);
}

.nudge-text {
  flex: 1;
  font-size: 0.82rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
}

.nudge-dismiss {
  padding: 4px 12px;
  border: none;
  border-radius: var(--radius-full);
  background: var(--color-warm);
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  transition: opacity 0.2s ease;
}

.nudge-dismiss:hover {
  opacity: 0.85;
}

/* Filter chips */
.filter-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.filter-chip {
  padding: 5px 14px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--color-text-muted);
  font-size: 0.78rem;
  font-weight: 500;
  cursor: pointer;
  transition:
    background 0.15s,
    color 0.15s,
    border-color 0.15s;
}

.filter-chip.active {
  background: var(--color-accent-soft);
  color: var(--color-accent-text);
  border-color: var(--color-accent);
}

.filter-chip:hover:not(.active) {
  background: var(--color-surface-hover);
}

/* Section card */
.section-card {
  padding: 1.25rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.patterns {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pattern-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: var(--color-surface-hover, var(--color-surface));
  min-width: 80px;
}

.pattern-value {
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-mono, monospace);
  color: var(--color-text);
}

.pattern-name {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* Skeleton / Error */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 120px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    90deg,
    var(--color-surface-hover, #f3f4f6) 25%,
    var(--color-surface) 50%,
    var(--color-surface-hover, #f3f4f6) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  background: var(--color-rose-soft, #ffd0cc);
  color: var(--color-text);
  font-size: 0.85rem;
}
</style>
