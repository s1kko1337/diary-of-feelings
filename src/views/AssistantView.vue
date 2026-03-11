<template>
  <div class="assistant-page">
    <header class="assistant-header">
      <div class="assistant-header__info">
        <div class="assistant-avatar">
          <SparklesIcon :size="20" :stroke-width="1.8" />
        </div>
        <div>
          <div class="assistant-name">Ассистент</div>
          <div class="assistant-status">
            {{
              store.sending
                ? 'печатает...'
                : 'всегда здесь'
            }}
          </div>
        </div>
      </div>
      <div class="assistant-header__actions">
        <button
          class="assistant-info-btn"
          @click="openContextSheet"
        >
          <InfoIcon :size="18" :stroke-width="1.8" />
        </button>
        <button
          v-if="store.messages.length"
          class="assistant-clear"
          @click="handleClear"
        >
          <Trash2Icon :size="18" :stroke-width="1.8" />
        </button>
      </div>
    </header>

    <div
      ref="scrollRef"
      class="assistant-messages"
      @scroll="onScroll"
    >
      <div
        v-if="!store.messages.length && !store.loading"
        class="assistant-empty"
      >
        <div class="assistant-empty__avatar">
          <SparklesIcon :size="28" :stroke-width="1.5" />
        </div>
        <p class="assistant-empty__greeting">Привет!</p>
        <p class="assistant-empty__text">
          Я здесь, чтобы выслушать тебя и поддержать.<br />
          Расскажи, как ты сегодня?
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

      <template
        v-for="(item, idx) in messagesWithSeparators"
        :key="item.key ?? item.id"
      >
        <div
          v-if="item.type === 'separator'"
          class="date-separator"
        >
          <span>{{ item.label }}</span>
        </div>
        <template v-else>
          <ChatBubble :message="item" />
          <div
            v-if="isLastAssistantMsg(item, idx)"
            class="quick-replies"
          >
            <button
              v-for="qr in QUICK_REPLIES"
              :key="qr"
              class="quick-reply-btn"
              @click="handleQuickReply(qr)"
            >
              {{ qr }}
            </button>
          </div>
        </template>
      </template>
    </div>

    <Transition name="scroll-btn">
      <button
        v-if="showScrollBtn"
        class="scroll-to-bottom"
        @click="scrollToBottom"
      >
        <ChevronDownIcon :size="18" :stroke-width="2" />
      </button>
    </Transition>

    <!-- Mood survey overlay -->
    <Transition name="mood-survey">
      <div v-if="showMoodSurvey" class="mood-survey">
        <div class="mood-survey__card glass-card">
          <div class="mood-survey__title">Как ты сейчас?</div>
          <div class="mood-survey__options">
            <button
              v-for="m in MOOD_OPTIONS"
              :key="m.key"
              class="mood-option"
              @click="handleMoodSelect(m)"
            >
              <span class="mood-option__emoji">
                {{ m.emoji }}
              </span>
              <span class="mood-option__label">
                {{ m.label }}
              </span>
            </button>
          </div>
          <button
            class="mood-survey__skip"
            @click="dismissMoodSurvey"
          >
            Пропустить
          </button>
        </div>
      </div>
    </Transition>

    <!-- Context bottom sheet -->
    <Transition name="context-sheet">
      <div
        v-if="showContextSheet"
        class="context-backdrop"
        @click.self="closeContextSheet"
      >
        <div class="context-sheet glass-card">
          <div class="context-sheet__header">
            <span class="context-sheet__title">
              Что ассистент знает о тебе
            </span>
            <button
              class="context-sheet__close"
              @click="closeContextSheet"
            >
              <XIcon :size="18" :stroke-width="1.8" />
            </button>
          </div>
          <div class="context-sheet__body">
            <div class="context-section">
              <div class="context-section__heading">
                Данные из дневника
              </div>
              <ul class="context-list">
                <li>
                  Последних записей эмоций:
                  {{ emotionsStore.history.length }}
                </li>
                <li>
                  Задач на сегодня: {{ todayTaskCount }}
                </li>
                <li>
                  Стрик: {{ streakCount }} дней подряд
                </li>
                <li>Настроение: {{ moodTrendLabel }}</li>
              </ul>
            </div>
            <div class="context-section">
              <div class="context-section__heading">
                Цифровой портрет
              </div>
              <ul class="context-list">
                <li>
                  Доминирующая эмоция:
                  {{ portrait?.dominant_emotion ?? '—' }}
                </li>
                <li>Тренд: {{ portraitTrendLabel }}</li>
                <li>
                  Уровень стресса:
                  {{
                    portrait?.stress_level != null
                      ? portrait.stress_level + '/10'
                      : '—'
                  }}
                </li>
              </ul>
            </div>
            <div class="context-section">
              <div class="context-section__heading">
                Контекст
              </div>
              <p class="context-note">
                Ассистент видит твои записи за последние
                14 дней, заметки, задачи и историю КПТ.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <ChatInput :disabled="store.sending" @send="handleSend" />
  </div>
