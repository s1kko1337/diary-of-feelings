<template>
  <form @submit.prevent="submit" class="flex gap-2">
    <input
      v-model="text"
      type="text"
      placeholder="Добавить задачу..."
      class="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
      @keydown.enter.prevent="submit"
    />
    <button
      type="submit"
      :disabled="!text.trim()"
      class="px-4 py-2.5 rounded-xl bg-terra-500 text-white text-sm font-medium hover:bg-terra-600 transition-all active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
    >
      <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const emit = defineEmits(['add'])
const text = ref('')

function submit() {
  const val = text.value.trim()
  if (!val) return
  emit('add', { text: val })
  text.value = ''
}
</script>
