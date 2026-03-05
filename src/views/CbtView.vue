<template>
  <div class="cbt-page">
    <!-- Header -->
    <div class="cbt-header">
      <div class="cbt-header-left">
        <div>
          <h1 class="cbt-title">КПТ-дневник</h1>
          <p class="cbt-subtitle">Помогает понять связь мыслей и эмоций</p>
        </div>
      </div>
      <button class="new-entry-btn" @click="goToNew">
        <PlusIcon :size="16" :stroke-width="1.8" />
        <span class="new-entry-btn-text">Новая запись</span>
      </button>
    </div>

    <!-- Stats row -->
    <div v-if="store.entries.length > 0" class="stats-row">
      <CbtStatCard :value="store.stats.total" label="записей" />
      <CbtStatCard :value="store.stats.topDistortion || '—'" label="топ искажение" />
      <CbtStatCard
        :value="store.stats.weekCount"
        label="за неделю"
        :trend="store.stats.weekCount > 0 ? 'up' : null"
      />
    </div>

    <!-- Filters -->
    <div v-if="store.entries.length > 0" class="filters-row">
      <div class="filter-pills">
        <button
          v-for="f in timeFilters"
          :key="f.key"
          class="filter-pill"
          :class="{ 'filter-pill--active': activeTimeFilter === f.key }"
          @click="setTimeFilter(f.key)"
        >
          {{ f.label }}
        </button>
      </div>
      <select v-model="distortionFilter" class="filter-select" aria-label="Фильтр по искажению">
        <option value="">Все искажения</option>
        <option v-for="d in distortionOptions" :key="d.key" :value="d.key">
          {{ d.label }}
        </option>
      </select>
    </div>

    <!-- Loading skeleton -->
    <div v-if="store.isLoading" class="skeleton-list">
      <div v-for="i in 3" :key="i" class="skeleton-card" />
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="error-banner">
      <AlertCircleIcon :size="18" :stroke-width="1.8" />
      <span>Не удалось загрузить записи. Попробуй ещё раз.</span>
    </div>

    <!-- Empty state -->
    <div v-else-if="store.entries.length === 0" class="empty-state">
      <svg
        width="80"
        height="80"
        viewBox="0 0 80 80"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="empty-svg"
      >
        <rect x="1" y="1" width="38" height="38" stroke="currentColor" stroke-width="1.5" />
        <rect x="41" y="1" width="38" height="38" stroke="currentColor" stroke-width="1.5" />
        <rect x="1" y="41" width="38" height="38" stroke="currentColor" stroke-width="1.5" />
        <rect x="56" y="56" width="8" height="8" fill="currentColor" />
      </svg>
      <h2 class="empty-title">Здесь будут твои записи СМЭР</h2>
      <p class="empty-text">Первая запись — шаг к пониманию себя. Занимает 2–3 минуты.</p>
      <button class="empty-cta" @click="goToNew">
        Начать запись
        <ArrowRightIcon :size="16" :stroke-width="1.8" />
      </button>
    </div>

    <!-- Filtered empty -->
    <div v-else-if="filteredEntries.length === 0" class="filtered-empty">
      <p class="filtered-empty-text">По этому фильтру записей не найдено</p>
      <button class="filtered-empty-reset" @click="resetFilters">Сбросить фильтры</button>
    </div>

    <!-- Entry cards list -->
    <TransitionGroup v-else name="card-list" tag="div" class="entries-list">
      <CbtEntryCard
        v-for="entry in filteredEntries"
        :key="entry.id"
        :entry="entry"
        @open="goToEntry"
      />
    </TransitionGroup>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { PlusIcon, ArrowRightIcon, AlertCircleIcon } from 'lucide-vue-next'
import { useCbtStore } from '@/stores/cbt'
import { distortions } from '@/api/mock/data/distortions'
import CbtEntryCard from '@/components/cbt/CbtEntryCard.vue'
import CbtStatCard from '@/components/cbt/CbtStatCard.vue'

const router = useRouter()
const store = useCbtStore()

const error = ref(false)
const activeTimeFilter = ref('all')
const distortionFilter = ref('')

const timeFilters = [
  { key: 'all', label: 'Все' },
  { key: 'week', label: 'Эта неделя' },
  { key: 'month', label: 'Этот месяц' },
]

const distortionOptions = distortions.map((d) => ({
  key: d.key,
  label: d.label,
}))

