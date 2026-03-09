<template>
  <div class="period-selector">
    <button
      v-for="opt in OPTIONS"
      :key="opt.value"
      class="period-btn"
      :class="{ active: modelValue === opt.value }"
      @click="select(opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<script setup>
const OPTIONS = [
  { value: 'week', label: 'Неделя' },
  { value: 'month', label: 'Месяц' },
]

defineProps({
  modelValue: { type: String, default: 'week' },
})

const emit = defineEmits(['update:modelValue'])

function select(value) {
  emit('update:modelValue', value)
}
</script>

<style scoped>
.period-selector {
  display: flex;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  padding: 3px;
  gap: 2px;
  width: fit-content;
}

.period-btn {
  padding: 0.35rem 0.9rem;
  border-radius: var(--radius-full);
  border: none;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  color: var(--color-text-muted);
  background: transparent;
  transition:
    background 0.15s,
    color 0.15s;
}

.period-btn.active {
  background: white;
  color: var(--color-text);
  font-weight: 600;
  box-shadow: 0 1px 4px rgb(0 0 0 / 0.08);
}
</style>
