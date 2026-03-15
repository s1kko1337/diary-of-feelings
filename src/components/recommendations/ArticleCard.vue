<template>
  <div
    class="bg-white rounded-xl border border-ink-100 overflow-hidden transition-all hover:shadow-md group"
    :class="rec.isRead ? 'opacity-70' : ''"
  >
    <!-- Colored header bar based on category -->
    <div class="h-1.5" :class="categoryColor" />

    <div class="p-4">
      <!-- Slot badge -->
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-medium text-ink-400 flex items-center gap-1">
          <component :is="slotIcon" class="w-3.5 h-3.5" />
          {{ slotLabel }}
        </span>
        <span v-if="rec.article?.readingTimeMin" class="text-xs text-ink-400">
          {{ rec.article.readingTimeMin }} мин
        </span>
      </div>

      <!-- Title -->
      <h3 class="font-display font-semibold text-ink-900 leading-snug mb-2 line-clamp-2">
        {{ rec.article?.title }}
      </h3>

      <!-- Summary -->
      <p v-if="rec.article?.summary" class="text-sm text-ink-500 line-clamp-2 mb-3 leading-relaxed">
        {{ rec.article.summary }}
      </p>

      <!-- Tags -->
      <div class="flex flex-wrap gap-1.5 mb-3">
        <span
          v-for="tag in (rec.article?.tags || []).slice(0, 3)"
          :key="tag"
          class="text-xs px-2 py-0.5 rounded-md bg-cream-200 text-ink-500"
        >
          {{ tag }}
        </span>
      </div>

      <!-- Actions -->
      <div class="flex items-center gap-2 pt-2 border-t border-ink-100">
        <button
          v-if="!rec.isRead"
          @click="$emit('read', rec.id)"
          class="flex-1 text-xs font-medium text-terra-500 hover:text-terra-600 py-1.5 rounded-lg hover:bg-terra-50 transition-colors"
        >
          Прочитано
        </button>
        <button
          @click="$emit('helpful', rec.id, true)"
          class="p-1.5 rounded-lg transition-colors"
          :class="rec.helpful === true ? 'text-forest-500 bg-forest-200/50' : 'text-ink-400 hover:bg-cream-200'"
        >
          <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2h0a3.13 3.13 0 013 3.88z"/></svg>
        </button>
        <button
          @click="$emit('helpful', rec.id, false)"
          class="p-1.5 rounded-lg transition-colors"
          :class="rec.helpful === false ? 'text-rose-500 bg-rose-300/20' : 'text-ink-400 hover:bg-cream-200'"
        >
          <svg class="w-4 h-4 rotate-180" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M7 10v12M15 5.88L14 10h5.83a2 2 0 011.92 2.56l-2.33 8A2 2 0 0117.5 22H4a2 2 0 01-2-2v-8a2 2 0 012-2h2.76a2 2 0 001.79-1.11L12 2h0a3.13 3.13 0 013 3.88z"/></svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Sun, Cloud, Moon } from 'lucide-vue-next'

const props = defineProps({
  rec: { type: Object, required: true },
})
defineEmits(['read', 'helpful'])

const categoryColors = {
  anxiety: 'bg-coral-500',
  sadness: 'bg-sky-500',
  anger: 'bg-rose-500',
  productivity: 'bg-forest-500',
  self_esteem: 'bg-violet-500',
  selfEsteem: 'bg-violet-500',
  relationships: 'bg-terra-500',
  cbt: 'bg-violet-400',
  mindfulness: 'bg-forest-400',
  crisis: 'bg-rose-600',
  emotional_intelligence: 'bg-gold-500',
  emotionalIntelligence: 'bg-gold-500',
  sleep: 'bg-sky-600',
  burnout: 'bg-coral-600',
  self_care: 'bg-forest-300',
  selfCare: 'bg-forest-300',
}

const slotConfig = {
  morning: { label: 'Утро', icon: Sun },
  afternoon: { label: 'День', icon: Cloud },
  evening: { label: 'Вечер', icon: Moon },
}

const categoryColor = computed(() =>
  categoryColors[props.rec.article?.category] || 'bg-ink-300'
)
const slotLabel = computed(() => slotConfig[props.rec.slot]?.label || props.rec.slot)
const slotIcon = computed(() => slotConfig[props.rec.slot]?.icon || Sun)
</script>
