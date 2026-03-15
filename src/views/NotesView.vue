<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="font-display text-3xl font-bold text-ink-900">Заметки</h1>
        <p class="text-ink-500 text-sm mt-1">{{ store.notes.length }} {{ notesWord }}</p>
      </div>
      <button
        @click="openEditor({})"
        class="px-4 py-2.5 rounded-xl bg-terra-500 text-white text-sm font-semibold hover:bg-terra-600 transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
      >
        + Новая
      </button>
    </div>

    <!-- Search & filters -->
    <div class="flex gap-2">
      <div class="relative flex-1">
        <Search class="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-ink-400" />
        <input
          v-model="search"
          type="text"
          placeholder="Поиск..."
          class="w-full rounded-xl border border-ink-200 bg-white pl-10 pr-4 py-2.5 text-sm text-ink-900 placeholder:text-ink-400 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
        />
      </div>
      <button
        @click="viewMode = viewMode === 'grid' ? 'list' : 'grid'"
        class="p-2.5 rounded-xl bg-cream-200 text-ink-500 hover:bg-cream-300 transition-colors"
        :title="viewMode === 'grid' ? 'Список' : 'Сетка'"
      >
        <LayoutGrid v-if="viewMode === 'list'" class="w-4 h-4" />
        <List v-else class="w-4 h-4" />
      </button>
    </div>

    <!-- Notes -->
    <div v-if="store.loading" class="text-sm text-ink-400 text-center py-10">Загрузка...</div>
    <div
      v-else-if="sortedNotes.length"
      :class="viewMode === 'grid' ? 'grid sm:grid-cols-2 lg:grid-cols-3 gap-3' : 'space-y-3'"
    >
      <NoteCard
        v-for="note in sortedNotes"
        :key="note.id"
        :note="note"
        :compact="viewMode === 'list'"
        @edit="openEditor"
        @remove="handleRemove"
      />
    </div>
    <div v-else class="text-center py-14">
      <BookOpen class="w-8 h-8 text-ink-300 mx-auto mb-3" />
      <p class="text-ink-400 text-sm">{{ search ? 'Ничего не найдено' : 'Нет заметок' }}</p>
      <button
        v-if="!search"
        @click="openEditor({})"
        class="mt-3 text-sm text-terra-500 hover:text-terra-600 font-semibold"
      >
        Создать первую заметку
      </button>
    </div>

    <!-- Editor modal -->
    <NoteEditor
      :note="editingNote"
      @save="handleSave"
      @close="editingNote = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useNotesStore } from '@/stores/notes'
import NoteCard from '@/components/notes/NoteCard.vue'
import NoteEditor from '@/components/notes/NoteEditor.vue'
import { Search, LayoutGrid, List, BookOpen } from 'lucide-vue-next'

const store = useNotesStore()
const search = ref('')
const editingNote = ref(null)
const viewMode = ref('grid')

onMounted(() => store.fetchNotes())

watch(search, (val) => {
  store.fetchNotes(val ? { search: val } : undefined)
})

const sortedNotes = computed(() =>
  [...store.notes].sort((a, b) => {
    if (a.pinned !== b.pinned) return b.pinned - a.pinned
    return new Date(b.createdAt) - new Date(a.createdAt)
  })
)

const notesWord = computed(() => {
  const n = store.notes.length
  if (n === 0) return 'заметок'
  if (n === 1) return 'заметка'
  if (n >= 2 && n <= 4) return 'заметки'
  return 'заметок'
})

function openEditor(note) { editingNote.value = note }

async function handleSave(data) {
  if (data.id) {
    const { id, ...rest } = data
    await store.updateNote(id, rest)
  } else {
    await store.addNote(data)
  }
  editingNote.value = null
}

async function handleRemove(id) { await store.removeNote(id) }
</script>
