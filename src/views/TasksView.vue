<template>
  <div class="space-y-6">
    <!-- Header -->
    <div>
      <h1 class="font-display text-3xl font-bold text-ink-900">Задачи</h1>
      <p class="text-ink-500 text-sm mt-1 capitalize">{{ formattedMonth }}</p>
    </div>

    <!-- Month navigation -->
    <div class="flex items-center gap-2 bg-white rounded-2xl p-2 border border-ink-100">
      <button @click="shiftMonth(-1)" class="p-2 rounded-xl hover:bg-cream-200 text-ink-400 transition-colors">
        <ChevronLeft class="w-4 h-4" />
      </button>
      <div class="flex-1 text-center">
        <span class="text-sm font-semibold text-ink-700 capitalize">{{ formattedMonth }}</span>
      </div>
      <button @click="shiftMonth(1)" class="p-2 rounded-xl hover:bg-cream-200 text-ink-400 transition-colors">
        <ChevronRight class="w-4 h-4" />
      </button>
      <button
        v-if="!isCurrentMonth"
        @click="goToCurrentMonth"
        class="text-xs text-terra-500 hover:text-terra-600 font-semibold px-2"
      >
        Сейчас
      </button>
    </div>

    <!-- Add task -->
    <div class="bg-white rounded-2xl p-4 border border-ink-100 shadow-sm">
      <TaskInput @add="handleAdd" />
      <!-- Color + Priority selector -->
      <div class="flex items-center gap-3 mt-3 pt-3 border-t border-ink-100">
        <span class="text-xs text-ink-400">Цвет:</span>
        <div class="flex gap-1.5">
          <button
            v-for="c in colors"
            :key="c.value"
            @click="newTaskColor = c.value"
            class="w-5 h-5 rounded-full border-2 transition-transform"
            :class="[c.bg, newTaskColor === c.value ? 'border-ink-500 scale-110' : 'border-transparent hover:scale-105']"
            :title="c.label"
          />
        </div>
        <span class="text-xs text-ink-400 ml-auto">Приоритет:</span>
        <div class="flex gap-1">
          <button
            v-for="p in priorities"
            :key="p.value"
            @click="newTaskPriority = p.value"
            class="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors"
            :class="newTaskPriority === p.value ? p.active : 'bg-cream-200 text-ink-500 hover:bg-cream-300'"
          >
            {{ p.label }}
          </button>
        </div>
      </div>
    </div>

    <!-- Progress bar -->
    <div v-if="allTasks.length" class="bg-white rounded-2xl p-4 border border-ink-100">
      <div class="flex items-center justify-between mb-2">
        <span class="text-xs font-semibold text-ink-500 uppercase tracking-wider">Прогресс</span>
        <span class="text-sm font-display font-bold text-ink-900">
          {{ completedCount }}/{{ allTasks.length }}
          <span class="text-ink-400 font-normal">({{ completionPercent }}%)</span>
        </span>
      </div>
      <div class="h-2 bg-cream-200 rounded-full overflow-hidden">
        <div
          class="h-full bg-gradient-to-r from-forest-400 to-forest-500 rounded-full transition-all duration-500"
          :style="{ width: `${completionPercent}%` }"
        />
      </div>
    </div>

    <!-- Color filter tabs -->
    <div class="flex gap-1.5 overflow-x-auto scrollbar-hide">
      <button
        @click="colorFilter = null"
        class="px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        :class="!colorFilter ? 'bg-ink-800 text-white' : 'bg-cream-200 text-ink-500 hover:bg-cream-300'"
      >
        Все ({{ allTasks.length }})
      </button>
      <button
        v-for="c in colors"
        :key="c.value"
        @click="colorFilter = colorFilter === c.value ? null : c.value"
        class="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-colors shrink-0"
        :class="colorFilter === c.value ? 'bg-ink-800 text-white' : 'bg-cream-200 text-ink-500 hover:bg-cream-300'"
      >
        <span class="w-2.5 h-2.5 rounded-full" :class="c.bg" />
        {{ colorCount(c.value) }}
      </button>
    </div>

    <!-- Task groups: incomplete first, then completed -->
    <div v-if="store.loading" class="text-sm text-ink-400 text-center py-10">Загрузка...</div>
    <template v-else-if="filteredTasks.length">
      <!-- Active tasks -->
      <div v-if="activeTasks.length" class="space-y-2">
        <TransitionGroup name="list" tag="div" class="space-y-2 relative">
          <TaskCard
            v-for="task in activeTasks"
            :key="task.id"
            :task="task"
            @update="handleUpdate"
            @remove="handleRemove"
          />
        </TransitionGroup>
      </div>

      <!-- Completed tasks (collapsible) -->
      <div v-if="completedTasks.length">
        <button
          @click="showCompleted = !showCompleted"
          class="flex items-center gap-2 text-xs font-semibold text-ink-400 hover:text-ink-600 transition-colors mb-2"
        >
          <ChevronRight class="w-3.5 h-3.5 transition-transform" :class="showCompleted ? 'rotate-90' : ''" />
          Выполненные ({{ completedTasks.length }})
        </button>
        <Transition name="fade">
          <div v-if="showCompleted" class="space-y-2">
            <TaskCard
              v-for="task in completedTasks"
              :key="task.id"
              :task="task"
              @update="handleUpdate"
              @remove="handleRemove"
            />
          </div>
        </Transition>
      </div>
    </template>
    <div v-else class="text-center py-14">
      <CheckSquare class="w-8 h-8 text-ink-300 mx-auto mb-3" />
      <p class="text-ink-400 text-sm">Нет задач за этот месяц</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { useTasksStore } from '@/stores/tasks'
