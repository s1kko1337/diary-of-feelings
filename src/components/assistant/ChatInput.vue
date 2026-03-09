<template>
  <div class="chat-input">
    <textarea
      ref="textareaRef"
      v-model="text"
      class="chat-input__field"
      placeholder="Напиши что-нибудь..."
      rows="1"
      :disabled="disabled"
      @keydown.enter.exact.prevent="handleSend"
      @input="autoResize"
    />
    <button class="chat-input__send" :disabled="!text.trim() || disabled" @click="handleSend">
      <SendIcon :size="18" :stroke-width="1.8" />
    </button>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { SendIcon } from 'lucide-vue-next'

defineProps({
  disabled: { type: Boolean, default: false },
})

const emit = defineEmits(['send'])
const text = ref('')
const textareaRef = ref(null)

function handleSend() {
  if (!text.value.trim()) return
  emit('send', text.value.trim())
  text.value = ''
  if (textareaRef.value) {
    textareaRef.value.style.height = 'auto'
  }
}

function autoResize() {
  if (!textareaRef.value) return
  textareaRef.value.style.height = 'auto'
  textareaRef.value.style.height = `${Math.min(textareaRef.value.scrollHeight, 120)}px`
}
</script>

<style scoped>
.chat-input {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: var(--color-surface-solid);
  border-top: 1px solid var(--color-border);
}

.chat-input__field {
  flex: 1;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-xl);
  padding: 0.55rem 0.9rem;
  font-size: 0.9rem;
  font-family: var(--font-main);
  color: var(--color-text);
  background: var(--color-bg);
  resize: none;
  line-height: 1.4;
  overflow: hidden;
  transition: border-color 0.15s;
}

.chat-input__field::placeholder {
  color: var(--color-text-muted);
}

.chat-input__field:focus {
  outline: none;
  border-color: var(--color-accent);
}

.chat-input__field:disabled {
  opacity: 0.6;
}

.chat-input__send {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition:
    background 0.15s,
    box-shadow 0.15s;
}

.chat-input__send:hover:not(:disabled) {
  background: var(--color-accent-hover);
  box-shadow: var(--shadow-card);
}

.chat-input__send:active:not(:disabled) {
  transform: scale(0.97);
}

.chat-input__send:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
</style>
