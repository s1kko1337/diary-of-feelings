<template>
  <div
    @click="$emit('select', entry)"
    class="bg-white rounded-xl p-4 border border-ink-100 cursor-pointer transition-all hover:shadow-sm group"
  >
    <div class="flex items-start justify-between mb-2">
      <span
        class="inline-flex px-2.5 py-0.5 rounded-lg text-xs font-medium"
        :class="statusStyle"
      >
        {{ statusLabel }}
      </span>
      <button
        @click.stop="$emit('remove', entry.id)"
        class="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-cream-200 text-ink-400 hover:text-rose-500 transition-all"
      >
        <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
      </button>
    </div>

    <h3 class="font-medium text-ink-900 leading-snug line-clamp-2 mb-2">{{ entry.situation }}</h3>

    <div v-if="entry.emotions?.length" class="flex flex-wrap gap-1.5 mb-2">
      <span
        v-for="(em, i) in entry.emotions.slice(0, 3)"
        :key="i"
        class="text-xs px-2 py-0.5 rounded-md bg-coral-300/30 text-coral-600"
      >
        {{ em.name }} {{ em.intensity }}
      </span>
      <span v-if="entry.emotions.length > 3" class="text-xs text-ink-400">
        +{{ entry.emotions.length - 3 }}
      </span>
    </div>

    <div v-if="entry.distortions?.length" class="flex flex-wrap gap-1 mb-2">
      <span
        v-for="d in entry.distortions.slice(0, 2)"
        :key="d"
        class="text-xs px-2 py-0.5 rounded-md bg-violet-300/30 text-violet-600"
      >
        {{ d }}
      </span>
      <span v-if="entry.distortions.length > 2" class="text-xs text-ink-400">
        +{{ entry.distortions.length - 2 }}
      </span>
    </div>

    <p class="text-xs text-ink-400">
      {{ new Date(entry.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' }) }}
    </p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  entry: { type: Object, required: true },
})
defineEmits(['select', 'remove'])

const statusStyles = {
  new: 'bg-sky-300/30 text-sky-600',
  in_progress: 'bg-gold-200 text-gold-600',
  inProgress: 'bg-gold-200 text-gold-600',
  processed: 'bg-forest-200 text-forest-600',
}
const statusLabels = {
  new: 'Новая',
  in_progress: 'В работе',
  inProgress: 'В работе',
  processed: 'Обработана',
}

const statusStyle = computed(() => statusStyles[props.entry.status] || statusStyles.new)
const statusLabel = computed(() => statusLabels[props.entry.status] || 'Новая')
</script>
