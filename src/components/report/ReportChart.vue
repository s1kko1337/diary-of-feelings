<template>
  <div class="chart-wrap">
    <svg :viewBox="`0 0 ${W} ${H}`" class="chart-svg" preserveAspectRatio="none">
      <!-- Grid lines -->
      <line
        v-for="y in GRID_Y"
        :key="y"
        :x1="PAD"
        :y1="y"
        :x2="W - PAD"
        :y2="y"
        stroke="var(--color-border)"
        stroke-width="0.5"
      />
      <!-- Area fill -->
      <path :d="areaPath" :fill="`url(#grad)`" opacity="0.3" />
      <!-- Line -->
      <path
        :d="linePath"
        fill="none"
        stroke="var(--color-accent)"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <!-- Dots -->
      <circle
        v-for="(pt, i) in points"
        :key="i"
        :cx="pt.x"
        :cy="pt.y"
        r="3"
        fill="var(--color-accent)"
      />
      <!-- Gradient def -->
      <defs>
        <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-accent)" stop-opacity="0.6" />
          <stop offset="100%" stop-color="var(--color-accent)" stop-opacity="0" />
        </linearGradient>
      </defs>
    </svg>
    <!-- X-axis labels -->
    <div class="chart-labels">
      <span>{{ firstLabel }}</span>
      <span>{{ lastLabel }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  entries: { type: Array, default: () => [] },
})

const W = 320
const H = 120
const PAD = 20
const GRID_Y = [PAD, H / 2, H - PAD]

const points = computed(() => {
  if (!props.entries.length) return []
  const n = props.entries.length
  return props.entries.map((e, i) => ({
    x: PAD + (i / Math.max(n - 1, 1)) * (W - PAD * 2),
    y: H - PAD - (e.intensity / 10) * (H - PAD * 2),
  }))
})

const linePath = computed(() => {
  if (points.value.length < 2) return ''
  return points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')
})

const areaPath = computed(() => {
  if (points.value.length < 2) return ''
  const line = points.value
    .map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`)
    .join(' ')
  const last = points.value[points.value.length - 1]
  const first = points.value[0]
  return `${line} L${last.x.toFixed(1)},${H - PAD} L${first.x.toFixed(1)},${H - PAD} Z`
})

const firstLabel = computed(() => props.entries[0]?.date?.slice(5) ?? '')
const lastLabel = computed(() => props.entries[props.entries.length - 1]?.date?.slice(5) ?? '')
</script>

<style scoped>
.chart-wrap {
  width: 100%;
}

.chart-svg {
  width: 100%;
  height: 120px;
  display: block;
}

.chart-labels {
  display: flex;
  justify-content: space-between;
  font-size: 0.7rem;
  color: var(--color-text-muted);
  padding: 0.25rem 0;
}
</style>
