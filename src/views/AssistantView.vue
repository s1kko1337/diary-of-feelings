<template>
  <div class="assistant-shell -mx-4 sm:-mx-6 -my-6 sm:-my-8">
    <!-- Conversation sidebar — desktop -->
    <aside class="hidden lg:flex flex-col conv-sidebar border-r border-ink-100 bg-cream-50">
      <div class="p-3 border-b border-ink-100">
        <button
          @click="handleNewChat"
          class="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-terra-500 text-white text-sm font-semibold hover:bg-terra-600 transition-colors active:scale-[0.97]"
        >
          <Plus class="w-4 h-4" />
          Новый чат
        </button>
      </div>
      <div class="flex-1 overflow-y-auto">
        <ConversationList
          :conversations="store.conversations"
          :activeId="store.activeConversationId"
          @select="store.selectConversation($event)"
          @rename="handleRename"
          @delete="handleDelete"
        />
      </div>
    </aside>

    <!-- Mobile sidebar overlay -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="sidebarOpen"
          class="fixed inset-0 left-[280px] z-50 bg-ink-900/40 backdrop-blur-sm lg:hidden"
          @click="sidebarOpen = false"
        />
      </Transition>
      <Transition name="slide-sidebar">
        <aside
          v-if="sidebarOpen"
          class="fixed top-0 left-0 bottom-0 z-50 w-[280px] flex flex-col bg-cream-50 shadow-xl lg:hidden"
        >
          <div class="p-3 border-b border-ink-100 flex items-center justify-between">
            <button
              @click="handleNewChat(); sidebarOpen = false"
              class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-terra-500 text-white text-sm font-semibold hover:bg-terra-600 transition-colors"
            >
              <Plus class="w-4 h-4" />
              Новый чат
            </button>
            <button @click="sidebarOpen = false" class="ml-2 p-2 rounded-lg hover:bg-ink-100 text-ink-400">
              <X class="w-5 h-5" />
            </button>
          </div>
          <div class="flex-1 overflow-y-auto">
            <ConversationList
              :conversations="store.conversations"
              :activeId="store.activeConversationId"
              @select="store.selectConversation($event); sidebarOpen = false"
              @rename="handleRename"
              @delete="handleDelete"
            />
          </div>
        </aside>
      </Transition>
    </Teleport>

    <!-- Chat area -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <div class="flex items-center justify-between px-5 py-3.5 border-b border-ink-100 bg-white/90 backdrop-blur-md z-10">
        <div class="flex items-center gap-3">
          <button
            @click="sidebarOpen = !sidebarOpen"
            class="lg:hidden p-1.5 rounded-lg hover:bg-ink-100 text-ink-400 transition-colors"
          >
            <MessageSquare class="w-5 h-5" />
          </button>
          <div class="w-10 h-10 rounded-full bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center shadow-sm">
            <span class="text-white font-bold text-sm">Л</span>
          </div>
          <div>
            <h1 class="font-display text-lg font-semibold text-ink-900 leading-tight">Лея</h1>
            <p class="text-[11px] text-ink-400 leading-tight">
              {{ store.streaming ? 'печатает...' : store.sending ? 'думает...' : 'AI-ассистент' }}
            </p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <button
            v-if="store.streaming"
            @click="store.stopStream()"
            class="text-xs text-coral-500 hover:text-coral-600 px-3 py-1.5 rounded-lg hover:bg-coral-300/10 transition-colors font-medium flex items-center gap-1.5"
          >
            <Square class="w-3 h-3" />
            Стоп
          </button>
        </div>
      </div>

      <!-- Messages area -->
      <div ref="messagesEl" class="flex-1 overflow-y-auto px-4 py-6 space-y-4 scroll-smooth">
        <!-- Welcome state -->
        <div v-if="!store.messages.length && !store.sending" class="flex flex-col items-center justify-center h-full text-center px-4">
          <div class="w-20 h-20 rounded-full bg-gradient-to-br from-forest-200 to-forest-400 flex items-center justify-center mb-5 shadow-lg">
            <span class="text-white font-bold text-3xl font-display">Л</span>
          </div>
          <h2 class="font-display text-2xl font-bold text-ink-900 mb-2">Привет! Я Лея</h2>
          <p class="text-sm text-ink-500 max-w-xs leading-relaxed mb-8">
            Расскажи, как прошёл твой день, поделись переживаниями или задай вопрос.
          </p>
          <div class="flex flex-wrap gap-2 justify-center max-w-sm">
            <button
              v-for="prompt in quickPrompts"
              :key="prompt"
              @click="sendQuick(prompt)"
              class="px-4 py-2.5 rounded-2xl bg-white border border-ink-200 text-ink-600 text-sm font-medium hover:bg-cream-200 hover:border-ink-300 transition-all active:scale-[0.97]"
            >
              {{ prompt }}
            </button>
          </div>
        </div>

        <!-- Messages -->
        <ChatMessage
          v-for="(msg, i) in store.messages"
          :key="msg.id || i"
          v-show="!(store.streaming && msg.role === 'assistant' && !msg.content)"
          :message="msg"
          :displayText="store.getDisplayText(i)"
          :isTyping="store.isTypingAt(i)"
          @skip="store.skipTypewriter()"
        />

        <!-- Thinking indicator -->
        <div v-if="store.sending && (!store.streaming || streamingEmpty)" class="flex gap-3 max-w-[88%]">
          <div class="w-9 h-9 rounded-full bg-gradient-to-br from-forest-300 to-forest-500 flex items-center justify-center shrink-0 shadow-sm">
            <span class="text-white font-bold text-xs">Л</span>
          </div>
          <div class="bg-white border border-ink-100 rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
            <div class="flex gap-1.5 items-center h-5">
              <span class="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style="animation-delay: 0ms" />
              <span class="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style="animation-delay: 150ms" />
              <span class="w-2 h-2 rounded-full bg-forest-400 animate-bounce" style="animation-delay: 300ms" />
            </div>
          </div>
        </div>
      </div>

      <!-- Input -->
      <ChatInput :disabled="store.sending" @send="handleSend" />
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick, watch, onBeforeUnmount } from 'vue'
import { useAssistantStore } from '@/stores/assistant'
import ChatMessage from '@/components/assistant/ChatMessage.vue'
import ChatInput from '@/components/assistant/ChatInput.vue'
import ConversationList from '@/components/assistant/ConversationList.vue'
import { Square, Plus, X, MessageSquare } from 'lucide-vue-next'

