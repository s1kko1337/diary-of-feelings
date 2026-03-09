<template>
  <div v-if="portrait" class="portrait-wrapper">
    <div class="portrait-strip">
      <!-- Stress level -->
      <div class="portrait-chip">
        <HeartIcon
          :size="14"
          :stroke-width="1.8"
          :class="stressColorClass"
        />
        <span class="portrait-chip-text">
          Стресс: {{ portrait.stressLevel }}/10
        </span>
      </div>

      <!-- Mood trend -->
      <div class="portrait-chip">
        <span class="portrait-trend-arrow" :class="trendColorClass">
          {{ trendArrow }}
        </span>
        <span class="portrait-chip-text" :class="trendColorClass">
          {{ trendLabel }}
        </span>
      </div>

      <!-- Productivity -->
      <div class="portrait-chip">
        <ZapIcon
          :size="14"
          :stroke-width="1.8"
          class="chip-icon--amber"
        />
        <span class="portrait-chip-text">
          Продуктивность: {{ productivityPercent }}%
        </span>
      </div>

      <!-- Top distortion (if available) -->
      <div
        v-if="firstDistortion"
        class="portrait-chip"
      >
        <BrainIcon
          :size="14"
          :stroke-width="1.8"
          class="chip-icon--muted"
        />
        <span class="portrait-chip-text">
          Паттерн: {{ firstDistortion }}
        </span>
      </div>
    </div>

    <!-- Data quality notice (below chips) -->
    <div
      v-if="isLowQuality"
      class="portrait-quality-notice"
    >
      <BarChart3Icon
        :size="14"
        :stroke-width="1.8"
        class="chip-icon--muted"
      />
      <span class="portrait-quality-text">
        Портрет формируется — продолжайте заполнять дневник
      </span>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import {
  HeartIcon,
  ZapIcon,
  BrainIcon,
  BarChart3Icon,
} from 'lucide-vue-next'

const props = defineProps({
  portrait: {
    type: Object,
    default: null,
  },
})

const DISTORTION_LABELS = {
  'catastrophizing': 'Катастрофизация',
  'mind-reading': 'Чтение мыслей',
  'black-white': 'Чёрно-белое',
  'personalization': 'Персонализация',
  'overgeneralization': 'Сверхобобщение',
  'discounting': 'Обесценивание',
  'emotional-reasoning': 'Эмоц. обоснование',
  'should-statements': 'Долженствование',
  'labeling': 'Ярлыки',
  'tunnel-vision': 'Тоннельное зрение',
}

const stressColorClass = computed(() => {
  if (!props.portrait) return ''
  const level = props.portrait.stressLevel
  if (level < 4) return 'chip-icon--green'
  if (level < 7) return 'chip-icon--amber'
  return 'chip-icon--red'
})

const trendArrow = computed(() => {
  const map = { improving: '↗', stable: '→', declining: '↘' }
  return map[props.portrait?.moodTrend] || '→'
})

const trendLabel = computed(() => {
  const map = {
    improving: 'Улучшается',
    stable: 'Стабильно',
    declining: 'Снижается',
  }
  return map[props.portrait?.moodTrend] || 'Стабильно'
})

const trendColorClass = computed(() => {
  const map = {
    improving: 'trend--improving',
    stable: 'trend--stable',
    declining: 'trend--declining',
  }
  return map[props.portrait?.moodTrend] || 'trend--stable'
})

const productivityPercent = computed(() => {
  if (!props.portrait) return 0
  return Math.round(props.portrait.productivityRate * 100)
})

const firstDistortion = computed(() => {
  const list = props.portrait?.topDistortions
  if (!list || list.length === 0) return null
  return DISTORTION_LABELS[list[0]] || list[0]
})

const isLowQuality = computed(() => {
  if (!props.portrait) return false
  return (props.portrait.dataQuality ?? 1) < 0.3
})
</script>

<style scoped>
.portrait-wrapper {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  max-width: 420px;
  width: 100%;
  position: relative;
  z-index: 1;
}

.portrait-strip {
  display: flex;
  gap: 0.5rem;
  overflow-x: auto;
  padding: 0.15rem 0;
  scrollbar-width: none;
}

.portrait-strip::-webkit-scrollbar {
  display: none;
}

.portrait-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.35rem 0.65rem;
  background: var(--color-surface, #fff);
  border-radius: var(--radius-full, 9999px);
  box-shadow: 0 1px 6px rgba(0, 0, 0, 0.06);
  white-space: nowrap;
  flex-shrink: 0;
}

.portrait-chip-text {
  font-size: 0.75rem;
  font-weight: 550;
  color: var(--color-text, #1a1714);
}

/* Icon colors */
.chip-icon--green {
  color: #22c55e;
}

.chip-icon--amber {
  color: #f59e0b;
}

.chip-icon--red {
  color: #ef4444;
}

.chip-icon--muted {
  color: var(--color-text-muted, rgba(26, 23, 20, 0.45));
}

/* Trend colors */
.trend--improving {
  color: #22c55e;
}

.trend--stable {
  color: var(--color-text-muted, rgba(26, 23, 20, 0.5));
}

.trend--declining {
  color: #ef4444;
}

.portrait-trend-arrow {
  font-size: 0.9rem;
  line-height: 1;
}

/* Data quality notice */
.portrait-quality-notice {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.4rem 0.7rem;
  background: var(--color-accent-mist, #f5f3ff);
  border-radius: var(--radius-md, 10px);
  width: 100%;
  flex-shrink: 0;
}

.portrait-quality-text {
  font-size: 0.72rem;
  font-weight: 500;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.5));
  line-height: 1.35;
}
</style>
