<template>
  <form @submit.prevent="send" class="flex items-end gap-2 p-4 bg-white/80 backdrop-blur-sm border-t border-ink-100">
    <textarea
      ref="inputEl"
      v-model="text"
      placeholder="Напишите Лее..."
      rows="1"
      class="flex-1 rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 max-h-32"
      @input="autoResize"
      @keydown.enter.exact.prevent="send"
    />
    <button
      type="submit"
      :disabled="!text.trim() || disabled"
      class="p-2.5 rounded-xl bg-terra-500 text-white hover:bg-terra-600 transition-all active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm shrink-0"
    >
      <svg class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4z"/></svg>
    </button>
  </form>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  disabled: Boolean,
})
const emit = defineEmits(['send'])

const text = ref('')
const inputEl = ref(null)

function autoResize() {
  const el = inputEl.value
  if (!el) return
  el.style.height = 'auto'
  el.style.height = Math.min(el.scrollHeight, 128) + 'px'
}

function send() {
  const val = text.value.trim()
  if (!val || props.disabled) return
  emit('send', val)
  text.value = ''
  if (inputEl.value) inputEl.value.style.height = 'auto'
}
</script>
