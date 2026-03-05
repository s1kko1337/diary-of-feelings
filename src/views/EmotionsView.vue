<template>
  <div class="emotions-page">
    <h1 class="page-title">Дневник эмоций</h1>

    <!-- Loading -->
    <div v-if="loading" class="skeleton-list">
      <div v-for="i in 3" :key="i" class="skeleton-card" />
    </div>

    <!-- Error -->
    <div v-else-if="error" class="error-banner">
      <AlertCircleIcon :size="18" :stroke-width="1.8" />
      <span>Не удалось загрузить данные. Попробуй обновить страницу.</span>
    </div>

    <template v-else>
      <!-- Wheel or Form -->
      <section class="flat-card section-card">
        <p class="section-label">Что ты сейчас чувствуешь?</p>

        <EmotionWheel v-if="!selectedEmotion" @select="handleEmotionSelect" />

        <EmotionEntryForm
          v-else
          :emotion="selectedEmotion"
          :emotion-category="selectedCategory"
          @submit="handleSubmit"
          @change-emotion="resetSelection"
        />
      </section>

      <!-- Patterns -->
      <section v-if="patterns && patterns.totalEntries > 0" class="flat-card section-card">
        <p class="section-label">Паттерны за неделю</p>
        <div class="patterns">
          <div class="pattern-stat">
            <span class="pattern-value">{{ patterns.totalEntries }}</span>
            <span class="pattern-name">записей</span>
          </div>
          <div class="pattern-stat">
            <span class="pattern-value">{{ patterns.averageIntensity }}</span>
            <span class="pattern-name">средняя интенсивность</span>
          </div>
          <div v-for="top in patterns.topEmotions" :key="top.emotion" class="pattern-stat">
            <span class="pattern-value">{{ emotionEmoji(top.emotion) }} {{ top.count }}</span>
            <span class="pattern-name">{{ emotionLabel(top.emotion) }}</span>
          </div>
        </div>
      </section>

      <!-- Chart -->
      <section v-if="history.length > 1" class="flat-card section-card">
        <p class="section-label">Динамика</p>
        <EmotionChart :entries="history" />
      </section>

      <!-- Today's entries -->
      <section class="flat-card section-card">
        <p class="section-label">Сегодня</p>
        <EmotionHistory :entries="todayEntries" @delete="handleDelete" />
      </section>

      <!-- Full history -->
      <section v-if="olderEntries.length > 0" class="flat-card section-card">
        <p class="section-label">Ранее</p>
        <EmotionHistory :entries="olderEntries" @delete="handleDelete" />
      </section>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { AlertCircleIcon } from 'lucide-vue-next'
import { useEmotionsStore } from '@/stores/emotions'
import { getEmotion } from '@/api/mock/data/emotions-wheel'
import EmotionWheel from '@/components/emotions/EmotionWheel.vue'
import EmotionEntryForm from '@/components/emotions/EmotionEntryForm.vue'
import EmotionHistory from '@/components/emotions/EmotionHistory.vue'
import EmotionChart from '@/components/emotions/EmotionChart.vue'

const store = useEmotionsStore()

const loading = ref(true)
const error = ref(false)
const selectedEmotion = ref(null)
const selectedCategory = ref(null)

const todayEntries = computed(() => store.todayEntries)
const history = computed(() => store.history)
const patterns = computed(() => store.patterns)

const today = new Date().toISOString().slice(0, 10)
const olderEntries = computed(() => store.history.filter((e) => e.date !== today))

function emotionEmoji(key) {
  return getEmotion(key)?.emoji ?? ''
}

function emotionLabel(key) {
  return getEmotion(key)?.label ?? key
}

function handleEmotionSelect({ emotion, emotionCategory }) {
  selectedEmotion.value = emotion
  selectedCategory.value = emotionCategory
}

function resetSelection() {
  selectedEmotion.value = null
  selectedCategory.value = null
}

async function handleSubmit(data) {
  await store.createEntry(data)
  resetSelection()
  await store.loadPatterns()
}

async function handleDelete(id) {
  await store.removeEntry(id)
  await store.loadPatterns()
}

onMounted(async () => {
  try {
    await Promise.all([store.loadToday(), store.loadHistory(), store.loadPatterns()])
  } catch {
    error.value = true
  } finally {
    loading.value = false
  }
})
</script>

<style scoped>
.emotions-page {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding: 1rem 0;
}

.page-title {
  font-size: 2.25rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.15;
  color: var(--color-text);
}

.section-card {
  padding: 1.25rem;
}

.section-label {
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

/* Patterns */
.patterns {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
}

.pattern-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 10px 16px;
  border-radius: var(--radius-md);
  background: var(--color-surface-hover);
  min-width: 80px;
}

.pattern-value {
  font-size: 1rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--color-text);
}

.pattern-name {
  font-size: 0.7rem;
  color: var(--color-text-muted);
}

/* Loading skeleton */
.skeleton-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.skeleton-card {
  height: 120px;
  border-radius: var(--radius-lg);
  background: linear-gradient(
    90deg,
    var(--color-surface-hover) 25%,
    var(--color-surface) 50%,
    var(--color-surface-hover) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

/* Error */
.error-banner {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 18px;
  border-radius: var(--radius-lg);
  background: var(--color-rose-soft);
  border: 1px solid rgb(240 184 192 / 0.3);
  color: var(--color-text);
  font-size: 0.85rem;
}
</style>
