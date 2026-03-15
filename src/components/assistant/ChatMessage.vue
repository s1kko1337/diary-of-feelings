<template>
  <div
    class="flex gap-3"
    :class="isUser ? 'ml-auto flex-row-reverse max-w-[85%]' : 'max-w-[88%]'"
  >
    <!-- Avatar -->
    <div
      class="w-9 h-9 rounded-full flex items-center justify-center shrink-0 shadow-sm"
      :class="isUser ? 'bg-terra-100 text-terra-600' : 'bg-forest-200 text-forest-700'"
    >
      <span class="text-xs font-bold">{{ isUser ? 'Вы' : 'Л' }}</span>
    </div>

    <!-- Bubble -->
    <div
      class="rounded-2xl px-4 py-3 text-sm leading-relaxed relative"
      :class="isUser
        ? 'bg-terra-500 text-white rounded-br-md shadow-sm'
        : 'bg-white border border-ink-100 text-ink-800 rounded-bl-md shadow-sm'"
      @click="isTyping && $emit('skip')"
    >
      <p class="whitespace-pre-line">{{ renderedText }}<span
          v-if="isTyping"
          class="inline-block w-[2px] h-[0.95em] ml-0.5 align-text-bottom animate-pulse"
          :class="isUser ? 'bg-white/70' : 'bg-terra-500'"
        /></p>
      <p
        class="text-[10px] mt-1.5"
        :class="isUser ? 'text-right text-white/50' : 'text-ink-400'"
      >
        {{ formatTime(message.createdAt) }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  message: { type: Object, required: true },
  displayText: { type: String, default: null },
  isTyping: Boolean,
})
defineEmits(['skip'])

const isUser = computed(() => props.message.role === 'user')
const renderedText = computed(() => props.displayText ?? props.message.content)

function formatTime(ts) {
  if (!ts) return ''
  return new Date(ts).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })
}
</script>
