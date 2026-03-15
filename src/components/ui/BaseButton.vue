<template>
  <button
    :class="[
      'inline-flex items-center justify-center font-medium transition-all duration-150 rounded-xl',
      'focus:outline-none focus-visible:ring-2 focus-visible:ring-terra-400 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-100',
      'disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.97]',
      sizeClasses,
      variantClasses,
    ]"
    :disabled="disabled || loading"
  >
    <svg v-if="loading" class="animate-spin -ml-1 mr-2 h-4 w-4" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" class="opacity-25" />
      <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="3" stroke-linecap="round" class="opacity-75" />
    </svg>
    <slot />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: { type: String, default: 'primary' },
  size: { type: String, default: 'md' },
  loading: Boolean,
  disabled: Boolean,
})

const sizes = { sm: 'text-sm px-3 py-1.5', md: 'text-sm px-4 py-2.5', lg: 'text-base px-6 py-3' }
const variants = {
  primary: 'bg-terra-500 text-white hover:bg-terra-600 shadow-sm',
  secondary: 'bg-cream-200 text-ink-800 hover:bg-cream-300',
  ghost: 'text-ink-600 hover:bg-cream-200',
  danger: 'bg-rose-500 text-white hover:bg-rose-600',
}

const sizeClasses = computed(() => sizes[props.size])
const variantClasses = computed(() => variants[props.variant])
</script>
