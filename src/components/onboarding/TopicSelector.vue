<template>
  <div class="topic-grid">
    <button
      v-for="option in options"
      :key="option.value"
      class="topic-pill"
      :class="{ 'topic-pill--selected': modelValue.includes(option.value) }"
      @click="toggle(option.value)"
    >
      <span class="topic-pill-emoji">{{ option.emoji }}</span>
      {{ option.label }}
    </button>
  </div>
</template>

<script setup>
const props = defineProps({
  options: { type: Array, required: true },
  modelValue: { type: Array, default: () => [] },
})

const emit = defineEmits(['update:modelValue'])

function toggle(value) {
  const current = [...props.modelValue]
  const idx = current.indexOf(value)
  if (idx >= 0) {
    current.splice(idx, 1)
  } else {
    current.push(value)
  }
  emit('update:modelValue', current)
}
</script>

<style scoped>
.topic-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: center;
}

.topic-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.25s ease;
}

.topic-pill:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-soft);
}

.topic-pill--selected {
  border-color: var(--color-primary);
  background: var(--color-primary-soft);
  color: var(--color-text);
}

.topic-pill-emoji {
  font-size: 1rem;
}
</style>