const filteredEntries = computed(() => {
  let result = store.entries

  // Time filter
  if (activeTimeFilter.value === 'week') {
    const weekAgo = new Date(Date.now() - 7 * 86400000)
    result = result.filter((e) => new Date(e.createdAt) >= weekAgo)
  } else if (activeTimeFilter.value === 'month') {
    const now = new Date()
    result = result.filter((e) => {
      const d = new Date(e.createdAt)
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
    })
  }

  // Distortion filter
  if (distortionFilter.value) {
    result = result.filter((e) => e.distortion === distortionFilter.value)
  }

  return result
})

function setTimeFilter(key) {
  activeTimeFilter.value = key
}

function resetFilters() {
  activeTimeFilter.value = 'all'
  distortionFilter.value = ''
}

function goToNew() {
  router.push({ name: 'cbt-new' })
}

function goToEntry(id) {
  router.push({ name: 'cbt-entry', params: { id } })
}

onMounted(async () => {
  try {
    await store.loadEntries()
  } catch {
    error.value = true
  }
})
</script>

<style scoped>
.cbt-page {
  max-width: 720px;
  margin: 0 auto;
  padding: 1rem 1rem 2rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

@media (min-width: 768px) {
  .cbt-page {
    padding: 1.5rem 0 2rem;
  }
}

/* Header */
.cbt-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.cbt-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cbt-title {
  font-size: 2.25rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.04em;
  line-height: 1.15;
}

.cbt-subtitle {
  font-size: 0.9rem;
  color: var(--color-text-secondary);
  margin-top: 2px;
}

.new-entry-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 18px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
  flex-shrink: 0;
}

.new-entry-btn:hover {
  opacity: 0.85;
}

.new-entry-btn:active {
  opacity: 0.75;
}

@media (max-width: 480px) {
  .new-entry-btn-text {
    display: none;
  }

  .new-entry-btn {
    padding: 10px;
    border-radius: 50%;
  }
}

/* Stats */
.stats-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.stats-row::-webkit-scrollbar {
  display: none;
}

/* Filters */
.filters-row {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.filter-pills {
  display: flex;
  gap: 6px;
  overflow-x: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.filter-pills::-webkit-scrollbar {
  display: none;
}

.filter-pill {
  padding: 6px 16px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  white-space: nowrap;
  cursor: pointer;
  transition: all 0.2s ease;
}

.filter-pill:hover {
  border-color: var(--color-accent-subtle);
  background: var(--color-accent-mist);
  color: var(--color-accent);
}

.filter-pill--active {
  background: var(--color-accent);
  border-color: var(--color-accent);
  color: white;
  box-shadow: 0 1px 4px rgb(99 102 241 / 0.3);
}

.filter-select {
  padding: 6px 28px 6px 12px;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  background: transparent;
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%237b7394' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 10px center;
  font-family: var(--font-main);
}

.filter-select:focus {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}

/* Entry list */
.entries-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* Skeleton loading */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 140px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    90deg,
    var(--color-surface-hover) 25%,
    var(--color-surface) 50%,
    var(--color-surface-hover) 75%
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

/* Error */
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  background: var(--color-rose-soft);
  border: 1px solid rgb(240 184 192 / 0.3);
  color: var(--color-text);
  font-size: 0.85rem;
}

/* Empty state */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
}

.empty-svg {
  color: var(--color-border);
  margin-bottom: 1.5rem;
}

.empty-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 8px;
}

.empty-text {
  font-size: 0.88rem;
  color: var(--color-text-secondary);
  line-height: 1.65;
  max-width: 320px;
  margin-bottom: 1.5rem;
}

.empty-cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 24px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  border: none;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s ease;
}

.empty-cta:hover {
  opacity: 0.85;
}

/* Filtered empty */
.filtered-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1rem;
  gap: 12px;
}

.filtered-empty-text {
  font-size: 0.88rem;
  color: var(--color-text-muted);
}

.filtered-empty-reset {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  text-decoration: underline;
  text-underline-offset: 3px;
}

/* Card list transitions */
.card-list-enter-active {
  transition: all 0.3s ease;
}

.card-list-leave-active {
  transition: all 0.2s ease;
}

.card-list-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.card-list-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}

.filter-pill:focus-visible,
.new-entry-btn:focus-visible,
.empty-cta:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
