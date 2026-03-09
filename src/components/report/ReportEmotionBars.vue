<template>
  <div class="emotion-bars">
    <div
      v-for="item in bars"
      :key="item.name"
      class="emotion-bar-row"
    >
      <span class="emotion-bar-row__name">{{ item.name }}</span>
      <div class="emotion-bar-row__track">
        <div
          class="emotion-bar-row__fill"
          :style="{
            width: item.percent + '%',
            background: item.color,
          }"
        />
      </div>
      <span class="emotion-bar-row__count">{{ item.count }}</span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const EMOTION_COLORS = {
  'Радость': '#fbbf24',
  'Тревога': '#818cf8',
  'Грусть': '#93c5fd',
  'Злость': '#f87171',
  'Спокойствие': '#6ee7b7',
}

const FALLBACK_COLOR = 'var(--color-accent)'

const props = defineProps({
  topEmotions: { type: Array, default: () => [] },
})

const bars = computed(() => {
  const items = props.topEmotions.slice(0, 5)
  if (!items.length) return []
  const maxCount = Math.max(...items.map((e) => e.count), 1)
  return items.map((e) => ({
    name: e.name,
    count: e.count,
    percent: Math.round((e.count / maxCount) * 100),
    color: EMOTION_COLORS[e.name] || FALLBACK_COLOR,
  }))
})
</script>

<style scoped>
.emotion-bars {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.emotion-bar-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.emotion-bar-row__name {
  font-size: 0.82rem;
  color: var(--color-text);
  min-width: 100px;
  flex-shrink: 0;
}

.emotion-bar-row__track {
  flex: 1;
  height: 10px;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.emotion-bar-row__fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
  min-width: 4px;
}

.emotion-bar-row__count {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-text-muted);
  min-width: 24px;
  text-align: right;
  font-family: var(--font-mono);
}
</style>
