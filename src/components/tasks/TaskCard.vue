<template>
  <div
    class="group flex items-start gap-3 p-3.5 rounded-xl bg-white border transition-all hover:shadow-sm"
    :class="task.completed ? 'border-ink-100 opacity-60' : 'border-ink-100'"
  >
    <!-- Checkbox -->
    <button
      @click="toggleComplete"
      class="mt-0.5 w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 transition-all"
      :class="
        task.completed
          ? 'bg-forest-500 border-forest-500 text-white'
          : 'border-ink-300 hover:border-terra-400'
      "
    >
      <svg v-if="task.completed" class="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
    </button>

    <!-- Content -->
    <div class="flex-1 min-w-0">
      <p
        class="text-sm leading-snug"
        :class="task.completed ? 'line-through text-ink-400' : 'text-ink-900'"
      >
        {{ task.text }}
      </p>
      <div class="flex items-center gap-2 mt-1.5" v-if="task.category || task.priority !== 'none'">
        <span v-if="task.category" class="text-xs text-ink-400 bg-cream-200 px-2 py-0.5 rounded-md">
          {{ task.category }}
        </span>
        <span v-if="task.priority === 'high'" class="w-2 h-2 rounded-full bg-coral-500" title="Высокий приоритет" />
        <span v-if="task.priority === 'normal'" class="w-2 h-2 rounded-full bg-gold-500" title="Обычный приоритет" />
      </div>
    </div>

    <!-- Color indicator -->
    <div
      class="w-2 h-8 rounded-full shrink-0"
      :class="colorClass"
    />

    <!-- Delete -->
    <button
      @click="$emit('remove', task.id)"
      class="p-1 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-cream-200 text-ink-400 hover:text-rose-500 transition-all shrink-0"
    >
      <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M18 6L6 18M6 6l12 12"/></svg>
    </button>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  task: { type: Object, required: true },
})
const emit = defineEmits(['update', 'remove'])

const colorMap = {
  yellow: 'bg-gold-400',
  green: 'bg-forest-400',
  pink: 'bg-coral-400',
  blue: 'bg-sky-500',
  purple: 'bg-violet-500',
}

const colorClass = computed(() => colorMap[props.task.color] || 'bg-ink-200')

function toggleComplete() {
  emit('update', props.task.id, { completed: !props.task.completed })
}
</script>
