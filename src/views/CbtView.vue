<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-end justify-between">
      <div>
        <h1 class="font-display text-3xl font-bold text-ink-900">КПТ дневник</h1>
        <p class="text-ink-500 text-sm mt-1">Когнитивно-поведенческая терапия</p>
      </div>
      <button
        @click="formOpen = true"
        class="px-4 py-2.5 rounded-xl bg-terra-500 text-white text-sm font-semibold hover:bg-terra-600 transition-all shadow-sm hover:shadow-md active:scale-[0.97]"
      >
        + Записать
      </button>
    </div>

    <!-- Stats overview -->
    <div v-if="store.entries.length" class="grid grid-cols-3 gap-2.5">
      <div class="bg-white rounded-xl p-3 border border-ink-100 text-center">
        <p class="text-xl font-display font-bold text-ink-900">{{ store.entries.length }}</p>
        <p class="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wider">Всего</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-ink-100 text-center">
        <p class="text-xl font-display font-bold text-gold-500">{{ inProgressCount }}</p>
        <p class="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wider">В работе</p>
      </div>
      <div class="bg-white rounded-xl p-3 border border-ink-100 text-center">
        <p class="text-xl font-display font-bold text-forest-500">{{ processedCount }}</p>
        <p class="text-[10px] text-ink-400 mt-0.5 uppercase tracking-wider">Обработано</p>
      </div>
    </div>

    <!-- Status filter -->
    <div class="flex gap-1.5 overflow-x-auto scrollbar-hide">
      <button
        v-for="f in filters"
        :key="f.value"
        @click="statusFilter = f.value"
        class="px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors shrink-0 flex items-center gap-1.5"
        :class="statusFilter === f.value ? f.active : 'bg-cream-200 text-ink-500 hover:bg-cream-300'"
      >
        <span class="w-2 h-2 rounded-full" :class="f.dot" />
        {{ f.label }}
      </button>
    </div>

    <!-- Entries -->
    <div v-if="store.loading" class="text-sm text-ink-400 text-center py-10">Загрузка...</div>
    <div v-else-if="filtered.length" class="grid sm:grid-cols-2 gap-3">
      <CbtCard
        v-for="entry in filtered"
        :key="entry.id"
        :entry="entry"
        @select="selectEntry"
        @remove="handleRemove"
      />
    </div>
    <div v-else class="text-center py-14">
      <Brain class="w-8 h-8 text-ink-300 mx-auto mb-3" />
      <p class="text-ink-400 text-sm">{{ statusFilter === 'all' ? 'Нет записей' : 'Нет записей с таким статусом' }}</p>
      <button v-if="statusFilter === 'all'" @click="formOpen = true" class="mt-3 text-sm text-terra-500 hover:text-terra-600 font-semibold">
        Создать первую запись
      </button>
    </div>

    <!-- Detail modal -->
    <BaseModal v-model="detailOpen" :title="'Запись КПТ'" size="lg">
      <div v-if="detailEntry" class="space-y-5">
        <!-- Status bar -->
        <div class="flex gap-2">
          <button
            v-for="s in statusOptions"
            :key="s.value"
            @click="changeStatus(detailEntry.id, s.value)"
            class="flex-1 py-2 rounded-xl text-xs font-semibold transition-all text-center"
            :class="isStatus(detailEntry.status, s.value) ? s.active : 'bg-cream-200 text-ink-500 hover:bg-cream-300'"
          >
            {{ s.label }}
          </button>
        </div>

        <!-- Fields -->
        <div class="space-y-4">
          <div>
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Ситуация</p>
            <p class="text-sm text-ink-800 leading-relaxed bg-cream-50 rounded-xl px-4 py-3">{{ detailEntry.situation }}</p>
          </div>
          <div v-if="detailEntry.thoughts">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Автоматические мысли</p>
            <p class="text-sm text-ink-800 leading-relaxed bg-cream-50 rounded-xl px-4 py-3">{{ detailEntry.thoughts }}</p>
          </div>
          <div v-if="detailEntry.emotions?.length">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Эмоции</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="(em, i) in detailEntry.emotions" :key="i" class="text-xs px-3 py-1.5 rounded-xl bg-coral-300/20 text-coral-600 font-medium">
                {{ em.name }} <span class="opacity-60">({{ em.intensity }})</span>
              </span>
            </div>
          </div>
          <div v-if="detailEntry.distortions?.length">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Когнитивные искажения</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="d in detailEntry.distortions" :key="d" class="text-xs px-3 py-1.5 rounded-xl bg-violet-300/20 text-violet-600 font-medium">{{ d }}</span>
            </div>
          </div>
          <div v-if="detailEntry.challenging">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Оспаривание</p>
            <p class="text-sm text-ink-800 leading-relaxed bg-cream-50 rounded-xl px-4 py-3">{{ detailEntry.challenging }}</p>
          </div>
          <div v-if="detailEntry.alternativeThought">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Альтернативная мысль</p>
            <p class="text-sm text-forest-700 leading-relaxed bg-forest-200/20 rounded-xl px-4 py-3 border border-forest-200/40">
              {{ detailEntry.alternativeThought }}
            </p>
          </div>
          <div v-if="detailEntry.emotionsAfter?.length">
            <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider mb-1.5">Эмоции после</p>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="(em, i) in detailEntry.emotionsAfter" :key="i" class="text-xs px-3 py-1.5 rounded-xl bg-forest-200/40 text-forest-700 font-medium">
                {{ em.name }} <span class="opacity-60">({{ em.intensity }})</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </BaseModal>

    <CbtForm
      :open="formOpen"
      :initial="editEntry"
      @save="handleSave"
      @close="formOpen = false; editEntry = null"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useCbtStore } from '@/stores/cbt'
