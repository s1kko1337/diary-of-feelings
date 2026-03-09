<template>
  <div class="assistant-page">
    <header class="assistant-header">
      <div class="assistant-header__info">
        <div class="assistant-avatar">
          <SparklesIcon :size="20" :stroke-width="1.8" />
        </div>
        <div>
          <div class="assistant-name">Ассистент</div>
          <div class="assistant-status">{{ store.sending ? 'печатает...' : 'всегда здесь' }}</div>
        </div>
      </div>
      <button v-if="store.messages.length" class="assistant-clear" @click="handleClear">
        <Trash2Icon :size="18" :stroke-width="1.8" />
      </button>
    </header>

    <div ref="scrollRef" class="assistant-messages" @scroll="onScroll">
      <div v-if="!store.messages.length && !store.loading" class="assistant-empty">
        <div class="assistant-empty__avatar">
          <SparklesIcon :size="28" :stroke-width="1.5" />
        </div>
        <p class="assistant-empty__greeting">Привет!</p>
        <p class="assistant-empty__text">
          Я здесь, чтобы выслушать тебя и поддержать.<br />Расскажи, как ты сегодня?
        </p>
        <div class="assistant-suggestions">
          <button
            v-for="s in SUGGESTIONS"
            :key="s.text"
            class="assistant-suggestion"
            @click="handleSend(s.text)"
          >
            <span class="suggestion-icon">{{ s.icon }}</span>
            {{ s.text }}
          </button>
        </div>
      </div>

      <template v-for="item in messagesWithSeparators" :key="item.key ?? item.id">
        <div v-if="item.type === 'separator'" class="date-separator">
          <span>{{ item.label }}</span>
        </div>
        <ChatBubble v-else :message="item" />
      </template>
    </div>

    <Transition name="scroll-btn">
      <button v-if="showScrollBtn" class="scroll-to-bottom" @click="scrollToBottom">
        <ChevronDownIcon :size="18" :stroke-width="2" />
      </button>
    </Transition>

    <ChatInput :disabled="store.sending" @send="handleSend" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import { ChevronDownIcon, SparklesIcon, Trash2Icon } from 'lucide-vue-next'
import { useAssistantStore } from '@/stores/assistant'
import ChatBubble from '@/components/assistant/ChatBubble.vue'
import ChatInput from '@/components/assistant/ChatInput.vue'

const SUGGESTIONS = [
  { icon: '😔', text: 'Я чувствую себя подавленно' },
  { icon: '😰', text: 'Как справляться с тревогой?' },
  { icon: '🤔', text: 'Помоги разобраться в ситуации' },
  { icon: '📋', text: 'Помоги составить план на день' },
  { icon: '💭', text: 'Разбор тревожной мысли' },
]

const store = useAssistantStore()
const scrollRef = ref(null)
const showScrollBtn = ref(false)

onMounted(() => store.fetchHistory())

const messagesWithSeparators = computed(() => {
  const result = []
  let lastDate = null
  for (const msg of store.messages) {
    if (msg.isTyping) {
      result.push(msg)
      continue
    }
    const date = new Date(msg.createdAt).toDateString()
    if (date !== lastDate) {
      lastDate = date
      result.push({ type: 'separator', key: 'sep-' + date, label: formatDateLabel(msg.createdAt) })
    }
    result.push(msg)
  }
  return result
})

function formatDateLabel(iso) {
  const d = new Date(iso)
  const today = new Date()
  const yesterday = new Date(today)
  yesterday.setDate(today.getDate() - 1)

  if (d.toDateString() === today.toDateString()) return 'Сегодня'
  if (d.toDateString() === yesterday.toDateString()) return 'Вчера'
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })
}

async function handleSend(text) {
  await store.sendMessage(text)
  await nextTick()
  scrollToBottom()
}

async function handleClear() {
  await store.clearHistory()
}

function scrollToBottom() {
  if (scrollRef.value) {
    scrollRef.value.scrollTo({ top: scrollRef.value.scrollHeight, behavior: 'smooth' })
    showScrollBtn.value = false
  }
}

function onScroll() {
  if (!scrollRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollRef.value
  showScrollBtn.value = scrollHeight - scrollTop - clientHeight > 120
}

watch(
  () => store.messages.length,
  () => nextTick(scrollToBottom),
)
</script>

<style scoped>
.assistant-page {
  display: flex;
  flex-direction: column;
  height: 100vh;
  height: 100dvh;
  padding-bottom: 64px;
  position: relative;
}

.assistant-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--color-border);
  background: var(--color-surface-solid);
  flex-shrink: 0;
}

.assistant-header__info {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.assistant-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
}

.assistant-name {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--color-text);
}

.assistant-status {
  font-size: 0.72rem;
  color: var(--color-success);
  transition: color 0.2s;
}

.assistant-clear {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  transition:
    color 0.15s,
    background 0.15s;
}

.assistant-clear:hover {
  color: var(--color-danger);
  background: var(--color-surface);
}

.assistant-messages {
  flex: 1;
  overflow-y: auto;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  background: var(--color-surface);
}

.assistant-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2rem 1rem;
  gap: 0.75rem;
}

.assistant-empty__avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.assistant-empty__greeting {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0;
}

.assistant-empty__text {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.assistant-suggestions {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
  margin-top: 0.75rem;
  width: 100%;
  max-width: 300px;
}

.assistant-suggestion {
  padding: 0.55rem 1rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: var(--color-surface-solid);
  font-size: 0.85rem;
  font-family: var(--font-main);
  color: var(--color-text);
  cursor: pointer;
  text-align: left;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
}

.assistant-suggestion:active {
  transform: scale(0.98);
}

.assistant-suggestion:hover {
  background: var(--color-accent-mist);
  border-color: var(--color-accent-subtle);
}

.suggestion-icon {
  font-size: 1rem;
  flex-shrink: 0;
}

.date-separator {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0.25rem 0;
  color: var(--color-text-muted);
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.04em;
}

.date-separator::before,
.date-separator::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--color-border);
}

.scroll-to-bottom {
  position: absolute;
  bottom: calc(64px + 4.5rem + env(safe-area-inset-bottom, 0px));
  right: 1rem;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface-solid);
  color: var(--color-text);
  box-shadow: var(--shadow-card);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
}

.scroll-btn-enter-active,
.scroll-btn-leave-active {
  transition: opacity 0.2s, transform 0.2s;
}
.scroll-btn-enter-from,
.scroll-btn-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
