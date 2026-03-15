<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4"
        @click.self="close"
      >
        <div class="fixed inset-0 bg-ink-900/40 backdrop-blur-sm" @click="close" />
        <div
          class="relative bg-white rounded-t-2xl sm:rounded-2xl shadow-xl w-full max-h-[90vh] overflow-y-auto"
          :class="sizeClass"
          @click.stop
        >
          <div v-if="title" class="sticky top-0 bg-white/95 backdrop-blur-sm px-6 pt-5 pb-3 border-b border-ink-100 z-10">
            <div class="flex items-center justify-between">
              <h2 class="font-display text-xl font-semibold text-ink-900">{{ title }}</h2>
              <button @click="close" class="p-1.5 rounded-lg hover:bg-cream-200 transition-colors text-ink-400 hover:text-ink-600">
                <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
              </button>
            </div>
          </div>
          <div class="px-6 py-4">
            <slot />
          </div>
          <div v-if="$slots.footer" class="sticky bottom-0 bg-white/95 backdrop-blur-sm px-6 py-4 border-t border-ink-100">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: Boolean,
  title: String,
  size: { type: String, default: 'md' },
})
const emit = defineEmits(['update:modelValue'])

const sizes = { sm: 'sm:max-w-sm', md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', xl: 'sm:max-w-4xl' }
const sizeClass = computed(() => sizes[props.size])

function close() {
  emit('update:modelValue', false)
}
</script>
