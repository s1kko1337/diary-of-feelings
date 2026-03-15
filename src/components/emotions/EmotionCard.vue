<template>
  <div class="relative group rounded-2xl overflow-hidden bg-white border border-ink-100 transition-all hover:shadow-md">
    <!-- Category gradient stripe -->
    <div class="h-1" :class="catGradient" />

    <div class="p-4">
      <div class="flex items-start gap-3">
        <!-- Intensity ring -->
        <div
          class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 text-base font-bold font-display"
          :class="catBg"
        >
          {{ entry.intensity }}
        </div>

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2">
            <span class="text-base font-semibold text-ink-900">{{ entry.emotionName }}</span>
            <span class="text-lg">{{ catEmoji }}</span>
          </div>
          <p class="text-xs text-ink-400 mt-0.5">
            {{ catLabel }} &middot; {{ timeAgo }}
          </p>
        </div>

        <div class="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-all">
          <button
            @click.stop="$emit('edit', entry)"
            class="p-1.5 rounded-lg hover:bg-cream-200 text-ink-300 hover:text-terra-500 transition-all"
            title="Редактировать"
          >
            <Pencil class="w-4 h-4" />
          </button>
          <button
            @click.stop="$emit('remove', entry.id)"
            class="p-1.5 rounded-lg hover:bg-rose-300/20 text-ink-300 hover:text-rose-500 transition-all"
            title="Удалить"
          >
            <X class="w-4 h-4" />
          </button>
        </div>
      </div>

      <!-- Intensity bar -->
      <div class="mt-3 h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <div
          class="h-full rounded-full transition-all"
          :class="intensityBarColor"
          :style="{ width: `${entry.intensity * 10}%` }"
        />
      </div>

      <!-- Time capsule badge -->
      <div v-if="entry.isTimeCapsule" class="mt-2 flex items-center gap-1.5">
        <span class="text-xs px-2 py-0.5 rounded-full bg-violet-300/30 text-violet-600 font-medium">Капсула времени</span>
      </div>

      <p v-if="entry.note" class="mt-3 text-sm text-ink-600 leading-relaxed bg-cream-50 rounded-lg px-3 py-2">
        {{ entry.note }}
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Pencil, X } from 'lucide-vue-next'

const props = defineProps({
  entry: { type: Object, required: true },
})
defineEmits(['remove', 'edit'])

const catConfig = {
  joy:     { gradient: 'bg-gradient-to-r from-gold-400 to-gold-500', bg: 'bg-gold-200 text-gold-600', emoji: '\u2728', label: 'Радость' },
  sadness: { gradient: 'bg-gradient-to-r from-sky-400 to-sky-500', bg: 'bg-sky-300/50 text-sky-600', emoji: '\uD83D\uDCA7', label: 'Грусть' },
  anger:   { gradient: 'bg-gradient-to-r from-rose-400 to-rose-500', bg: 'bg-rose-300/50 text-rose-600', emoji: '\uD83D\uDD25', label: 'Злость' },
  anxiety: { gradient: 'bg-gradient-to-r from-coral-400 to-coral-500', bg: 'bg-coral-300/40 text-coral-600', emoji: '\uD83C\uDF00', label: 'Тревога' },
  fear:    { gradient: 'bg-gradient-to-r from-violet-400 to-violet-500', bg: 'bg-violet-300/50 text-violet-600', emoji: '\uD83D\uDCA8', label: 'Страх' },
  disgust: { gradient: 'bg-gradient-to-r from-forest-400 to-forest-500', bg: 'bg-forest-200/60 text-forest-700', emoji: '\uD83C\uDF43', label: 'Отвращение' },
}

const cfg = computed(() => catConfig[props.entry.emotionCategory] || catConfig.anxiety)
const catGradient = computed(() => cfg.value.gradient)
const catBg = computed(() => cfg.value.bg)
const catEmoji = computed(() => cfg.value.emoji)
const catLabel = computed(() => cfg.value.label)

const intensityBarColor = computed(() => {
  const v = props.entry.intensity
  if (v <= 3) return 'bg-forest-400'
  if (v <= 6) return 'bg-gold-500'
  return 'bg-coral-500'
})

const timeAgo = computed(() => {
  const date = new Date(props.entry.createdAt)
  const now = new Date()
  const diff = Math.floor((now - date) / 60000)
  if (diff < 1) return 'только что'
  if (diff < 60) return `${diff} мин назад`
  const hours = Math.floor(diff / 60)
  if (hours < 24) return `${hours} ч назад`
  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
})
</script>
