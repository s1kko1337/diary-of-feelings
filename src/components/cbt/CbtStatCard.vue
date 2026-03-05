<template>
  <div class="stat-card">
    <span class="stat-value metric-value">{{ displayValue }}</span>
    <span class="stat-label">{{ label }}</span>
    <span v-if="trend" class="stat-trend" :class="'stat-trend--' + trend">
      <TrendingUpIcon v-if="trend === 'up'" :size="12" :stroke-width="2" />
      <TrendingDownIcon v-if="trend === 'down'" :size="12" :stroke-width="2" />
    </span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { TrendingUpIcon, TrendingDownIcon } from 'lucide-vue-next'

const props = defineProps({
  value: { type: [String, Number], required: true },
  label: { type: String, required: true },
  trend: { type: String, default: null },
  accentColor: { type: String, default: 'var(--color-lavender)' },
})

const displayValue = computed(() => {
  return props.value ?? '—'
})
</script>

<style scoped>
.stat-card {
  padding: 1rem 1.25rem;
  min-width: 120px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
  position: relative;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
}

.stat-label {
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
}

.stat-trend {
  position: absolute;
  top: 10px;
  right: 10px;
}

.stat-trend--up {
  color: var(--color-success);
}

.stat-trend--down {
  color: var(--color-danger);
}
</style>
