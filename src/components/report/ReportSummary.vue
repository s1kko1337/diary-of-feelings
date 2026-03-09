<template>
  <div class="summary">
    <div
      v-for="stat in stats"
      :key="stat.label"
      class="stat-card"
      :style="{ '--accent': stat.color }"
    >
      <div class="stat-card__icon">
        <component :is="stat.icon" :size="20" />
      </div>
      <div class="stat-card__value">{{ stat.value }}</div>
      <div class="stat-card__label">{{ stat.label }}</div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Heart, Brain, CheckSquare, TrendingUp } from 'lucide-vue-next'

const props = defineProps({
  emotionReport: { type: Object, default: null },
  cbtReport: { type: Object, default: null },
  tasksReport: { type: Object, default: null },
})

const stats = computed(() => [
  {
    label: 'Записей эмоций',
    value: props.emotionReport?.total ?? '—',
    icon: Heart,
    color: '#f0b8c0',
  },
  {
    label: 'Средняя интенсивность',
    value: props.emotionReport?.averageIntensity ?? '—',
    icon: TrendingUp,
    color: '#c4b5e0',
  },
  {
    label: 'КПТ-проработано',
    value: props.cbtReport?.byStatus?.processed ?? '—',
    icon: Brain,
    color: '#a8dfc8',
  },
  {
    label: 'Задач',
    value: props.tasksReport?.total ?? '—',
    icon: CheckSquare,
    color: '#f8c9a0',
  },
])
</script>

<style scoped>
.summary {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
}

.stat-card {
  background: white;
  border-radius: var(--radius-lg);
  padding: 1rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.stat-card__icon {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: var(--accent);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #2d2d2d;
  margin-bottom: 0.25rem;
}

.stat-card__value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--color-text);
  line-height: 1;
}

.stat-card__label {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
