<template>
  <div class="py-2">
    <div v-if="!conversations.length" class="px-4 py-8 text-center text-sm text-ink-400">
      Нет бесед
    </div>
    <button
      v-for="conv in conversations"
      :key="conv.id"
      @click="$emit('select', conv.id)"
      class="w-full text-left px-3 py-2.5 mx-1 rounded-xl transition-all duration-150 group"
      :class="conv.id === activeId
        ? 'bg-terra-500/10 text-ink-900'
        : 'text-ink-600 hover:bg-ink-100/60'"
      :style="{ width: 'calc(100% - 0.5rem)' }"
    >
      <div class="flex items-start justify-between gap-2">
        <p class="text-sm font-medium truncate flex-1" :class="conv.id === activeId ? 'text-terra-700' : ''">
          {{ conv.title || 'Новый чат' }}
        </p>
        <span class="text-[10px] text-ink-400 shrink-0 mt-0.5">{{ formatTime(conv.updatedAt) }}</span>
      </div>
      <p v-if="conv.lastMessage" class="text-xs text-ink-400 truncate mt-0.5">
        {{ conv.lastMessage }}
      </p>

      <!-- Hover actions -->
      <div
        class="hidden group-hover:flex items-center gap-1 mt-1"
        @click.stop
      >
        <button
          @click="startRename(conv)"
          class="text-[10px] text-ink-400 hover:text-ink-600 px-1.5 py-0.5 rounded hover:bg-ink-100 transition-colors"
        >
          Переименовать
        </button>
        <button
          @click="$emit('delete', conv.id)"
          class="text-[10px] text-ink-400 hover:text-rose-500 px-1.5 py-0.5 rounded hover:bg-rose-50 transition-colors"
        >
          Удалить
        </button>
      </div>
    </button>

    <!-- Inline rename modal -->
    <Teleport to="body">
      <div v-if="renaming" class="fixed inset-0 z-[60] flex items-center justify-center bg-ink-900/40 backdrop-blur-sm" @click.self="renaming = null">
        <div class="bg-white rounded-2xl shadow-xl p-5 w-80 mx-4">
          <h3 class="font-display font-semibold text-ink-900 mb-3">Переименовать беседу</h3>
          <input
            ref="renameInput"
            v-model="renameTitle"
            @keydown.enter="confirmRename"
            @keydown.esc="renaming = null"
            class="w-full px-3 py-2 rounded-xl border border-ink-200 text-sm focus:outline-none focus:ring-2 focus:ring-terra-400/40 focus:border-terra-400"
            maxlength="255"
          />
          <div class="flex justify-end gap-2 mt-4">
            <button @click="renaming = null" class="px-4 py-2 text-sm text-ink-500 hover:text-ink-700 rounded-lg hover:bg-ink-100 transition-colors">
              Отмена
            </button>
            <button @click="confirmRename" class="px-4 py-2 text-sm font-medium text-white bg-terra-500 hover:bg-terra-600 rounded-lg transition-colors">
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const props = defineProps({
  conversations: { type: Array, required: true },
  activeId: { type: String, default: null },
})

const emit = defineEmits(['select', 'rename', 'delete'])

const renaming = ref(null)
const renameTitle = ref('')
const renameInput = ref(null)

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMin = Math.floor(diffMs / 60000)
  const diffHr = Math.floor(diffMs / 3600000)

  if (diffMin < 1) return 'сейчас'
  if (diffMin < 60) return `${diffMin}м`
  if (diffHr < 24) return `${diffHr}ч`

  const yesterday = new Date(now)
  yesterday.setDate(yesterday.getDate() - 1)
  if (date.toDateString() === yesterday.toDateString()) return 'вчера'

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function startRename(conv) {
  renaming.value = conv.id
  renameTitle.value = conv.title || ''
  nextTick(() => renameInput.value?.focus())
}

function confirmRename() {
  if (renameTitle.value.trim() && renaming.value) {
    emit('rename', { id: renaming.value, title: renameTitle.value.trim() })
  }
  renaming.value = null
}
</script>
