<template>
  <div class="tasks-page">
    <header class="tasks-header">
      <h1 class="tasks-title">{{ activeTabLabel }}</h1>
      <button class="tasks-profile" @click="goProfile">
        <User :size="20" />
      </button>
    </header>

    <nav class="section-tabs">
      <button
        v-for="tab in tabs"
        :key="tab.key"
        class="section-tab"
        :class="{ 'section-tab--active': activeTab === tab.key }"
        @click="setTab(tab.key)"
      >{{ tab.label }}</button>
    </nav>

    <div
      class="tab-viewport"
      ref="viewportEl"
      @touchstart="onTouchStart"
      @touchend="onTouchEnd"
    >
      <Transition :name="slideDirection">
        <div :key="activeTab" class="tab-panel">

          <!-- ── Tasks tab ──────────────────────────────── -->
          <template v-if="activeTab === 'tasks'">
            <CalendarGrid
              @date-click="onDateClick"
              @task-dropped="onCalendarDrop"
            />
            <StickyNotePool
              @create="openCreateEditor(null)"
              @edit="openEditEditor"
              @task-dropped="onCalendarDrop"
            />
          </template>

          <!-- ── Notes tab ──────────────────────────────── -->
          <template v-else-if="activeTab === 'notes'">
            <div class="notes-search-wrap">
              <Search :size="16" class="notes-search-icon" />
              <input
                v-model="notesStore.search"
                class="notes-search"
                placeholder="Поиск..."
                @input="notesStore.fetchNotes()"
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
                    <span class="note-card__title">
                      {{ note.title || 'Без названия' }}
                    </span>
                    <button
                      class="note-pin-btn"
                      @click.stop="togglePin(note)"
                    >
                      <PinIcon
                        :size="13"
                        :stroke-width="2"
                        style="fill: currentColor"
                      />
                    </button>
                  </div>
                  <div class="note-card__preview">
                    {{ plainPreview(note.content) }}
                  </div>
                  <div class="note-card__date">
                    {{ relativeDate(note.updatedAt) }}
                  </div>
                </div>
                <div
                  v-if="unpinnedNotes.length"
                  class="notes-section-label"
                >
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
                  <span class="note-card__title">
                    {{ note.title || 'Без названия' }}
                  </span>
                  <button
                    class="note-pin-btn"
                    @click.stop="togglePin(note)"
                  >
                    <PinIcon :size="13" :stroke-width="2" />
                  </button>
                </div>
                <div class="note-card__preview">
                  {{ plainPreview(note.content) }}
                </div>
                <div class="note-card__date">
                  {{ relativeDate(note.updatedAt) }}
                </div>
              </div>

              <div
                v-if="!notesStore.notes.length && !notesStore.loading"
                class="notes-empty"
              >
                <AlignLeftIcon :size="32" class="notes-empty-icon" />
                <p>Нет заметок. Создай первую!</p>
              </div>
            </div>
          </template>

          <!-- ── Library tab ────────────────────────────── -->
          <template v-else>
            <div class="library-empty">
              <BookOpen :size="48" class="library-icon" />
              <p>Библиотека документов появится в следующей версии</p>
            </div>
          </template>

        </div>
      </Transition>
    </div>

    <!-- FAB: tasks or notes -->
    <button
      v-if="activeTab === 'tasks'"
      class="tasks-fab"
      @click="openCreateEditor(null)"
    >
      <Plus :size="22" />
    </button>
    <button
      v-else-if="activeTab === 'notes'"
      class="tasks-fab"
      @click="createNewNote"
    >
      <Plus :size="22" />
    </button>

    <!-- Date tasks panel (bottom sheet) -->
    <DateTasksPanel
      :show="showDatePanel"
      :date="selectedDate"
      @close="closeDatePanel"
      @create="onPanelCreate"
      @edit="onPanelEdit"
    />

    <!-- Task editor -->
    <StickyNoteEditor
      :model-value="editingTask"
      :show="showEditor"
      @save="handleSave"
      @close="closeEditor"
    />

    <!-- Note editor (teleported) -->
    <Teleport to="body">
      <div
        v-if="activeNote !== null"
        class="note-editor-overlay"
        @click.self="saveAndClose"
      >
        <div class="note-editor">
          <div class="note-editor__colors">
            <button
              v-for="c in NOTE_COLORS"
              :key="c.value"
              class="note-color-btn"
              :class="{ active: activeNote.color === c.value }"
              :style="{ background: c.bg }"
              @click="setNoteColor(c.value)"
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
              <button
                class="note-editor__delete"
                @click="deleteActiveNote"
              >
                <Trash2 :size="16" />
              </button>
              <span
                v-if="saveState === 'saving'"
                class="autosave-indicator"
              >Сохранение...</span>
              <span
                v-else-if="saveState === 'saved'"
                class="autosave-indicator autosave-indicator--ok"
              >Сохранено</span>
            </div>
            <button class="note-editor__save" @click="saveAndClose">
              Готово
            </button>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  AlignLeftIcon,
  BookOpen,
  PinIcon,
  Plus,
  Search,
  Trash2,
  User,
} from 'lucide-vue-next'
import { useTasksStore } from '@/stores/tasks.js'
import { useNotesStore } from '@/stores/notes.js'
import CalendarGrid from '@/components/tasks/CalendarGrid.vue'
import StickyNotePool from '@/components/tasks/StickyNotePool.vue'
import StickyNoteEditor from '@/components/tasks/StickyNoteEditor.vue'
import DateTasksPanel from '@/components/tasks/DateTasksPanel.vue'

