<template>
  <div class="history">
    <div v-if="entries.length === 0" class="history-empty">
      <div class="empty-mark" />
      <p class="empty-title">Пока нет записей</p>
      <p class="empty-hint">Начни с выбора эмоции выше -- это займёт минуту</p>
    </div>

    <div v-for="entry in entries" :key="entry.id" class="history-entry">
      <div class="entry-header">
        <span class="entry-emoji">{{ emotionEmoji(entry.emotion) }}</span>
        <div class="entry-info">
          <span class="entry-label">{{ emotionLabel(entry.emotion) }}</span>
          <span class="entry-meta">
            {{ formatDate(entry.createdAt) }}
            <span class="entry-intensity">{{ entry.intensity }}/10</span>
          </span>
        </div>
        <button class="entry-delete" @click="emit('delete', entry.id)">
          <XIcon :size="14" :stroke-width="2" />
        </button>
      </div>
      <p v-if="entry.note" class="entry-note">{{ entry.note }}</p>
      <div v-if="entry.isTimeCapsule" class="entry-capsule">
        <ClockIcon :size="12" :stroke-width="1.8" />
        Тайм-капсула
      </div>
    </div>
  </div>
</template>

<script setup>
import { XIcon, ClockIcon } from 'lucide-vue-next'
import { getEmotion } from '@/api/mock/data/emotions-wheel'

defineProps({
  entries: { type: Array, default: () => [] },
})

const emit = defineEmits(['delete'])

function emotionEmoji(key) {
  return getEmotion(key)?.emoji ?? ''
}

function emotionLabel(key) {
  return getEmotion(key)?.label ?? key
}

function formatDate(iso) {
  const d = new Date(iso)
  return d.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.history {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.history-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 2.5rem 1rem;
  gap: 8px;
}

.empty-mark {
  width: 48px;
  height: 2px;
  background: var(--color-border);
  margin-bottom: 0.75rem;
  pointer-events: none;
}

.empty-title {
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--color-text);
}

.empty-hint {
  font-size: 0.82rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 280px;
}

.history-entry {
  padding: 12px 0;
  border-bottom: 1px solid var(--color-border);
}

.history-entry:last-child {
  border-bottom: none;
}

.entry-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.entry-emoji {
  font-size: 1.25rem;
}

.entry-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.entry-label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-text);
}

.entry-meta {
  font-size: 0.7rem;
  color: var(--color-text-muted);
  display: flex;
  align-items: center;
  gap: 8px;
}

.entry-intensity {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  padding: 1px 6px;
  border-radius: var(--radius-sm);
  background: var(--color-primary-soft);
  color: var(--color-primary);
}

.entry-delete {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: var(--radius-full);
  border: none;
  background: none;
  color: var(--color-text-muted);
  cursor: pointer;
  transition: all 0.2s ease;
}

.entry-delete:hover {
  background: var(--color-surface-hover);
  color: var(--color-danger);
}

.entry-note {
  margin-top: 8px;
  font-size: 0.85rem;
  line-height: 1.5;
  color: var(--color-text-secondary);
  padding-left: 2.25rem;
}

.entry-capsule {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  margin-top: 6px;
  margin-left: 2.25rem;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  background: var(--color-lavender-soft);
  color: var(--color-primary);
  font-size: 0.65rem;
  font-weight: 500;
}
</style>
