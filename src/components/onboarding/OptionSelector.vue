<template>
  <div class="option-list">
    <button
      v-for="option in options"
      :key="option.value"
      class="option-card"
      :class="{ 'option-card--selected': modelValue === option.value }"
      @click="emit('update:modelValue', option.value)"
    >
      <span class="option-emoji">{{ option.emoji }}</span>
      <div class="option-text">
        <span class="option-label">{{ option.label }}</span>
        <span v-if="option.description" class="option-desc">{{ option.description }}</span>
      </div>
    </button>
  </div>
</template>

<script setup>
defineProps({
  options: { type: Array, required: true },
  modelValue: { type: [String, null], default: null },
})

const emit = defineEmits(['update:modelValue'])
</script>

<style scoped>
.option-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.option-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  text-align: left;
  cursor: pointer;
  transition: all 0.25s ease;
}

.option-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
}

.option-card--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
}

.option-emoji {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.option-text {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.option-label {
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--color-text);
}

.option-desc {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}
</style>
