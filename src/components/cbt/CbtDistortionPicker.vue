<template>
  <div class="distortion-picker">
    <p class="distortion-hint">Необязательно — пропусти, если не уверен(а)</p>
    <div class="distortion-grid" role="listbox" aria-label="Выбор когнитивного искажения">
      <button
        v-for="d in distortions"
        :key="d.key"
        class="distortion-card"
        :class="{
          'distortion-card--selected': modelValue === d.key,
          'distortion-card--dimmed': modelValue && modelValue !== d.key,
        }"
        :style="{ '--distortion-color': colorMap[d.color] }"
        role="option"
        :aria-selected="modelValue === d.key"
        :aria-label="d.label"
        @click="toggle(d.key)"
      >
        <CheckIcon
          v-if="modelValue === d.key"
          class="distortion-check"
          :size="14"
          :stroke-width="2"
        />
        <div class="distortion-icon-wrapper">
          <component :is="iconComponents[d.icon]" :size="16" :stroke-width="1.8" />
        </div>
        <span class="distortion-name">{{ d.label }}</span>
        <span class="distortion-hint-text">{{ d.hint }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import {
  CheckIcon,
  AlertTriangleIcon,
  EyeIcon,
  ContrastIcon,
  UserIcon,
  InfinityIcon,
  MinusCircleIcon,
  HeartCrackIcon,
  GavelIcon,
  TagIcon,
  FocusIcon,
} from 'lucide-vue-next'
import { distortions } from '@/api/mock/data/distortions'

const props = defineProps({
  modelValue: { type: String, default: null },
})

const emit = defineEmits(['update:modelValue'])

const colorMap = {
  rose: 'var(--color-rose)',
  lavender: 'var(--color-lavender)',
  peach: 'var(--color-peach)',
}

const iconComponents = {
  AlertTriangleIcon,
  EyeIcon,
  ContrastIcon,
  UserIcon,
  InfinityIcon,
  MinusCircleIcon,
  HeartCrackIcon,
  GavelIcon,
  TagIcon,
  FocusIcon,
}

function toggle(key) {
  emit('update:modelValue', key === props.modelValue ? null : key)
}
</script>

<style scoped>
.distortion-picker {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.distortion-hint {
  font-size: 0.75rem;
  font-weight: 400;
  color: var(--color-text-muted);
}

.distortion-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 8px;
}

@media (min-width: 480px) {
  .distortion-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.distortion-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 8px;
  padding: 14px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface-hover);
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  position: relative;
  overflow: hidden;
}

.distortion-card:hover {
  border-color: var(--distortion-color);
}

.distortion-card--selected {
  border-color: var(--distortion-color);
  background: var(--color-accent-soft);
}

.distortion-card--dimmed {
  opacity: 0.65;
}

.distortion-card--dimmed:hover {
  opacity: 1;
}

.distortion-check {
  position: absolute;
  top: 10px;
  right: 10px;
  color: var(--distortion-color);
}

.distortion-icon-wrapper {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: var(--distortion-color);
  background: rgb(196 181 224 / 0.12);
}

.distortion-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.3;
}

.distortion-hint-text {
  font-size: 0.72rem;
  color: var(--color-text-secondary);
  line-height: 1.45;
  font-style: italic;
}

.distortion-card:focus-visible {
  outline: 2px solid var(--distortion-color, var(--color-primary));
  outline-offset: 2px;
}
</style>
