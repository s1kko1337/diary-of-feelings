<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="show" class="sheet-overlay" @click.self="$emit('close')">
        <div class="sheet">
          <!-- Handle -->
          <div class="sheet-handle" />

          <!-- Header -->
          <div class="sheet-header">
            <div>
              <p class="sheet-date-label">{{ weekday }}</p>
              <h2 class="sheet-date">{{ dateFormatted }}</h2>
            </div>
            <button class="sheet-add" @click="$emit('create', date)">
              <Plus :size="18" />
              <span>Добавить</span>
            </button>
          </div>

          <!-- Task list -->
          <div class="sheet-body">
            <div v-if="tasks.length === 0" class="sheet-empty">
              <p>Задач на этот день нет</p>
              <button class="sheet-empty-btn" @click="$emit('create', date)">
                Создать первую
              </button>
            </div>

            <TransitionGroup v-else name="task-list" tag="div" class="task-list">
              <div
                v-for="task in tasks"
                :key="task.id"
                class="task-row"
                :class="[`task-row--${task.color}`, { 'task-row--done': task.completed }]"
              >
                <!-- Checkbox -->
                <button class="task-check" @click="store.toggleComplete(task.id)">
                  <CheckIcon v-if="task.completed" :size="11" :stroke-width="3" />
                </button>

                <div class="task-row-content" @click="$emit('edit', task)">
                  <div class="task-row-info">
                    <p class="task-row-text">{{ task.text }}</p>
                    <div class="task-row-meta">
                      <span v-if="task.time" class="task-row-time">{{ task.time }}</span>
                      <span v-if="task.category" class="task-row-category">{{ task.category }}</span>
                      <span v-if="task.priority && task.priority !== 'none'" class="task-priority-badge" :class="`badge--${task.priority}`">
                        {{ task.priority === 'high' ? 'Высокий' : 'Средний' }}
                      </span>
                    </div>
                  </div>
                  <PencilIcon :size="16" class="task-row-edit" :stroke-width="1.8" />
                </div>
                <button class="task-row-delete" @click="onDelete(task.id)">
                  <Trash2Icon :size="15" :stroke-width="1.8" />
                </button>
              </div>
            </TransitionGroup>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed } from 'vue'
import { CheckIcon, Plus, PencilIcon, Trash2Icon } from 'lucide-vue-next'
import { useTasksStore } from '@/stores/tasks.js'

const props = defineProps({
  show: Boolean,
  date: { type: String, default: null }, // YYYY-MM-DD
})

defineEmits(['close', 'create', 'edit'])

const store = useTasksStore()

const tasks = computed(() => (props.date ? store.tasksByDate(props.date) : []))

const dateFormatted = computed(() => {
  if (!props.date) return ''
  return new Date(props.date + 'T00:00:00').toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
  })
})

const weekday = computed(() => {
  if (!props.date) return ''
  return new Date(props.date + 'T00:00:00').toLocaleDateString('ru-RU', { weekday: 'long' })
})

async function onDelete(id) {
  await store.deleteTask(id)
}
</script>

<style scoped>
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.35);
  z-index: 200;
  display: flex;
  align-items: flex-end;
}

.sheet {
  width: 100%;
  max-height: 75dvh;
  background: white;
  border-radius: 20px 20px 0 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

.sheet-handle {
  width: 36px;
  height: 4px;
  background: rgba(0, 0, 0, 0.12);
  border-radius: 2px;
  margin: 10px auto 0;
  flex-shrink: 0;
}

.sheet-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  flex-shrink: 0;
}

.sheet-date-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.4));
  margin: 0 0 0.15rem;
}

.sheet-date {
  font-size: 1.3rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text, #1a1714);
  margin: 0;
}

.sheet-add {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 0.9rem;
  border-radius: 50px;
  border: none;
  background: #6366f1;
  color: white;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s ease;
  font-family: inherit;
}

.sheet-add:hover {
  background: #4f46e5;
}

.sheet-body {
  flex: 1;
  overflow-y: auto;
  padding: 0.75rem 1.25rem 1.25rem;
}

.sheet-empty {
  text-align: center;
  padding: 2rem 1rem;
}

.sheet-empty p {
  font-size: 0.9rem;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.4));
  margin: 0 0 1rem;
}

.sheet-empty-btn {
  padding: 0.55rem 1.2rem;
  border-radius: 50px;
  border: 1.5px solid #6366f1;
  background: transparent;
  color: #6366f1;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

.task-list {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.task-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  border-radius: 14px;
  overflow: hidden;
  transition: opacity 0.2s;
}

.task-row--done {
  opacity: 0.55;
}

.task-row--done .task-row-text {
  text-decoration: line-through;
  text-decoration-color: rgba(45, 45, 45, 0.45);
}

/* Checkbox */
.task-check {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  border: 1.5px solid rgba(0, 0, 0, 0.2);
  background: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
  color: #2d2d2d;
  transition: background 0.15s, border-color 0.15s;
  margin-left: 0.5rem;
}

.task-row--done .task-check {
  background: rgba(0, 0, 0, 0.12);
  border-color: rgba(0, 0, 0, 0.25);
}

.task-row-content {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 0.75rem;
  cursor: pointer;
  border-radius: 12px;
  transition: opacity 0.15s ease;
}

.task-row--red .task-row-content { background: #ffd0cc; }
.task-row--yellow .task-row-content { background: #fff3b0; }
.task-row--green .task-row-content { background: #d4f0d4; }

.task-row-content:active { opacity: 0.7; }

.task-row-info {
  flex: 1;
  min-width: 0;
}

.task-row-text {
  font-size: 0.9rem;
  font-weight: 600;
  color: #2d2d2d;
  margin: 0 0 0.15rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.task-row-meta {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.task-row-time {
  font-size: 0.68rem;
  font-weight: 700;
  color: rgba(45, 45, 45, 0.65);
  background: rgba(0, 0, 0, 0.07);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
}

.task-row-category {
  font-size: 0.68rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: rgba(45, 45, 45, 0.5);
}

.task-priority-badge {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.badge--normal { background: #fef3c7; color: #92400e; }
.badge--high { background: #fee2e2; color: #991b1b; }

.task-row-edit {
  color: rgba(45, 45, 45, 0.35);
  flex-shrink: 0;
}

.task-row-delete {
  padding: 0.75rem 0.6rem;
  border: none;
  background: transparent;
  color: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: color 0.15s ease;
}

.task-row-delete:hover {
  color: #ef4444;
}

/* Transitions */
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity 0.25s ease;
}
.sheet-enter-active .sheet,
.sheet-leave-active .sheet {
  transition: transform 0.3s cubic-bezier(0.32, 0.72, 0, 1);
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .sheet,
.sheet-leave-to .sheet {
  transform: translateY(100%);
}

.task-list-enter-active,
.task-list-leave-active {
  transition: all 0.2s ease;
}
.task-list-enter-from,
.task-list-leave-to {
  opacity: 0;
  transform: translateY(8px);
}
</style>
