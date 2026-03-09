<template>
  <div class="cbt-board">
    <div v-for="col in columns" :key="col.status" class="cbt-column">
      <div class="cbt-column__header">
        <span class="cbt-column__title">{{ col.label }}</span>
        <div class="cbt-column__header-right">
          <span class="cbt-column__count">{{ col.items.length }}</span>
          <!-- Archive toggle for "processed" column -->
          <button
            v-if="col.status === 'processed' && col.items.length"
            class="cbt-archive-btn"
            :title="showArchive ? 'Скрыть проработанные' : 'Показать проработанные'"
            @click="showArchive = !showArchive"
          >
            <ArchiveIcon :size="13" :stroke-width="1.8" />
          </button>
        </div>
      </div>
      <draggable
        :list="col.items"
        group="cbt"
        item-key="id"
        class="cbt-column__list"
        ghost-class="cbt-ghost"
        @change="(e) => onDragChange(e, col.status)"
      >
        <template #item="{ element }">
          <div
            class="cbt-card"
            :class="{
              'cbt-card--stale': isStale(element) && col.status === 'in_progress',
              'cbt-card--hidden': col.status === 'processed' && !showArchive,
            }"
            @click="handleOpen(element)"
          >
            <p class="cbt-card__situation">{{ element.situation }}</p>
            <div class="cbt-card__footer">
              <div class="cbt-card__tags">
                <span
                  v-for="em in (element.emotions || []).slice(0, 1)"
                  :key="em.name || em"
                  class="cbt-card__tag cbt-card__tag--emotion"
                >
                  {{ em.name || em }}
                </span>
                <span
                  v-if="element.distortion"
                  class="cbt-card__tag cbt-card__tag--distortion"
                >
                  {{ getDistortionLabel(element.distortion) }}
                </span>
              </div>
              <span class="cbt-card__date" :class="{ 'cbt-card__date--stale': isStale(element) && col.status === 'in_progress' }">
                {{ formatDate(element.createdAt) }}
              </span>
            </div>
          </div>
        </template>
      </draggable>
      <!-- Show archive count when hidden -->
      <div
        v-if="col.status === 'processed' && !showArchive && col.items.length"
        class="cbt-archive-hint"
        @click="showArchive = true"
      >
        {{ col.items.length }} проработано — показать
      </div>
      <button class="cbt-column__add" @click="handleCreate(col.status)">
        <PlusIcon :size="14" />
        Добавить
      </button>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import draggable from 'vuedraggable'
import { ArchiveIcon, Plus as PlusIcon } from 'lucide-vue-next'
import { useCbtStore } from '@/stores/cbt'
import { getDistortion } from '@/api/mock/data/distortions.js'

const store = useCbtStore()
const emit = defineEmits(['open', 'create'])
const showArchive = ref(false)

const STATUS_LABELS = {
  new: 'Новая',
  in_progress: 'В работе',
  processed: 'Проработана',
}

const columns = computed(() =>
  ['new', 'in_progress', 'processed'].map((status) => ({
    status,
    label: STATUS_LABELS[status],
    items: store.entries.filter((e) => (e.status || 'new') === status),
  })),
)

function isStale(entry) {
  const created = new Date(entry.createdAt)
  const diffDays = (Date.now() - created.getTime()) / 86400000
  return diffDays > 3
}

function getDistortionLabel(key) {
  return getDistortion(key)?.label ?? key
}

async function onDragChange(event, toStatus) {
  if (event.added) {
    await store.updateStatus(event.added.element.id, toStatus)
  }
}

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
  })
}

function handleOpen(entry) {
  emit('open', entry)
}

function handleCreate(status) {
  emit('create', status)
}
</script>

<style scoped>
.cbt-board {
  display: flex;
  gap: 0.75rem;
  overflow-x: auto;
  padding-bottom: 0.5rem;
}

.cbt-column {
  flex: 0 0 200px;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.cbt-column__header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
}

.cbt-column__header-right {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.cbt-column__title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-muted);
}

.cbt-column__count {
  font-size: 0.72rem;
  background: var(--color-surface);
  border-radius: var(--radius-full);
  padding: 0.1rem 0.4rem;
  color: var(--color-text-muted);
}

.cbt-archive-btn {
  background: none;
  border: none;
  cursor: pointer;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  padding: 0.15rem;
  border-radius: 4px;
  transition: color 0.15s;
}

.cbt-archive-btn:hover {
  color: var(--color-accent);
}

.cbt-column__list {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  min-height: 80px;
  border-radius: var(--radius-lg);
  padding: 0.25rem;
}

.cbt-card {
  background: white;
  border-radius: var(--radius-md);
  padding: 0.75rem;
  box-shadow: 0 2px 8px rgb(0 0 0 / 0.06);
  cursor: pointer;
  transition:
    transform 0.15s,
    box-shadow 0.15s;
  border-left: 3px solid transparent;
}

.cbt-card--stale {
  border-left-color: #f59e0b;
}

.cbt-card--hidden {
  display: none;
}

.cbt-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 16px rgb(0 0 0 / 0.1);
}

.cbt-ghost {
  opacity: 0.4;
  background: rgb(99 102 241 / 0.08);
  border: 2px dashed var(--color-accent);
  border-radius: var(--radius-md);
}

.cbt-card__situation {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text);
  margin: 0 0 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cbt-card__footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.25rem;
}

.cbt-card__tags {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
  flex: 1;
  min-width: 0;
}

.cbt-card__tag {
  font-size: 0.65rem;
  border-radius: var(--radius-full);
  padding: 0.1rem 0.4rem;
  color: #2d2d2d;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 80px;
}

.cbt-card__tag--emotion {
  background: #ffd0cc;
}

.cbt-card__tag--distortion {
  background: #ede9fe;
  color: #5b21b6;
}

.cbt-card__date {
  font-size: 0.65rem;
  color: var(--color-text-muted);
  white-space: nowrap;
  flex-shrink: 0;
}

.cbt-card__date--stale {
  color: #f59e0b;
  font-weight: 600;
}

.cbt-archive-hint {
  font-size: 0.75rem;
  color: var(--color-accent);
  cursor: pointer;
  text-align: center;
  padding: 0.25rem;
  border-radius: var(--radius-md);
  text-decoration: underline;
  text-underline-offset: 2px;
}

.cbt-column__add {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.3rem;
  padding: 0.4rem 0.75rem;
  border: none;
  background: var(--color-surface);
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: var(--color-text-muted);
  cursor: pointer;
  width: 100%;
  transition: background 0.15s;
  font-family: inherit;
}

.cbt-column__add:hover {
  background: var(--color-border);
}
</style>
