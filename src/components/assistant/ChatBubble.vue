<template>
  <div class="bubble-wrap" :class="`bubble-wrap--${message.role}`">
    <div
      class="bubble"
      :class="[`bubble--${message.role}`, { 'bubble--typing': message.isTyping }]"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
      @touchmove="onTouchMove"
    >
      <div v-if="message.isTyping" class="typing-dots"><span /><span /><span /></div>
      <p v-else class="bubble__text">
        {{ message.isStreaming ? message.displayContent : message.content
        }}<span v-if="message.isStreaming" class="bubble__cursor" />
      </p>
    </div>
    <span class="bubble__time">{{ formatTime(message.createdAt) }}</span>

    <Transition name="copy-toast">
      <span v-if="copied" class="copy-toast">Скопировано</span>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  message: { type: Object, required: true },
})

const copied = ref(false)
let pressTimer = null

function onTouchStart() {
  pressTimer = setTimeout(() => copyText(), 600)
}

function onTouchEnd() {
  clearTimeout(pressTimer)
}

function onTouchMove() {
  clearTimeout(pressTimer)
}

async function copyText() {
  const text = props.message.content || props.message.displayContent
  if (!text) return
  try {
    await navigator.clipboard.writeText(text)
    copied.value = true
    setTimeout(() => (copied.value = false), 1800)
  } catch {
    // Clipboard API unavailable in some contexts (e.g. non-HTTPS)
  }
}

function formatTime(iso) {
  return new Date(iso).toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.bubble-wrap {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  max-width: 80%;
  position: relative;
}

.bubble-wrap--user {
  align-self: flex-end;
  align-items: flex-end;
}

.bubble-wrap--assistant {
  align-self: flex-start;
  align-items: flex-start;
}

.bubble {
  padding: 0.65rem 0.9rem;
  border-radius: var(--radius-xl);
  line-height: 1.5;
  user-select: text;
  -webkit-user-select: text;
}

.bubble--user {
  background: var(--color-accent);
  color: white;
  border-bottom-right-radius: 4px;
}

.bubble--assistant {
  background: var(--color-surface-solid);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
  border-bottom-left-radius: 4px;
}

.bubble__text {
  font-size: 0.9rem;
  margin: 0;
}

.bubble__cursor {
  display: inline-block;
  width: 2px;
  height: 0.9em;
  background: currentColor;
  margin-left: 1px;
  vertical-align: text-bottom;
  animation: blink 0.8s step-end infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.bubble__time {
  font-size: 0.68rem;
  color: var(--color-text-muted);
  padding: 0 0.25rem;
}

.typing-dots {
  display: flex;
  gap: 4px;
  padding: 2px 4px;
}

.typing-dots span {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--color-text-muted);
  animation: dot-bounce 1.2s infinite;
}

.typing-dots span:nth-child(2) {
  animation-delay: 0.2s;
}

.typing-dots span:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes dot-bounce {
  0%,
  80%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }
  40% {
    transform: translateY(-6px);
    opacity: 1;
  }
}

.copy-toast {
  position: absolute;
  bottom: calc(100% + 4px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.75);
  color: white;
  font-size: 0.72rem;
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
  white-space: nowrap;
  pointer-events: none;
}

.copy-toast-enter-active,
.copy-toast-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.copy-toast-enter-from,
.copy-toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(4px);
}
</style>
