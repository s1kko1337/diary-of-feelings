<template>
  <div class="report-page">
    <header class="report-header">
      <div class="report-header__left">
        <h1 class="report-title">Отчёт</h1>
        <span
          v-if="badgeText"
          class="report-badge"
          :class="badgeClass"
        >
          {{ badgeText }}
        </span>
      </div>
      <PeriodSelector
        v-model="store.period"
        @update:model-value="store.setPeriod"
      />
    </header>

    <div v-if="store.loading" class="report-loading">
      <div v-for="i in 4" :key="i" class="skeleton-card" />
    </div>

    <template v-else-if="store.hasData">
      <!-- Summary stats -->
      <ReportSummary
        :emotion-report="store.emotionReport"
        :cbt-report="store.cbtReport"
        :tasks-report="store.tasksReport"
      />

      <!-- AI Insights -->
      <div
        v-if="store.emotionReport?.entries?.length"
        class="report-card"
      >
        <h3 class="report-card__title">Инсайты</h3>
        <ReportInsights
          :emotion-report="store.emotionReport"
        />
      </div>

      <!-- Emotion chart -->
      <div
        v-if="store.emotionReport?.entries?.length"
        class="report-card"
      >
        <h3 class="report-card__title">
          Динамика интенсивности
        </h3>
        <ReportChart
          :entries="store.emotionReport.entries"
        />
      </div>

      <!-- Emotion frequency bars -->
      <div
        v-if="store.emotionReport?.topEmotions?.length"
        class="report-card"
      >
        <h3 class="report-card__title">
          Частота эмоций
        </h3>
        <ReportEmotionBars
          :top-emotions="store.emotionReport.topEmotions"
        />
      </div>

      <!-- Activity heatmap -->
      <div
        v-if="store.emotionReport?.entries?.length"
        class="report-card"
      >
        <h3 class="report-card__title">
          Активность
        </h3>
        <ReportHeatmap
          :entries="store.emotionReport.entries"
          :period="store.period"
        />
      </div>

      <!-- Patterns -->
      <div
        v-if="hasPatterns"
        class="report-card"
      >
        <h3 class="report-card__title">Паттерны</h3>
        <ReportPatterns
          :emotion-report="store.emotionReport"
          :cbt-report="store.cbtReport"
        />
      </div>

      <!-- CBT Progress -->
      <div v-if="store.cbtReport" class="report-card">
        <h3 class="report-card__title">Прогресс КПТ</h3>
        <div class="cbt-progress">
          <div
            v-for="(count, status) in store.cbtReport.byStatus"
            :key="status"
            class="cbt-progress-item"
          >
            <span class="cbt-progress-item__label">
              {{ STATUS_LABELS[status] }}
            </span>
            <span class="cbt-progress-item__count">
              {{ count }}
            </span>
          </div>
        </div>
      </div>
    </template>

    <!-- Empty state -->
    <ReportEmptyState v-else />
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useReportStore } from '@/stores/report.js'
import PeriodSelector from '@/components/report/PeriodSelector.vue'
import ReportSummary from '@/components/report/ReportSummary.vue'
import ReportChart from '@/components/report/ReportChart.vue'
import ReportPatterns from '@/components/report/ReportPatterns.vue'
import ReportEmotionBars from '@/components/report/ReportEmotionBars.vue'
import ReportHeatmap from '@/components/report/ReportHeatmap.vue'
import ReportInsights from '@/components/report/ReportInsights.vue'
import ReportEmptyState from '@/components/report/ReportEmptyState.vue'

const STATUS_LABELS = {
  new: 'Новые',
  in_progress: 'В работе',
  processed: 'Проработаны',
}

const store = useReportStore()

const hasPatterns = computed(() => {
  return (
    store.emotionReport?.topEmotions?.length ||
    store.cbtReport?.topDistortions?.length
  )
})

const badgeText = computed(() => {
  const delta = store.positiveDelta
  if (delta === null) return ''
  const sign = delta > 0 ? '+' : ''
  return `${sign}${delta}% позитивных`
})

const badgeClass = computed(() => {
  const delta = store.positiveDelta
  if (delta === null) return ''
  return delta > 0 ? 'report-badge--positive' : 'report-badge--negative'
})

onMounted(() => store.fetchAll())
</script>

<style scoped>
.report-page {
  padding: 1rem;
  padding-bottom: 5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.report-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.report-header__left {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.report-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin: 0;
}

.report-badge {
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
  white-space: nowrap;
}

.report-badge--positive {
  background: #ecfdf5;
  color: #059669;
}

.report-badge--negative {
  background: #fff1f2;
  color: #e11d48;
}

.report-loading {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.skeleton-card {
  height: 100px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    90deg,
    var(--color-surface) 25%,
    #ececec 50%,
    var(--color-surface) 75%
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

.report-card {
  background: white;
  border-radius: var(--radius-xl);
  padding: 1.1rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.06);
}

.report-card__title {
  font-size: 0.82rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  margin: 0 0 0.9rem;
}

.cbt-progress {
  display: flex;
  gap: 0.5rem;
}

.cbt-progress-item {
  flex: 1;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.cbt-progress-item__label {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  text-align: center;
}

.cbt-progress-item__count {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
}
</style>
