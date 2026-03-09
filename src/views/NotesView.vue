<template>
  <div class="notes-page">
    <header class="notes-header">
      <h1 class="notes-title">Заметки</h1>
    </header>

    <div class="notes-search-wrap">
      <Search :size="16" class="notes-search-icon" />
      <input
        v-model="store.search"
        class="notes-search"
        placeholder="Поиск..."
        @input="store.fetchNotes()"
      />
    </div>

    <div class="notes-list">
      <!-- Pinned section -->
      <template v-if="pinnedNotes.length">
        <div class="notes-section-label">
          <PinIcon :size="12" />
          Закреплённые
        </div>
        <div
          v-for="note in pinnedNotes"
          :key="note.id"
          class="note-card"
          :class="`note-card--${note.color}`"
          @click="openNote(note)"
        >
          <div class="note-card__header">
            <span class="note-card__title">{{ note.title || 'Без названия' }}</span>
            <button class="note-pin-btn" @click.stop="togglePin(note)">
              <PinIcon :size="13" :stroke-width="2" style="fill: currentColor" />
            </button>
          </div>
          <div class="note-card__preview">{{ plainPreview(note.content) }}</div>
          <div class="note-card__date">{{ relativeDate(note.updatedAt) }}</div>
        </div>
        <div v-if="unpinnedNotes.length" class="notes-section-label">
          <AlignLeftIcon :size="12" />
          Остальные
        </div>
      </template>

      <!-- Unpinned / all notes -->
      <div
        v-for="note in unpinnedNotes"
        :key="note.id"
        class="note-card"
        :class="`note-card--${note.color}`"
        @click="openNote(note)"
      >
        <div class="note-card__header">
          <span class="note-card__title">{{ note.title || 'Без названия' }}</span>
          <button class="note-pin-btn" @click.stop="togglePin(note)">
            <PinIcon :size="13" :stroke-width="2" />
          </button>
        </div>
        <div class="note-card__preview">{{ plainPreview(note.content) }}</div>
        <div class="note-card__date">{{ relativeDate(note.updatedAt) }}</div>
      </div>

      <div v-if="!store.notes.length && !store.loading" class="notes-empty">
        <AlignLeftIcon :size="32" class="notes-empty-icon" />
        <p>Нет заметок. Создай первую!</p>
      </div>
    </div>

    <button class="notes-fab" @click="createNew">
      <Plus :size="22" />
    </button>

    <Teleport to="body">
      <div v-if="activeNote !== null" class="note-editor-overlay" @click.self="saveAndClose">
        <div class="note-editor">
          <!-- Color selector -->
          <div class="note-editor__colors">
            <button
              v-for="c in NOTE_COLORS"
              :key="c.value"
              class="note-color-btn"
              :class="{ active: activeNote.color === c.value }"
              :style="{ background: c.bg }"
              @click="activeNote.color = c.value"
            />
          </div>

          <input
            v-model="activeNote.title"
            class="note-editor__title"
            placeholder="Заголовок"
            @input="scheduleSave"
          />
          <textarea
            v-model="activeNote.content"
            class="note-editor__body"
            placeholder="О чём думаешь?"
            @input="scheduleSave"
          />

          <div class="note-editor__actions">
            <div class="note-editor__actions-left">
              <button class="note-editor__delete" @click="deleteActive">
                <Trash2 :size="16" />
              </button>
              <span v-if="saveState === 'saving'" class="autosave-indicator">Сохранение...</span>
              <span v-else-if="saveState === 'saved'" class="autosave-indicator autosave-indicator--ok">Сохранено</span>
            </div>
            <button class="note-editor__save" @click="saveAndClose">Готово</button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { AlignLeftIcon, PinIcon, Plus, Search, Trash2 } from 'lucide-vue-next'
import { useNotesStore } from '@/stores/notes.js'

const NOTE_COLORS = [
  { value: 'default', bg: '#ffffff' },
  { value: 'yellow', bg: '#fff3b0' },
  { value: 'green', bg: '#d4f0d4' },
  { value: 'pink', bg: '#ffd0cc' },
  { value: 'blue', bg: '#dbeafe' },
  { value: 'purple', bg: '#ede9fe' },
]

const store = useNotesStore()
const activeNote = ref(null)
const saveState = ref('') // '' | 'saving' | 'saved'
let saveTimer = null

const pinnedNotes = computed(() => store.notes.filter((n) => n.pinned))
const unpinnedNotes = computed(() => store.notes.filter((n) => !n.pinned))

onMounted(() => store.fetchNotes())

function openNote(note) {
  activeNote.value = { ...note }
}

function createNew() {
  activeNote.value = { id: null, title: '', content: '', color: 'default', pinned: false }
}

function scheduleSave() {
  if (!activeNote.value?.id) return // no autosave for new notes
  clearTimeout(saveTimer)
  saveState.value = ''
  saveTimer = setTimeout(() => doAutosave(), 1500)
}

async function doAutosave() {
  if (!activeNote.value?.id) return
  saveState.value = 'saving'
  await store.updateNote(activeNote.value.id, {
    title: activeNote.value.title,
    content: activeNote.value.content,
    color: activeNote.value.color,
  })
  saveState.value = 'saved'
  setTimeout(() => (saveState.value = ''), 2000)
}