</template>

<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue'
import {
  ChevronDownIcon,
  InfoIcon,
  SparklesIcon,
  Trash2Icon,
  XIcon,
} from 'lucide-vue-next'
import { useAssistantStore } from '@/stores/assistant'
import { useEmotionsStore } from '@/stores/emotions'
import { useTasksStore } from '@/stores/tasks'
import { useRecommendationsStore } from '@/stores/recommendations'
import ChatBubble from '@/components/assistant/ChatBubble.vue'
import ChatInput from '@/components/assistant/ChatInput.vue'

const SUGGESTIONS = [
  { icon: '😔', text: 'Я чувствую себя подавленно' },
  { icon: '😰', text: 'Как справляться с тревогой?' },
  { icon: '🤔', text: 'Помоги разобраться в ситуации' },
  { icon: '📋', text: 'Помоги составить план на день' },
  { icon: '💭', text: 'Разбор тревожной мысли' },
]

const QUICK_REPLIES = [
  'Расскажи подробнее',
  'Что мне сделать?',
  'Я понял(а), спасибо',
]

const MOOD_OPTIONS = [
  { key: 'happy', category: 'joy', emoji: '😊', label: 'Хорошо' },
  {
    key: 'neutral',
    category: 'neutral',
    emoji: '😐',
    label: 'Нейтрально',
  },
  { key: 'sad', category: 'sadness', emoji: '😔', label: 'Грустно' },
  {
    key: 'anxious',
    category: 'fear',
    emoji: '😰',
    label: 'Тревожно',
  },
  { key: 'angry', category: 'anger', emoji: '😤', label: 'Злюсь' },
]

const MOOD_TREND_MAP = {
  improving: 'улучшается',
  stable: 'стабильно',
  declining: 'снижается',
}

const store = useAssistantStore()
const emotionsStore = useEmotionsStore()
const tasksStore = useTasksStore()
const recsStore = useRecommendationsStore()

const scrollRef = ref(null)
const showScrollBtn = ref(false)
const showMoodSurvey = ref(false)
const moodSurveyDismissed = ref(false)
const showContextSheet = ref(false)

const portrait = computed(() => recsStore.portrait)

const todayTaskCount = computed(() => {
  const today = new Date().toISOString().slice(0, 10)
  return tasksStore.tasks.filter((t) => t.date === today).length
})

const streakCount = computed(() => {
  const all = emotionsStore.history
  if (!all.length) return 0
  const dates = new Set(all.map((e) => e.date))
  let count = 0
  const day = new Date()
  while (true) {
    const ds = day.toISOString().slice(0, 10)
    if (!dates.has(ds)) break
    count++
    day.setDate(day.getDate() - 1)
  }
  return count
})

const moodTrendLabel = computed(() => {
  const trend = portrait.value?.mood_trend
  return MOOD_TREND_MAP[trend] ?? 'формируется'
})

const portraitTrendLabel = computed(() => {
  const trend = portrait.value?.mood_trend
  return MOOD_TREND_MAP[trend] ?? '—'
})

onMounted(() => {
  store.fetchHistory()
  emotionsStore.loadToday()
  recsStore.fetchPortrait()

  // Show mood survey after short delay if no entry today
  setTimeout(() => {
    if (
      !emotionsStore.hasEntryToday
      && !moodSurveyDismissed.value
    ) {
      showMoodSurvey.value = true
    }
  }, 300)
})

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
      result.push({
        type: 'separator',
        key: 'sep-' + date,
        label: formatDateLabel(msg.createdAt),
      })
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
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
}

// Quick replies visible only under the last assistant message
function isLastAssistantMsg(item, idx) {
  if (item.role !== 'assistant' || item.isTyping) return false
  if (store.sending) return false
  const list = messagesWithSeparators.value
  for (let i = idx + 1; i < list.length; i++) {
    if (list[i].type === 'separator') continue
    if (list[i].role === 'assistant' && !list[i].isTyping) {
      return false
    }
  }
  return true
}

async function handleSend(text) {
  showMoodSurvey.value = false
  await store.sendMessage(text)
  await nextTick()
  scrollToBottom()
}

function handleQuickReply(text) {
  handleSend(text)
}

async function handleClear() {
  await store.clearHistory()
}

