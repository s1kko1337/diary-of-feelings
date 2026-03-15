<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="font-display text-3xl font-bold text-ink-900">Эмоции</h1>
        <p class="text-ink-500 text-sm mt-1">{{ todayCount }} записей сегодня</p>
      </div>
      <button
        @click="showPicker = !showPicker"
        class="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all shadow-sm"
        :class="showPicker
          ? 'bg-ink-200 text-ink-700 shadow-none'
          : 'bg-terra-500 text-white hover:bg-terra-600 hover:shadow-md active:scale-[0.97]'"
      >
        {{ showPicker ? 'Скрыть' : '+ Записать' }}
      </button>
    </div>

    <!-- Picker (expandable) -->
    <Transition name="slide-up">
      <div v-if="showPicker" class="bg-white rounded-2xl p-5 sm:p-6 border border-ink-100 shadow-sm">
        <EmotionPicker @submit="handleAdd" />
      </div>
    </Transition>

    <!-- Tabs: Records / Capsules -->
    <div class="flex bg-cream-200 rounded-xl p-1">
      <button
        v-for="t in tabs"
        :key="t.value"
        @click="activeTab = t.value"
        class="flex-1 px-4 py-2 rounded-lg text-sm font-semibold transition-all"
        :class="activeTab === t.value ? 'bg-white text-ink-900 shadow-sm' : 'text-ink-500 hover:text-ink-700'"
      >
        {{ t.label }}
      </button>
    </div>

    <!-- Tab: Records -->
    <template v-if="activeTab === 'records'">
      <!-- Date navigation strip -->
      <div class="bg-white rounded-2xl p-3 border border-ink-100">
        <div class="flex items-center gap-2">
          <button @click="shiftDate(-7)" class="p-1.5 rounded-lg hover:bg-cream-200 text-ink-400 transition-colors shrink-0" title="-7 дней">
            <ChevronsLeft class="w-4 h-4" />
          </button>
          <button @click="shiftDate(-1)" class="p-1.5 rounded-lg hover:bg-cream-200 text-ink-400 transition-colors shrink-0">
            <ChevronLeft class="w-4 h-4" />
          </button>

          <div class="flex-1 flex gap-1 overflow-x-auto px-1 scrollbar-hide">
            <button
              v-for="d in weekDays"
              :key="d.date"
              @click="selectedDate = d.date"
              class="flex flex-col items-center px-2.5 py-1.5 rounded-xl text-center transition-all shrink-0 min-w-[44px]"
              :class="selectedDate === d.date
                ? 'bg-terra-500 text-white shadow-sm'
                : d.isToday
                  ? 'bg-terra-50 text-terra-600 hover:bg-terra-100'
                  : 'text-ink-500 hover:bg-cream-200'"
            >
              <span class="text-[10px] font-medium uppercase">{{ d.weekday }}</span>
              <span class="text-sm font-bold">{{ d.day }}</span>
              <div v-if="d.hasEntries" class="w-1.5 h-1.5 rounded-full mt-0.5" :class="selectedDate === d.date ? 'bg-white/70' : 'bg-terra-400'" />
            </button>
          </div>

          <button @click="shiftDate(1)" class="p-1.5 rounded-lg hover:bg-cream-200 text-ink-400 transition-colors shrink-0">
            <ChevronRight class="w-4 h-4" />
          </button>
          <button @click="shiftDate(7)" class="p-1.5 rounded-lg hover:bg-cream-200 text-ink-400 transition-colors shrink-0" title="+7 дней">
            <ChevronsRight class="w-4 h-4" />
          </button>
        </div>
        <p class="text-center text-xs text-ink-400 mt-2">
          {{ selectedDateFormatted }}
          <button v-if="selectedDate !== todayStr" @click="selectedDate = todayStr" class="text-terra-500 hover:text-terra-600 font-semibold ml-1">Сегодня</button>
        </p>
      </div>

      <!-- Stats row -->
      <div v-if="stats" class="grid grid-cols-3 gap-2.5">
        <div class="bg-white rounded-xl p-3 border border-ink-100 text-center">
          <p class="text-xl font-display font-bold text-ink-900">{{ stats.total || 0 }}</p>
          <p class="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wider">Всего</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-ink-100 text-center">
          <p class="text-xl font-display font-bold text-coral-500">{{ stats.averageIntensity?.toFixed(1) || '—' }}</p>
          <p class="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wider">Ср. сила</p>
        </div>
        <div class="bg-white rounded-xl p-3 border border-ink-100 text-center">
          <p class="text-xl font-display font-bold text-violet-500 truncate">{{ topEmotion }}</p>
          <p class="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wider">Частая</p>
        </div>
      </div>

      <!-- Entries -->
      <div>
        <p v-if="store.loading" class="text-sm text-ink-400 text-center py-10">Загрузка...</p>
        <TransitionGroup v-else-if="store.entries.length" name="list" tag="div" class="space-y-3 relative">
          <EmotionCard
            v-for="entry in store.entries"
            :key="entry.id"
            :entry="entry"
            @edit="handleEdit"
            @remove="handleRemove"
          />
        </TransitionGroup>
        <div v-else class="text-center py-14">
          <div class="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
            <Heart class="w-7 h-7 text-ink-300" />
          </div>
          <p class="text-ink-400 text-sm">Нет записей за этот день</p>
          <button
            @click="showPicker = true"
            class="mt-3 text-sm text-terra-500 hover:text-terra-600 font-semibold"
          >
            Записать эмоцию
          </button>
        </div>
      </div>
    </template>

    <!-- Tab: Capsules -->
    <template v-if="activeTab === 'capsules'">
      <!-- Pending capsules -->
      <div>
        <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Ожидают раскрытия</p>
        <div v-if="store.capsules.length" class="space-y-3">
          <div
            v-for="cap in store.capsules"
            :key="cap.id"
            class="bg-white rounded-2xl border border-violet-300/40 p-4 relative overflow-hidden"
          >
            <div class="absolute inset-0 bg-gradient-to-br from-violet-300/5 to-transparent pointer-events-none" />
            <div class="relative flex items-center gap-3">
              <div class="w-10 h-10 rounded-xl bg-violet-300/30 flex items-center justify-center text-violet-600">
                <Lock class="w-5 h-5" />
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm font-semibold text-ink-700">Запечатанная запись</p>
                <p class="text-xs text-ink-400 mt-0.5">
                  Откроется {{ formatCapsuleDate(cap.capsuleRevealDate) }}
                </p>
              </div>
              <span class="text-lg">&#x1F4E6;</span>
            </div>
          </div>
        </div>
        <p v-else class="text-sm text-ink-400 text-center py-6">Нет запечатанных капсул</p>
      </div>

      <!-- Revealed capsules -->
      <div>
        <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Раскрытые</p>
        <div v-if="store.revealedCapsules.length" class="space-y-3">
          <EmotionCard
            v-for="entry in store.revealedCapsules"
            :key="entry.id"
            :entry="entry"
            @edit="handleEdit"
            @remove="handleRemove"
          />
        </div>
        <p v-else class="text-sm text-ink-400 text-center py-6">Пока нет раскрытых капсул</p>
      </div>
    </template>

    <!-- Edit modal -->
    <EmotionEditModal
      v-model="showEditModal"
      :entry="editingEntry"
      @save="handleEditSave"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useEmotionsStore } from '@/stores/emotions'
