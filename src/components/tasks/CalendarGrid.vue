<template>
  <div class="calendar" @touchstart.passive="onTouchStart" @touchend.passive="onTouchEnd">
    <div class="calendar-header">
      <button class="calendar-nav" @click="store.prevMonth()">
        <ChevronLeft :size="18" />
      </button>
      <div class="calendar-header-center">
        <span class="calendar-month">{{ monthLabel }}</span>
        <button v-if="!isCurrentMonth" class="calendar-today-btn" @click="jumpToToday">
          Сегодня
        </button>
      </div>
      <button class="calendar-nav" @click="store.nextMonth()">
        <ChevronRight :size="18" />
      </button>
    </div>

    <div class="calendar-weekdays">
      <span v-for="day in WEEKDAYS" :key="day">{{ day }}</span>
    </div>

    <div class="calendar-grid">
      <div
        v-for="n in firstDayOffset"
        :key="`empty-${n}`"
        class="calendar-cell calendar-cell--empty"
      />

      <div
        v-for="day in daysInMonth"
        :key="day"
        class="calendar-cell"
        :class="{
          'calendar-cell--today': isToday(day),
          'calendar-cell--over': dragOverDate === dateStr(day),
          'calendar-cell--has-tasks': store.tasksByDate(dateStr(day)).length > 0,
        }"
        :data-date="dateStr(day)"
        @click="$emit('date-click', dateStr(day))"
        @dragover.prevent="dragOverDate = dateStr(day)"
        @dragleave="dragOverDate = null"
        @drop.prevent="handleDrop($event, dateStr(day))"
      >
        <span class="calendar-cell__num">{{ day }}</span>
        <div class="calendar-cell__dots">
          <span
            v-for="task in store.tasksByDate(dateStr(day)).slice(0, 3)"
            :key="task.id"
            class="calendar-cell__dot"
            :class="`dot--${task.color}`"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'
import { useTasksStore } from '@/stores/tasks.js'

const WEEKDAYS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
const MONTHS = [
  'Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь',
  'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь',
]

const store = useTasksStore()
const dragOverDate = ref(null)
let touchStartX = 0

const emit = defineEmits(['date-click', 'task-dropped'])

const today = new Date()
const monthLabel = computed(() => `${MONTHS[store.currentMonth - 1]} ${store.currentYear}`)
const daysInMonth = computed(() => new Date(store.currentYear, store.currentMonth, 0).getDate())
const firstDayOffset = computed(() => {
  const d = new Date(store.currentYear, store.currentMonth - 1, 1).getDay()
  return d === 0 ? 6 : d - 1
})
const isCurrentMonth = computed(
  () => store.currentMonth === today.getMonth() + 1 && store.currentYear === today.getFullYear(),
)

function dateStr(day) {
  return `${store.currentYear}-${String(store.currentMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function isToday(day) {
  return (
    today.getDate() === day &&
    today.getMonth() + 1 === store.currentMonth &&
    today.getFullYear() === store.currentYear
  )
}

function jumpToToday() {
  store.currentMonth = today.getMonth() + 1
  store.currentYear = today.getFullYear()
}

// Swipe left/right to change months
function onTouchStart(e) {
  touchStartX = e.touches[0].clientX
}
function onTouchEnd(e) {
  const dx = e.changedTouches[0].clientX - touchStartX
  if (Math.abs(dx) < 50) return // too short swipe
  if (dx < 0) store.nextMonth()
  else store.prevMonth()
}

function handleDrop(event, date) {
  const taskId = event.dataTransfer.getData('taskId')
  dragOverDate.value = null
  if (taskId) emit('task-dropped', { taskId, date })
}

// Expose for touch drag
function setDragOver(date) { dragOverDate.value = date }
function clearDragOver() { dragOverDate.value = null }
function emitDrop(taskId, date) { emit('task-dropped', { taskId, date }) }

defineExpose({ setDragOver, clearDragOver, emitDrop })
</script>

<style scoped>
.calendar {
  background: white;
  border-radius: var(--radius-xl);
  padding: 1rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.06);
}

.calendar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
}

.calendar-header-center {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.calendar-nav {
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-text-muted);
  transition: background 0.15s;
}

.calendar-nav:hover {
  background: var(--color-surface);
}

.calendar-month {
  font-weight: 700;
  font-size: 1rem;
  color: var(--color-text);
}

.calendar-today-btn {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--color-accent);
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  font-family: inherit;
  text-decoration: underline;
  text-underline-offset: 2px;
}

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  margin-bottom: 0.25rem;
}

.calendar-weekdays span {
  text-align: center;
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: var(--color-text-muted);
  padding: 0.25rem 0;
}

.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 2px;
}

.calendar-cell {
  min-height: 48px;
  border-radius: var(--radius-sm);
  padding: 0.25rem;
  cursor: pointer;
  transition: background 0.15s;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.calendar-cell:hover {
  background: var(--color-surface);
}

.calendar-cell--empty {
  cursor: default;
}

.calendar-cell--empty:hover {
  background: none;
}

.calendar-cell--today .calendar-cell__num {
  background: var(--color-accent);
  color: white;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-cell--over {
  background: rgb(99 102 241 / 0.08);
  outline: 2px dashed var(--color-accent);
}

.calendar-cell--has-tasks::after {
  content: '';
  position: absolute;
  bottom: 2px;
  right: 2px;
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background: var(--color-accent);
  opacity: 0.4;
}

.calendar-cell__num {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--color-text);
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.calendar-cell__dots {
  display: flex;
  gap: 2px;
  flex-wrap: wrap;
  justify-content: center;
  margin-top: 2px;
}

.calendar-cell__dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.dot--red { background: #f87171; }
.dot--yellow { background: #facc15; }
.dot--green { background: #4ade80; }
</style>
