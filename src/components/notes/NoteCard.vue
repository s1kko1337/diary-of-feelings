<template>
  <div
    @click="$emit('edit', note)"
    class="rounded-2xl cursor-pointer transition-all hover:shadow-md border group"
    :class="[bgClass, compact ? 'p-3 flex items-center gap-3' : 'p-4']"
  >
    <template v-if="compact">
      <!-- List mode -->
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <svg v-if="note.pinned" class="w-3 h-3 text-terra-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M16 2l6 6-2.6 2.6L22 14l-2.4 2.4-1-1L14 20l-4-4-6 6-1-1 6-6-4-4 4.6-4.6-1-1L11 3l3.4 2.6z"/></svg>
          <h3 class="font-semibold text-ink-900 text-sm truncate">{{ note.title || 'Без заголовка' }}</h3>
        </div>
        <p v-if="note.content" class="text-xs text-ink-500 truncate mt-0.5">{{ note.content }}</p>
      </div>
      <span class="text-[10px] text-ink-400 shrink-0">{{ formatDate(note.createdAt) }}</span>
      <button
        @click.stop="$emit('remove', note.id)"
        class="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-ink-900/10 text-ink-400 hover:text-rose-500 transition-all shrink-0"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </template>

    <template v-else>
      <!-- Grid mode -->
      <div class="flex items-start justify-between mb-2">
        <div class="flex items-center gap-2 flex-1 min-w-0">
          <svg v-if="note.pinned" class="w-3.5 h-3.5 text-terra-500 shrink-0" viewBox="0 0 24 24" fill="currentColor"><path d="M16 2l6 6-2.6 2.6L22 14l-2.4 2.4-1-1L14 20l-4-4-6 6-1-1 6-6-4-4 4.6-4.6-1-1L11 3l3.4 2.6z"/></svg>
          <h3 v-if="note.title" class="font-display font-semibold text-ink-900 leading-snug line-clamp-1">{{ note.title }}</h3>
        </div>
        <button
          @click.stop="$emit('remove', note.id)"
          class="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-ink-900/10 text-ink-400 hover:text-rose-500 transition-all shrink-0"
        >
          <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
        </button>
      </div>
      <p v-if="note.content" class="text-sm text-ink-600 line-clamp-4 leading-relaxed whitespace-pre-line">{{ note.content }}</p>
      <p class="text-[10px] text-ink-400 mt-3">{{ formatDate(note.createdAt) }}</p>
    </template>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  note: { type: Object, required: true },
  compact: Boolean,
})
defineEmits(['edit', 'remove'])

const colorMap = {
  default: 'bg-white border-ink-100',
  yellow: 'bg-gold-200/40 border-gold-300/40',
  green: 'bg-forest-200/40 border-forest-300/40',
  pink: 'bg-coral-300/20 border-coral-300/40',
  blue: 'bg-sky-300/25 border-sky-300/40',
  purple: 'bg-violet-300/25 border-violet-300/40',
}
const bgClass = computed(() => colorMap[props.note.color] || colorMap.default)

function formatDate(ts) {
  return new Date(ts).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>