import EmotionPicker from '@/components/emotions/EmotionPicker.vue'
import EmotionCard from '@/components/emotions/EmotionCard.vue'
import EmotionEditModal from '@/components/emotions/EmotionEditModal.vue'
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Heart, Lock } from 'lucide-vue-next'

const store = useEmotionsStore()
const showPicker = ref(false)
const editingEntry = ref(null)
const showEditModal = ref(false)
const activeTab = ref('records')

const tabs = [
  { value: 'records', label: 'Записи' },
  { value: 'capsules', label: 'Капсулы' },
]

const todayStr = new Date().toISOString().slice(0, 10)
const selectedDate = ref(todayStr)
const stats = computed(() => store.stats)

onMounted(() => {
  store.fetchByDate(selectedDate.value)
  store.fetchStats()
})

watch(selectedDate, (d) => store.fetchByDate(d))

watch(activeTab, (tab) => {
  if (tab === 'capsules') {
    store.fetchCapsules()
    store.fetchRevealedCapsules()
  }
})

const todayCount = computed(() => store.entries.length)
const topEmotion = computed(() => stats.value?.topEmotions?.[0]?.name || '—')

const selectedDateFormatted = computed(() =>
  new Date(selectedDate.value).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })
)

const weekDays = computed(() => {
  const center = new Date(selectedDate.value)
  const days = []
  for (let i = -3; i <= 3; i++) {
    const d = new Date(center)
    d.setDate(d.getDate() + i)
    const dateStr = d.toISOString().slice(0, 10)
    days.push({
      date: dateStr,
      day: d.getDate(),
      weekday: d.toLocaleDateString('ru-RU', { weekday: 'short' }).slice(0, 2),
      isToday: dateStr === todayStr,
      hasEntries: false,
    })
  }
  return days
})

function shiftDate(days) {
  const d = new Date(selectedDate.value)
  d.setDate(d.getDate() + days)
  selectedDate.value = d.toISOString().slice(0, 10)
}

function formatCapsuleDate(dateStr) {
  if (!dateStr) return '—'
  return new Date(dateStr).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' })
}

async function handleAdd(data) {
  await store.addEmotion(data)
  showPicker.value = false
}

function handleEdit(entry) {
  editingEntry.value = entry
  showEditModal.value = true
}

async function handleEditSave(data) {
  await store.updateEmotion(editingEntry.value.id, data)
}

async function handleRemove(id) {
  await store.removeEmotion(id)
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