import CbtCard from '@/components/cbt/CbtCard.vue'
import CbtForm from '@/components/cbt/CbtForm.vue'
import BaseModal from '@/components/ui/BaseModal.vue'
import { Brain } from 'lucide-vue-next'

const store = useCbtStore()
const formOpen = ref(false)
const editEntry = ref(null)
const detailOpen = ref(false)
const detailEntry = ref(null)
const statusFilter = ref('all')

const filters = [
  { value: 'all', label: 'Все', active: 'bg-ink-800 text-white', dot: 'bg-ink-400' },
  { value: 'new', label: 'Новые', active: 'bg-sky-500 text-white', dot: 'bg-sky-400' },
  { value: 'in_progress', label: 'В работе', active: 'bg-gold-500 text-white', dot: 'bg-gold-400' },
  { value: 'processed', label: 'Обработанные', active: 'bg-forest-500 text-white', dot: 'bg-forest-400' },
]

const statusOptions = [
  { value: 'new', label: 'Новая', active: 'bg-sky-500 text-white' },
  { value: 'in_progress', label: 'В работе', active: 'bg-gold-500 text-white' },
  { value: 'processed', label: 'Обработана', active: 'bg-forest-500 text-white' },
]

onMounted(() => store.fetchAll())

const inProgressCount = computed(() =>
  store.entries.filter(e => e.status === 'in_progress' || e.status === 'inProgress').length
)
const processedCount = computed(() =>
  store.entries.filter(e => e.status === 'processed').length
)

const filtered = computed(() => {
  if (statusFilter.value === 'all') return store.entries
  return store.entries.filter(e => isStatus(e.status, statusFilter.value))
})

function isStatus(entryStatus, filterValue) {
  if (entryStatus === filterValue) return true
  if (filterValue === 'in_progress' && entryStatus === 'inProgress') return true
  if (filterValue === 'inProgress' && entryStatus === 'in_progress') return true
  return false
}

function selectEntry(entry) { detailEntry.value = entry; detailOpen.value = true }

async function handleSave(data) {
  if (data.id) {
    const { id, ...rest } = data
    await store.updateEntry(id, rest)
  } else {
    await store.addEntry(data)
  }
  formOpen.value = false
  editEntry.value = null
}

async function handleRemove(id) { await store.removeEntry(id) }

async function changeStatus(id, status) {
  await store.changeStatus(id, status)
  detailEntry.value = store.entries.find(e => e.id === id) || detailEntry.value
}
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
