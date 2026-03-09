<template>
  <div class="pool">
    <div class="pool-header">
      <span class="pool-label">Незапланированные</span>
      <button class="pool-add" @click="$emit('create')">
        <Plus :size="16" />
      </button>
    </div>
    <div class="pool-list">
      <div
        v-for="task in store.unscheduledTasks"
        :key="task.id"
        class="pool-item"
        draggable="true"
        @dragstart="onDragStart($event, task)"
        @touchstart.passive="onTouchStart($event, task)"
        @touchmove.prevent="onTouchMove"
        @touchend="onTouchEnd"
      >
        <StickyNote
          :task="task"
          @click="$emit('edit', task)"
          @delete="store.deleteTask(task.id)"
          @toggle-complete="store.toggleComplete(task.id)"
        />
      </div>
      <div v-if="!store.unscheduledTasks.length" class="pool-empty">
        Все задачи запланированы!
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useTasksStore } from '@/stores/tasks.js'
import StickyNote from './StickyNote.vue'

const store = useTasksStore()
const emit = defineEmits(['create', 'edit', 'task-dropped'])

// ── Mouse drag ────────────────────────────────────────────
function onDragStart(event, task) {
  event.dataTransfer.setData('taskId', task.id)
  event.dataTransfer.effectAllowed = 'move'
}

// ── Touch drag ────────────────────────────────────────────
const touchTask = ref(null)
let ghost = null
let lastDropDate = null

function findDateAt(x, y) {
  // Temporarily hide ghost so it doesn't block elementFromPoint
  if (ghost) ghost.style.display = 'none'
  const el = document.elementFromPoint(x, y)
  if (ghost) ghost.style.display = ''

  if (!el) return null
  const cell = el.closest('[data-date]')
  return cell ? cell.dataset.date : null
}

function createGhost(srcEl) {
  const rect = srcEl.getBoundingClientRect()
  ghost = srcEl.cloneNode(true)
  Object.assign(ghost.style, {
    position: 'fixed',
    width: rect.width + 'px',
    height: rect.height + 'px',
    top: rect.top + 'px',
    left: rect.left + 'px',
    opacity: '0.85',
    zIndex: '9999',
    pointerEvents: 'none',
    transform: 'scale(1.06) rotate(2deg)',
    transition: 'none',
    boxShadow: '0 12px 32px rgba(0,0,0,0.2)',
    borderRadius: '12px',
  })
  document.body.appendChild(ghost)
}

function onTouchStart(event, task) {
  touchTask.value = task
  createGhost(event.currentTarget)
}

function onTouchMove(event) {
  if (!ghost) return
  const t = event.touches[0]
  const rect = ghost.getBoundingClientRect()
  ghost.style.top = t.clientY - rect.height / 2 + 'px'
  ghost.style.left = t.clientX - rect.width / 2 + 'px'

  const date = findDateAt(t.clientX, t.clientY)
  lastDropDate = date

  // Highlight drop target
  document.querySelectorAll('[data-date]').forEach((el) => {
    el.classList.toggle('calendar-cell--over', el.dataset.date === date)
  })
}

function onTouchEnd() {
  if (ghost) {
    ghost.remove()
    ghost = null
  }
  document.querySelectorAll('[data-date]').forEach((el) => {
    el.classList.remove('calendar-cell--over')
  })

  if (touchTask.value && lastDropDate) {
    emit('task-dropped', { taskId: touchTask.value.id, date: lastDropDate })
  }
  touchTask.value = null
  lastDropDate = null
}
</script>

<style scoped>
.pool {
  background: white;
  border-radius: var(--radius-xl);
  padding: 1rem;
  box-shadow: 0 4px 12px rgb(0 0 0 / 0.06);
}

.pool-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.pool-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  font-weight: 600;
}

.pool-add {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent);
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pool-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pool-item {
  flex: 0 0 calc(50% - 0.25rem);
  touch-action: none;
}

.pool-empty {
  font-size: 0.85rem;
  color: var(--color-text-muted);
  text-align: center;
  padding: 1rem;
  width: 100%;
}
</style>
