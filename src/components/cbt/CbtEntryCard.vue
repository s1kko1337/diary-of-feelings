<template>
  <article class="entry-card" @click="handleOpen">
    <!-- Header: date + time -->
    <div class="entry-header">
      <time class="entry-date">{{ formattedDate }}</time>
      <span class="entry-time">{{ timeAgo }}</span>
    </div>

    <!-- Situation preview -->
    <p class="entry-label">Ситуация</p>
    <p class="entry-preview">{{ entry.situation }}</p>

    <!-- Footer: badges + open button -->
    <div class="entry-footer">
      <div class="entry-badges">
        <span v-for="em in entry.emotions" :key="em.key" class="emotion-badge">
          {{ em.label }}
          <span class="emotion-badge-intensity metric-value">
            {{ em.intensity }}
          </span>
        </span>
        <span v-if="distortionLabel" class="distortion-badge">
          {{ distortionLabel }}
        </span>
      </div>
      <button class="entry-open-btn" @click.stop="handleOpen">
        Открыть
        <ArrowRightIcon :size="13" :stroke-width="2" />
      </button>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRightIcon } from 'lucide-vue-next'
import { getDistortion } from '@/api/mock/data/distortions'

const props = defineProps({
  entry: { type: Object, required: true },
})

const emit = defineEmits(['open'])

const distortionLabel = computed(() => {
  if (!props.entry.distortion) return null
  const d = getDistortion(props.entry.distortion)
  return d ? d.label : null
})

const formattedDate = computed(() => {
  const date = new Date(props.entry.date + 'T00:00:00')
  const day = date.getDate().toString().padStart(2, '0')
  const months = [
    'января',
    'февраля',
    'марта',
    'апреля',
    'мая',
    'июня',
    'июля',
    'августа',
    'сентября',
    'октября',
    'ноября',
    'декабря',
  ]
  const weekdays = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб']
  const month = months[date.getMonth()]
  const weekday = weekdays[date.getDay()]
  return `${day} ${month} · ${weekday}`
})

const timeAgo = computed(() => {
  const created = new Date(props.entry.createdAt)
  const now = new Date()
  const diffMs = now - created
  const diffMin = Math.floor(diffMs / 60000)
  const diffHour = Math.floor(diffMs / 3600000)
  const diffDay = Math.floor(diffMs / 86400000)

  if (diffMin < 1) return 'только что'
  if (diffMin < 60) return `${diffMin} мин назад`
  if (diffHour < 24) return `${diffHour} ч назад`
  if (diffDay < 7) return `${diffDay} дн назад`
  return formattedDate.value
})

function handleOpen() {
  emit('open', props.entry.id)
}
</script>

<style scoped>
.entry-card {
  padding: 1.25rem;
  cursor: pointer;
  background: var(--color-surface);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
  transition:
    box-shadow 0.2s ease,
    transform 0.15s ease;
}

@media (min-width: 768px) {
  .entry-card {
    padding: 1.5rem;
  }
}

.entry-card:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-float);
}

.entry-card:active {
  transform: translateY(0);
}

.entry-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.entry-date {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-text-muted);
}

.entry-time {
  font-size: 0.72rem;
  color: var(--color-text-muted);
}

.entry-label {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-mint);
  margin-bottom: 4px;
}

.entry-preview {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-text);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-bottom: 12px;
}

.entry-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.entry-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
}

.emotion-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-peach-soft);
  border: 1px solid rgb(248 201 160 / 0.3);
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--color-text);
}

.emotion-badge-intensity {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

.distortion-badge {
  padding: 3px 10px;
  border-radius: var(--radius-full);
  background: var(--color-lavender-soft);
  border: 1px solid rgb(196 181 224 / 0.25);
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--color-text-secondary);
}

.entry-open-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--color-primary);
  background: none;
  border: none;
  cursor: pointer;
  transition: gap 0.2s ease;
  flex-shrink: 0;
}

.entry-open-btn:hover {
  gap: 8px;
}

.entry-card:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
