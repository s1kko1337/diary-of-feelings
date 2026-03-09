<template>
  <div v-if="insights.length" class="insights">
    <div
      v-for="insight in insights"
      :key="insight.label"
      class="insight-row"
    >
      <component
        :is="insight.icon"
        :size="18"
        :stroke-width="1.8"
        class="insight-row__icon"
      />
      <div class="insight-row__text">
        <span class="insight-row__label">{{ insight.label }}</span>
        <span class="insight-row__value">{{ insight.value }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  CalendarDays,
  Star,
  Hash,
} from 'lucide-vue-next'

const DAY_NAMES = [
  'воскресенье', 'понедельник', 'вторник',
  'среда', 'четверг', 'пятница', 'суббота',
]

const props = defineProps({
  emotionReport: { type: Object, default: null },
})

const insights = computed(() => {
  const report = props.emotionReport
  if (!report?.entries?.length) return []

  const result = []

  // 1. Total entries this period
  result.push({
    label: 'Записей за период',
    value: report.total ?? report.entries.length,
    icon: Hash,
  })

  // 2. Most frequent emotion
  if (report.topEmotions?.length) {
    result.push({
      label: 'Самая частая эмоция',
      value: report.topEmotions[0].name,
      icon: Star,
    })
  }

  // 3. Best day of week (highest avg intensity)
  const bestDay = computeBestDay(report.entries)
  if (bestDay !== null) {
    result.push({
      label: 'Лучший день недели',
      value: bestDay,
      icon: CalendarDays,
    })
  }

  return result
})

function computeBestDay(entries) {
  if (!entries?.length) return null

  const dayStats = {}
  for (const e of entries) {
    if (!e.date || e.intensity == null) continue
    const d = new Date(e.date)
    const dow = d.getDay()
    if (!dayStats[dow]) {
      dayStats[dow] = { total: 0, count: 0 }
    }
    dayStats[dow].total += e.intensity
    dayStats[dow].count++
  }

  let bestDow = null
  let bestAvg = -1
  for (const [dow, stat] of Object.entries(dayStats)) {
    const avg = stat.total / stat.count
    if (avg > bestAvg) {
      bestAvg = avg
      bestDow = Number(dow)
    }
  }

  return bestDow !== null ? DAY_NAMES[bestDow] : null
}
</script>

<style scoped>
.insights {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.insight-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.6rem 0.75rem;
  background: var(--color-surface);
  border-radius: var(--radius-md);
}

.insight-row__icon {
  color: var(--color-accent);
  flex-shrink: 0;
}

.insight-row__text {
  display: flex;
  flex-direction: column;
  gap: 0.1rem;
}

.insight-row__label {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.insight-row__value {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}
</style>