async function handleMoodSelect(mood) {
  showMoodSurvey.value = false
  moodSurveyDismissed.value = true
  try {
    await emotionsStore.createEntry({
      emotion: mood.key,
      emotionCategory: mood.category,
      intensity: 5,
    })
  } catch {
    // Survey is non-critical, fail silently
  }
  const label =
    `Моё настроение сейчас: ${mood.emoji} ${mood.label}`
  handleSend(label)
}

function dismissMoodSurvey() {
  showMoodSurvey.value = false
  moodSurveyDismissed.value = true
}

function openContextSheet() {
  showContextSheet.value = true
}

function closeContextSheet() {
  showContextSheet.value = false
}

function scrollToBottom() {
  if (scrollRef.value) {
    scrollRef.value.scrollTo({
      top: scrollRef.value.scrollHeight,
      behavior: 'smooth',
    })
    showScrollBtn.value = false
  }
}

function onScroll() {
  if (!scrollRef.value) return
  const { scrollTop, scrollHeight, clientHeight } = scrollRef.value
  showScrollBtn.value =
    scrollHeight - scrollTop - clientHeight > 120
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

.assistant-header__actions {
  display: flex;
  align-items: center;
  gap: 0.25rem;
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

.assistant-info-btn {
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

.assistant-info-btn:hover {
  color: var(--color-accent);
  background: var(--color-surface);
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

/* Quick replies */
.quick-replies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  padding-left: 0.5rem;
}

.quick-reply-btn {
  padding: 0.35rem 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.5);
  font-size: 0.8rem;
  font-family: var(--font-main);
  color: var(--color-text-muted);
  cursor: pointer;
  white-space: nowrap;
  transition:
    background 0.15s,
    border-color 0.15s,
    color 0.15s;
}

.quick-reply-btn:hover {
  background: var(--color-accent-mist);
  border-color: var(--color-accent-subtle);
  color: var(--color-accent);
}

.quick-reply-btn:active {
  transform: scale(0.97);
}

/* Scroll to bottom */
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

/* Mood survey overlay */
.mood-survey {
  position: absolute;
  bottom: calc(64px + 3.5rem);
  left: 0;
  right: 0;
  z-index: 20;
  display: flex;
  justify-content: center;
  padding: 0 1rem;
  pointer-events: none;
}

.mood-survey__card {
  pointer-events: auto;
  padding: 1.25rem;
  width: 100%;
  max-width: 400px;
  text-align: center;
}

.mood-survey__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 1rem;
}

.mood-survey__options {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.mood-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 0.6rem 0.5rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface-solid);
  cursor: pointer;
  min-width: 60px;
  font-family: var(--font-main);
  transition:
    background 0.15s,
    border-color 0.15s,
    transform 0.15s;
}

.mood-option:hover {
  background: var(--color-accent-mist);
  border-color: var(--color-accent-subtle);
}

.mood-option:active {
  transform: scale(0.95);
}

.mood-option__emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.mood-option__label {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  white-space: nowrap;
}

.mood-survey__skip {
  margin-top: 0.75rem;
  background: none;
  border: none;
  font-size: 0.8rem;
  font-family: var(--font-main);
  color: var(--color-text-muted);
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  transition: color 0.15s;
}

.mood-survey__skip:hover {
  color: var(--color-text);
}

.mood-survey-enter-active,
.mood-survey-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.mood-survey-enter-from,
.mood-survey-leave-to {
  opacity: 0;
  transform: translateY(12px);
}

/* Context bottom sheet */
.context-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 50;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}

.context-sheet {
  width: 100%;
  max-width: 480px;
  border-radius: 20px 20px 0 0;
  padding: 1.25rem 1.25rem 2rem;
  max-height: 70vh;
  overflow-y: auto;
}

.context-sheet__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.25rem;
}

.context-sheet__title {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--color-text);
}

.context-sheet__close {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 0.25rem;
  border-radius: var(--radius-sm);
  transition:
    color 0.15s,
    background 0.15s;
}

.context-sheet__close:hover {
  color: var(--color-text);
  background: var(--color-surface);
}

.context-section {
  margin-bottom: 1rem;
}

.context-section__heading {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.context-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.context-list li {
  font-size: 0.88rem;
  color: var(--color-text);
  line-height: 1.5;
}

.context-list li::before {
  content: '\2022';
  color: var(--color-accent);
  margin-right: 0.5rem;
}

.context-note {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  margin: 0;
}

.context-sheet-enter-active,
.context-sheet-leave-active {
  transition: opacity 0.25s ease;
}

.context-sheet-enter-active .context-sheet,
.context-sheet-leave-active .context-sheet {
  transition: transform 0.3s ease;
}

.context-sheet-enter-from,
.context-sheet-leave-to {
  opacity: 0;
}

.context-sheet-enter-from .context-sheet,
.context-sheet-leave-to .context-sheet {
  transform: translateY(100%);
}
</style>