import TaskCard from '@/components/tasks/TaskCard.vue'
import TaskInput from '@/components/tasks/TaskInput.vue'
import { ChevronLeft, ChevronRight, CheckSquare } from 'lucide-vue-next'

const store = useTasksStore()
const now = new Date()
const currentMonth = ref(now.getMonth() + 1)
const currentYear = ref(now.getFullYear())
const colorFilter = ref(null)
const showCompleted = ref(false)
const newTaskColor = ref('yellow')
const newTaskPriority = ref('none')

const colors = [
  { value: 'yellow', label: 'Жёлтый', bg: 'bg-gold-400' },
  { value: 'green', label: 'Зелёный', bg: 'bg-forest-400' },
  { value: 'pink', label: 'Розовый', bg: 'bg-coral-400' },
  { value: 'blue', label: 'Синий', bg: 'bg-sky-500' },
  { value: 'purple', label: 'Фиолетовый', bg: 'bg-violet-500' },
]

const priorities = [
  { value: 'none', label: 'Нет', active: 'bg-ink-200 text-ink-700' },
  { value: 'normal', label: 'Обычный', active: 'bg-gold-500 text-white' },
  { value: 'high', label: 'Высокий', active: 'bg-coral-500 text-white' },
]

const isCurrentMonth = computed(() =>
  currentMonth.value === now.getMonth() + 1 && currentYear.value === now.getFullYear()
)

onMounted(() => fetchTasks())
watch([currentMonth, currentYear], () => fetchTasks())

function fetchTasks() {
  store.fetchTasks({ month: currentMonth.value, year: currentYear.value })
}

const formattedMonth = computed(() => {
  const d = new Date(currentYear.value, currentMonth.value - 1)
  return d.toLocaleDateString('ru-RU', { month: 'long', year: 'numeric' })
})

const allTasks = computed(() => store.tasks)
const filteredTasks = computed(() => {
  if (!colorFilter.value) return allTasks.value
  return allTasks.value.filter(t => t.color === colorFilter.value)
})
const activeTasks = computed(() => filteredTasks.value.filter(t => !t.completed).sort((a, b) => {
  const prioOrder = { high: 0, normal: 1, none: 2 }
  return (prioOrder[a.priority] ?? 2) - (prioOrder[b.priority] ?? 2) || a.position - b.position
}))
const completedTasks = computed(() => filteredTasks.value.filter(t => t.completed))
const completedCount = computed(() => allTasks.value.filter(t => t.completed).length)
const completionPercent = computed(() =>
  allTasks.value.length ? Math.round((completedCount.value / allTasks.value.length) * 100) : 0
)

function colorCount(color) {
  return allTasks.value.filter(t => t.color === color).length
}

function shiftMonth(delta) {
  let m = currentMonth.value + delta
  let y = currentYear.value
  if (m > 12) { m = 1; y++ }
  if (m < 1) { m = 12; y-- }
  currentMonth.value = m
  currentYear.value = y
}

function goToCurrentMonth() {
  currentMonth.value = now.getMonth() + 1
  currentYear.value = now.getFullYear()
}

async function handleAdd(data) {
  const todayStr = new Date().toISOString().slice(0, 10)
  await store.addTask({ ...data, date: todayStr, color: newTaskColor.value, priority: newTaskPriority.value })
}
async function handleUpdate(id, data) { await store.updateTask(id, data) }
async function handleRemove(id) { await store.removeTask(id) }
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
</style>
