<template>
  <div class="progress-bar" role="progressbar" :aria-label="'Прогресс заполнения'">
    <div
      v-for="(step, index) in steps"
      :key="step.key"
      class="progress-step"
      :class="{ 'progress-step--last': index === steps.length - 1 }"
      :style="{ '--step-color': step.color }"
    >
      <div
        class="progress-dot"
        :class="{
          'progress-dot--active': step.active,
          'progress-dot--done': step.done,
        }"
      >
        <CheckIcon v-if="step.done" :size="12" :stroke-width="2.5" class="progress-dot-check" />
      </div>
      <span class="progress-label" :class="{ 'progress-label--active': step.active || step.done }">
        {{ step.label }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { CheckIcon } from 'lucide-vue-next'

defineProps({
  steps: {
    type: Array,
    required: true,
    // Array<{ key: string, label: string, color: string, done: boolean, active: boolean }>
  },
})
</script>

<style scoped>
.progress-bar {
  display: flex;
  align-items: flex-start;
  padding: 1rem 0 1.5rem;
}

.progress-step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  flex: 1;
  position: relative;
}

/* Line between steps */
.progress-step::after {
  content: '';
  position: absolute;
  top: 10px;
  left: 50%;
  width: 100%;
  height: 2px;
  background: var(--color-border);
  transition: background 0.3s ease;
}

.progress-step--last::after {
  display: none;
}

.progress-dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 2px solid var(--color-border);
  background: var(--color-surface);
  z-index: 1;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.progress-dot--active {
  border-color: var(--step-color);
  background: var(--step-color);
  box-shadow: 0 0 0 4px rgb(196 181 224 / 0.15);
}

.progress-dot--done {
  border-color: var(--step-color);
  background: var(--step-color);
}

.progress-dot-check {
  color: white;
}

.progress-label {
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
  transition: color 0.3s ease;
}

.progress-label--active {
  color: var(--color-text-secondary);
}
</style>