async function saveAndClose() {
  if (!activeNote.value) return
  clearTimeout(saveTimer)
  const n = activeNote.value
  if (n.id) {
    await store.updateNote(n.id, { title: n.title, content: n.content, color: n.color, pinned: n.pinned })
  } else if (n.title || n.content) {
    await store.createNote({ title: n.title, content: n.content, color: n.color })
  }
  activeNote.value = null
  saveState.value = ''
}

async function deleteActive() {
  if (activeNote.value?.id) await store.deleteNote(activeNote.value.id)
  activeNote.value = null
}

async function togglePin(note) {
  await store.updateNote(note.id, { pinned: !note.pinned })
  await store.fetchNotes()
}

function plainPreview(content) {
  if (!content) return ''
  // Strip markdown-like symbols for preview
  return content.replace(/[#*_`]/g, '').slice(0, 120)
}

function relativeDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  const now = new Date()
  const diffMs = now - d
  const diffDays = Math.floor(diffMs / 86400000)
  if (diffDays === 0) return 'Сегодня'
  if (diffDays === 1) return 'Вчера'
  if (diffDays < 7) return `${diffDays} дн. назад`
  return d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}
</script>

<style scoped>
.notes-page {
  padding: 1rem;
  padding-bottom: 6rem;
}

.notes-header {
  margin-bottom: 1rem;
}

.notes-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin: 0;
}

.notes-search-wrap {
  position: relative;
  margin-bottom: 1rem;
}

.notes-search-icon {
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-text-muted);
}

.notes-search {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.25rem;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  font-size: 0.9rem;
  background: var(--color-surface);
  color: var(--color-text);
  box-sizing: border-box;
}

.notes-search:focus {
  outline: none;
  border-color: var(--color-accent);
}

.notes-section-label {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  padding: 0.25rem 0.25rem 0;
  margin-bottom: 0.35rem;
}

.notes-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

/* Note card */
.note-card {
  border-radius: var(--radius-lg);
  padding: 0.9rem 1rem;
  cursor: pointer;
  transition: transform 0.15s, box-shadow 0.15s;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.05);
}

.note-card--default { background: white; }
.note-card--yellow { background: #fff3b0; }
.note-card--green { background: #d4f0d4; }
.note-card--pink { background: #ffd0cc; }
.note-card--blue { background: #dbeafe; }
.note-card--purple { background: #ede9fe; }

.note-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.08);
}

.note-card__header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.3rem;
}

.note-card__title {
  font-weight: 600;
  font-size: 0.95rem;
  color: var(--color-text);
  flex: 1;
}

.note-pin-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  padding: 0;
  display: flex;
  align-items: center;
  flex-shrink: 0;
  opacity: 0;
  transition: opacity 0.15s, color 0.15s;
}

.note-card:hover .note-pin-btn {
  opacity: 1;
}

.note-pin-btn:hover {
  color: var(--color-accent);
}

.note-card__preview {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin-bottom: 0.4rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.note-card__date {
  font-size: 0.72rem;
  color: var(--color-text-muted);
  opacity: 0.7;
}

.notes-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
  color: var(--color-text-muted);
  padding: 2.5rem 1rem;
}

.notes-empty-icon {
  opacity: 0.3;
}

.notes-empty p {
  margin: 0;
  font-size: 0.9rem;
}

.notes-fab {
  position: fixed;
  bottom: 80px;
  right: 1.5rem;
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: var(--color-accent);
  color: white;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgb(99 102 241 / 0.35);
  transition: transform 0.2s, box-shadow 0.2s;
}

.notes-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgb(99 102 241 / 0.45);
}

/* Editor */
.note-editor-overlay {
  position: fixed;
  inset: 0;
  background: rgb(0 0 0 / 0.4);
  display: flex;
  align-items: flex-end;
  z-index: 100;
}

.note-editor {
  background: white;
  border-radius: var(--radius-xl) var(--radius-xl) 0 0;
  padding: 1rem 1.5rem 1.5rem;
  width: 100%;
  min-height: 60vh;
  display: flex;
  flex-direction: column;
}

/* Color picker row */
.note-editor__colors {
  display: flex;
  gap: 0.4rem;
  margin-bottom: 1rem;
}

.note-color-btn {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.15s, border-color 0.15s;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.15);
}

.note-color-btn.active {
  border-color: var(--color-accent);
  transform: scale(1.2);
}

.note-editor__title {
  font-size: 1.3rem;
  font-weight: 700;
  border: none;
  outline: none;
  color: var(--color-text);
  margin-bottom: 0.75rem;
  width: 100%;
  background: transparent;
}

.note-editor__body {
  flex: 1;
  border: none;
  outline: none;
  font-size: 0.95rem;
  color: var(--color-text);
  line-height: 1.7;
  resize: none;
  font-family: inherit;
  background: transparent;
}

.note-editor__actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
}

.note-editor__actions-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.note-editor__delete {
  background: none;
  border: none;
  color: #ef4444;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.note-editor__save {
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-full);
  padding: 0.5rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.autosave-indicator {
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.autosave-indicator--ok {
  color: var(--color-success);
}
</style>