const store = useAssistantStore()
const messagesEl = ref(null)
const sidebarOpen = ref(false)

const streamingEmpty = computed(() => {
  if (!store.streaming) return false
  const last = store.messages[store.messages.length - 1]
  return last?.role === 'assistant' && !last.content
})

const quickPrompts = [
  'Как прошёл мой день?',
  'Мне тревожно',
  'Помоги разобраться',
  'Что посоветуешь?',
]

onMounted(async () => {
  if (!store.conversationsLoaded) {
    await store.loadConversations()
    if (store.conversations.length) {
      await store.selectConversation(store.conversations[0].id)
    } else {
      await store.createConversation()
    }
  } else if (store.activeConversationId && !store.loaded) {
    await store.loadHistory(store.activeConversationId)
  }
  scrollToBottom()
})

onBeforeUnmount(() => {
  if (store.isTypewriting) {
    localStorage.setItem('dof-chat-pending', JSON.stringify({
      status: 'typing',
      conversationId: store.activeConversationId,
    }))
  }
})

watch(() => store.messages.length, () => nextTick(scrollToBottom))

watch(
  () => store.streaming || store.isTypewriting,
  (active) => {
    if (active) {
      const scrollInterval = setInterval(() => {
        if (!store.streaming && !store.isTypewriting) { clearInterval(scrollInterval); return }
        scrollToBottom()
      }, 80)
    }
  },
)

watch(
  () => {
    const last = store.messages[store.messages.length - 1]
    return last?.content?.length
  },
  () => {
    if (store.streaming) nextTick(scrollToBottom)
  },
)

function scrollToBottom() {
  if (messagesEl.value) {
    messagesEl.value.scrollTop = messagesEl.value.scrollHeight
  }
}

async function handleSend(content) {
  try {
    await store.sendStream(content)
  } catch {
    // Error handled by API client
  }
}

async function sendQuick(prompt) {
  await handleSend(prompt)
}

async function handleNewChat() {
  await store.createConversation()
}

async function handleRename({ id, title }) {
  await store.renameConversation(id, title)
}

async function handleDelete(id) {
  if (!confirm('Удалить беседу? Все сообщения будут потеряны.')) return
  await store.deleteConversation(id)
}
</script>

<style scoped>
.assistant-shell {
  display: flex;
  height: calc(100dvh - 56px - env(safe-area-inset-bottom, 0px) - 1.5rem);
}

@media (min-width: 1024px) {
  .assistant-shell {
    height: calc(100dvh - 2.5rem);
  }
}

.conv-sidebar {
  width: 280px;
  flex-shrink: 0;
}

.slide-sidebar-enter-active {
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.slide-sidebar-leave-active {
  transition: transform 0.2s cubic-bezier(0.4, 0, 1, 1);
}
.slide-sidebar-enter-from,
.slide-sidebar-leave-to {
  transform: translateX(-100%);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