const route = useRoute()
const router = useRouter()
const store = useTasksStore()
const notesStore = useNotesStore()

// ── Tab navigation ──────────────────────────────────────
const TAB_ORDER = ['tasks', 'notes', 'library']

const tabs = [
  { key: 'tasks', label: 'Задачи' },
  { key: 'notes', label: 'Заметки' },
  { key: 'library', label: 'Библиотека' },
]

const activeTab = computed(
  () => route.query.tab || 'tasks'
)

const activeTabLabel = computed(
  () => tabs.find(t => t.key === activeTab.value)?.label ?? 'Задачи'
)

const slideDirection = ref('slide-left')

function setTab(tab) {
  const from = TAB_ORDER.indexOf(activeTab.value)
  const to = TAB_ORDER.indexOf(tab)
  slideDirection.value = to > from ? 'slide-left' : 'slide-right'
  router.replace({
    name: 'tasks',
    query: tab !== 'tasks' ? { tab } : {},
  })
}

// ── Swipe gesture ───────────────────────────────────────
let touchStartX = 0

function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
}

function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 50) return
  const idx = TAB_ORDER.indexOf(activeTab.value)
  if (dx < 0 && idx < TAB_ORDER.length - 1) {
    setTab(TAB_ORDER[idx + 1])
  }
  if (dx > 0 && idx > 0) {
    setTab(TAB_ORDER[idx - 1])
  }
}

function goProfile() {
  router.push('/profile')
}

// ── Tasks: Date panel ───────────────────────────────────
const showDatePanel = ref(false)
const selectedDate = ref(null)

function onDateClick(dateStr) {
  selectedDate.value = dateStr
  showDatePanel.value = true
}

function closeDatePanel() {
  showDatePanel.value = false
}

function onPanelCreate(date) {
  showDatePanel.value = false
  openCreateEditor(date)
}

function onPanelEdit(task) {
  showDatePanel.value = false
  openEditEditor(task)
}

// ── Tasks: Editor ───────────────────────────────────────
const showEditor = ref(false)
const editingTask = ref(null)
const pendingDate = ref(null)

function openCreateEditor(date) {
  editingTask.value = null
  pendingDate.value = date
  showEditor.value = true
}

function openEditEditor(task) {
  editingTask.value = task
  showEditor.value = true
}

function closeEditor() {
  showEditor.value = false
  editingTask.value = null
  pendingDate.value = null
}

async function handleSave(formData) {
  if (formData.id) {
    await store.updateTask(formData.id, formData)
  } else {
    await store.createTask({ ...formData, date: pendingDate.value })
  }
}

// ── Tasks: Drag & Drop ─────────────────────────────────
async function onCalendarDrop({ taskId, date }) {
  await store.moveToDate(taskId, date)
}

