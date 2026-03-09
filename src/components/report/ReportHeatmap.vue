<template>
  <div class="heatmap">
    <div class="heatmap__day-labels">
      <span v-for="d in DAY_LABELS" :key="d" class="heatmap__day-label">
        {{ d }}
      </span>
    </div>
    <div class="heatmap__grid-area">
      <div class="heatmap__month-labels">
        <span
          v-for="m in monthLabels"
          :key="m.key"
          class="heatmap__month-label"
          :style="{ gridColumn: m.col }"
        >
          {{ m.label }}
        </span>
      </div>
      <div class="heatmap__grid">
        <div
          v-for="(cell, i) in cells"
          :key="i"
          class="heatmap__cell"
          :class="cellClass(cell)"
          :title="cell.date ? `${cell.date}: ${cell.intensity}/10` : ''"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const DAY_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']

const MONTH_NAMES = [
  'Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн',
  'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек',
]

const props = defineProps({
  entries: { type: Array, default: () => [] },
  period: { type: String, default: 'week' },
})

const intensityMap = computed(() => {
  const map = {}
  for (const e of props.entries) {
    if (e.date) {
      map[e.date] = e.intensity
    }
  }
  return map
})

const cells = computed(() => {
  const days = props.period === 'month' ? 35 : 7
  const result = []
  const today = new Date()

  // For week: single row of 7 days
  // For month: 5 rows x 7 cols (35 cells)
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const dayOfWeek = (d.getDay() + 6) % 7 // Mon=0
    result.push({
      date: dateStr,
      intensity: intensityMap.value[dateStr] ?? null,
      dayOfWeek,
      month: d.getMonth(),
      day: d.getDate(),
    })
  }
  return result
})

const monthLabels = computed(() => {
  if (props.period === 'week') return []
  const labels = []
  const seen = new Set()
  const cols = Math.ceil(cells.value.length / 7)
  for (let col = 0; col < cols; col++) {
    const cellIdx = col * 7
    if (cellIdx < cells.value.length) {
      const cell = cells.value[cellIdx]
      const key = `${cell.month}`
      if (!seen.has(key)) {
        seen.add(key)
        labels.push({
          key: `${cell.month}-${col}`,
          label: MONTH_NAMES[cell.month],
          col: col + 1,
        })
      }
    }
  }
  return labels
})

function cellClass(cell) {
  if (cell.intensity === null) return 'heatmap__cell--empty'
  if (cell.intensity <= 3) return 'heatmap__cell--low'
  if (cell.intensity <= 6) return 'heatmap__cell--mid'
  return 'heatmap__cell--high'
}
</script>

<style scoped>
.heatmap {
  display: flex;
  gap: 0.35rem;
}

.heatmap__day-labels {
  display: flex;
  flex-direction: column;
  gap: 3px;
  padding-top: 20px;
}

.heatmap__day-label {
  font-size: 0.62rem;
  color: var(--color-text-muted);
  height: 14px;
  display: flex;
  align-items: center;
}

.heatmap__grid-area {
  flex: 1;
  overflow: hidden;
}

.heatmap__month-labels {
  display: grid;
  grid-auto-columns: 14px;
  gap: 3px;
  height: 16px;
  margin-bottom: 2px;
}

.heatmap__month-label {
  font-size: 0.62rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.heatmap__grid {
  display: grid;
  grid-template-rows: repeat(7, 14px);
  grid-auto-flow: column;
  grid-auto-columns: 14px;
  gap: 3px;
}

.heatmap__cell {
  width: 14px;
  height: 14px;
  border-radius: 3px;
  transition: background 0.2s ease;
}

.heatmap__cell--empty {
  background: var(--color-surface);
}

.heatmap__cell--low {
  background: var(--color-accent-subtle);
}

.heatmap__cell--mid {
  background: var(--color-accent);
  opacity: 0.6;
}

.heatmap__cell--high {
  background: var(--color-accent);
}
</style>
