<template>
  <Teleport to="body">
    <Transition name="modal">
      <div
        v-if="open"
        class="fixed inset-0 z-[200] flex items-start justify-center pt-[10vh] sm:pt-[15vh] px-4"
        @click.self="close"
      >
        <div class="fixed inset-0 bg-ink-900/40 backdrop-blur-sm" @click="close" />
        <div
          class="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden"
          @click.stop
        >
          <!-- Search input -->
          <div class="flex items-center gap-3 px-5 py-4 border-b border-ink-100">
            <SearchIcon class="w-5 h-5 text-ink-400 shrink-0" />
            <input
              ref="inputEl"
              v-model="query"
              type="text"
              placeholder="Поиск по записям..."
              class="flex-1 text-ink-900 placeholder:text-ink-400 outline-none text-base bg-transparent"
              @keydown.escape="close"
            />
            <kbd class="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-medium text-ink-400 bg-cream-200 border border-ink-200">
              ESC
            </kbd>
          </div>

          <!-- Results -->
          <div class="max-h-[50vh] overflow-y-auto">
            <!-- Loading -->
            <div v-if="loading" class="px-5 py-8 text-center text-sm text-ink-400">
              Поиск...
            </div>

            <!-- No results -->
            <div v-else-if="query.length >= 2 && !loading && !results.length" class="px-5 py-8 text-center">
              <p class="text-sm text-ink-400">Ничего не найдено по запросу «{{ query }}»</p>
            </div>

            <!-- Results grouped by type -->
            <template v-else>
              <div v-for="group in groupedResults" :key="group.type" class="border-b border-ink-100 last:border-b-0">
                <p class="px-5 pt-3 pb-1 text-[10px] font-semibold text-ink-400 uppercase tracking-wider">
                  {{ group.label }}
                </p>
                <button
                  v-for="item in group.items"
                  :key="item.id"
                  @click="navigateTo(item)"
                  class="w-full flex items-center gap-3 px-5 py-2.5 text-left hover:bg-cream-100 transition-colors"
                >
                  <component :is="group.icon" class="w-4 h-4 text-ink-400 shrink-0" />
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-ink-800 truncate">{{ item.title || item.emotionName || item.situation || 'Без названия' }}</p>
                    <p v-if="item.preview" class="text-xs text-ink-400 truncate mt-0.5">{{ item.preview }}</p>
                  </div>
                  <span class="text-[10px] text-ink-400 shrink-0">
                    {{ formatDate(item.createdAt) }}
                  </span>
                </button>
              </div>
            </template>

            <!-- Hint -->
            <div v-if="!query" class="px-5 py-6 text-center text-sm text-ink-400">
              Начните вводить для поиска
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { search as apiSearch } from '@/api/search'
import { Search as SearchIcon, Heart, CheckSquare, BookOpen, Brain } from 'lucide-vue-next'

const props = defineProps({ modelValue: Boolean })
const emit = defineEmits(['update:modelValue'])

const open = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
})

const router = useRouter()
const inputEl = ref(null)
const query = ref('')
const results = ref([])
const loading = ref(false)
let debounceTimer = null

watch(open, (val) => {
  if (val) {
    query.value = ''
    results.value = []
    nextTick(() => inputEl.value?.focus())
  }
})

watch(query, (q) => {
  clearTimeout(debounceTimer)
  if (q.length < 2) { results.value = []; return }
  loading.value = true
  debounceTimer = setTimeout(async () => {
    try {
      results.value = await apiSearch(q)
    } catch {
      results.value = []
    } finally {
      loading.value = false
    }
  }, 300)
})

const typeConfig = {
  emotion: { label: 'Эмоции', icon: Heart, route: '/emotions' },
  note: { label: 'Заметки', icon: BookOpen, route: '/notes' },
  task: { label: 'Задачи', icon: CheckSquare, route: '/tasks' },
  cbt: { label: 'КПТ записи', icon: Brain, route: '/cbt' },
}

const groupedResults = computed(() => {
  const groups = {}
  for (const item of results.value) {
    const type = item.type || 'other'
    if (!groups[type]) groups[type] = []
    groups[type].push(item)
  }
  return Object.entries(groups).map(([type, items]) => ({
    type,
    label: typeConfig[type]?.label || type,
    icon: typeConfig[type]?.icon || SearchIcon,
    items,
  }))
})

function formatDate(dateStr) {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' })
}

function navigateTo(item) {
  const cfg = typeConfig[item.type]
  if (cfg) router.push(cfg.route)
  close()
}

function close() {
  open.value = false
}

// Global keyboard shortcut
function onKeydown(e) {
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    open.value = !open.value
  }
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>