// ── Notes logic ─────────────────────────────────────────
const NOTE_COLORS = [
  { value: 'default', bg: '#ffffff' },
  { value: 'yellow', bg: '#fff3b0' },
  { value: 'green', bg: '#d4f0d4' },
  { value: 'pink', bg: '#ffd0cc' },
  { value: 'blue', bg: '#dbeafe' },
  { value: 'purple', bg: '#ede9fe' },
]

const activeNote = ref(null)
const saveState = ref('')
let saveTimer = null

const pinnedNotes = computed(
  () => notesStore.notes.filter(n => n.pinned)
)
const unpinnedNotes = computed(
  () => notesStore.notes.filter(n => !n.pinned)
)

function openNote(note) {
  activeNote.value = { ...note }
}

function createNewNote() {
  activeNote.value = {
    id: null,
    title: '',
    content: '',
    color: 'default',
    pinned: false,
  }
}

function setNoteColor(color) {
  activeNote.value.color = color
}

function scheduleSave() {
  if (!activeNote.value?.id) return
  clearTimeout(saveTimer)
  saveState.value = ''
  saveTimer = setTimeout(() => doAutosave(), 1500)
}

async function doAutosave() {
  if (!activeNote.value?.id) return
  saveState.value = 'saving'
  await notesStore.updateNote(activeNote.value.id, {
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
    await notesStore.updateNote(n.id, {
      title: n.title,
      content: n.content,
      color: n.color,
      pinned: n.pinned,
    })
  } else if (n.title || n.content) {
    await notesStore.createNote({
      title: n.title,
      content: n.content,
      color: n.color,
    })
  }
  activeNote.value = null
  saveState.value = ''
}

async function deleteActiveNote() {
  if (activeNote.value?.id) {
    await notesStore.deleteNote(activeNote.value.id)
  }
  activeNote.value = null
}

async function togglePin(note) {
  await notesStore.updateNote(note.id, { pinned: !note.pinned })
  await notesStore.fetchNotes()
}

function plainPreview(content) {
  if (!content) return ''
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
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

// ── Init ────────────────────────────────────────────────
onMounted(() => {
  store.fetchTasks()
  notesStore.fetchNotes()
})
</script>

<style scoped>
.tasks-page {
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0;
  padding-bottom: 5rem;
}

.tasks-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.tasks-title {
  font-size: 2rem;
  font-weight: 800;
  color: var(--color-text);
  letter-spacing: -0.03em;
  margin: 0;
}

.tasks-profile {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
}

/* ── Section tabs ──────────────────────────────────── */
.section-tabs {
  display: flex;
  gap: 0;
  border-bottom: 1px solid var(--color-border);
  margin: 0 -1rem;
  padding: 0 1rem;
}

.section-tab {
  flex: 1;
  padding: 0.6rem 0;
  font-size: 0.85rem;
  font-weight: 500;
  text-align: center;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--color-text-muted);
  position: relative;
  transition: color 0.2s;
  font-family: inherit;
}

.section-tab:hover {
  color: var(--color-text);
}

.section-tab--active {
  color: var(--color-accent);
  font-weight: 600;
}

.section-tab--active::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background: var(--color-accent);
  border-radius: 2px 2px 0 0;
}

/* ── Tab viewport & slide transitions ──────────────── */
.tab-viewport {
  position: relative;
  overflow: hidden;
  margin-top: 1rem;
}

.tab-panel {
  width: 100%;
}

.slide-left-enter-active,
.slide-left-leave-active,
.slide-right-enter-active,
.slide-right-leave-active {
  transition: transform 0.28s cubic-bezier(0.4, 0, 0.2, 1);
  position: absolute;
  width: 100%;
}

.slide-left-enter-from {
  transform: translateX(100%);
}

.slide-left-leave-to {
  transform: translateX(-100%);
}

.slide-right-enter-from {
  transform: translateX(-100%);
}

.slide-right-leave-to {
  transform: translateX(100%);
}

/* ── FAB ───────────────────────────────────────────── */
.tasks-fab {
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
  z-index: 20;
}

.tasks-fab:hover {
  transform: scale(1.08);
  box-shadow: 0 6px 24px rgb(99 102 241 / 0.45);
}

/* ── Notes styles (inlined from NotesView) ─────────── */
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

/* ── Note editor ───────────────────────────────────── */
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

/* ── Library styles ────────────────────────────────── */
.library-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
  text-align: center;
}

.library-icon {
  opacity: 0.3;
}
</style>
