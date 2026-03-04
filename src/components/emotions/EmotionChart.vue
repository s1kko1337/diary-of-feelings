<template>
  <div class="chart-wrap">
    <v-chart :option="chartOption" :autoresize="true" class="chart" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { use } from 'echarts/core'
import { LineChart } from 'echarts/charts'
import { GridComponent, TooltipComponent } from 'echarts/components'
import { CanvasRenderer } from 'echarts/renderers'
import VChart from 'vue-echarts'
import { useChartColors } from '@/composables/useChartColors'

use([LineChart, GridComponent, TooltipComponent, CanvasRenderer])

const props = defineProps({
  entries: { type: Array, default: () => [] },
})

const { lavender, textMuted, surface, withAlpha } = useChartColors()

const chartOption = computed(() => {
  const grouped = {}
  for (const e of props.entries) {
    if (!grouped[e.date] || e.intensity > grouped[e.date]) {
      grouped[e.date] = e.intensity
    }
  }

  const sorted = Object.entries(grouped)
    .sort((a, b) => a[0].localeCompare(b[0]))
    .slice(-14)

  const dates = sorted.map(([d]) => {
    const dt = new Date(d)
    return dt.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
  })
  const values = sorted.map(([, v]) => v)

  return {
    grid: { left: 32, right: 16, top: 16, bottom: 28 },
    tooltip: {
      trigger: 'axis',
      backgroundColor: withAlpha(surface, 0.9),
      borderColor: withAlpha(lavender, 0.3),
      textStyle: { fontSize: 12, color: textMuted.value },
      formatter: (params) => {
        const p = params[0]
        return `${p.name}<br/>Интенсивность: <b>${p.value}</b>/10`
      },
    },
    xAxis: {
      type: 'category',
      data: dates,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 10, color: textMuted.value },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 10,
      splitNumber: 5,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { fontSize: 10, color: textMuted.value },
      splitLine: { lineStyle: { color: withAlpha(lavender, 0.15) } },
    },
    series: [
      {
        type: 'line',
        data: values,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: withAlpha(lavender, 0.8) },
        itemStyle: { color: lavender.value, borderWidth: 2, borderColor: '#fff' },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: withAlpha(lavender, 0.3) },
              { offset: 1, color: withAlpha(lavender, 0.02) },
            ],
          },
        },
      },
    ],
  }
})
</script>

<style scoped>
.chart-wrap {
  width: 100%;
  border-radius: var(--radius-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 12px;
}

.chart {
  width: 100%;
  height: 200px;
}
</style>
