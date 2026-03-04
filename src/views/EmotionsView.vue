<template>
  <div class="emotions-page">
    <h1 class="page-title">Дневник эмоций</h1>

    <!-- Wheel or Form -->
    <section class="glass-card">
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
    <section v-if="patterns && patterns.totalEntries > 0" class="glass-card">
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
    <section v-if="history.length > 1" class="glass-card">
      <p class="section-label">Динамика</p>
      <EmotionChart :entries="history" />
    </section>

    <!-- Today's entries -->
    <section class="glass-card">
      <p class="section-label">Сегодня</p>
      <EmotionHistory :entries="todayEntries" @delete="handleDelete" />
    </section>

    <!-- Full history -->
    <section v-if="olderEntries.length > 0" class="glass-card">
      <p class="section-label">Ранее</p>
      <EmotionHistory :entries="olderEntries" @delete="handleDelete" />
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useEmotionsStore } from '@/stores/emotions'
import { getEmotion } from '@/api/mock/data/emotions-wheel'
import EmotionWheel from '@/components/emotions/EmotionWheel.vue'
import EmotionEntryForm from '@/components/emotions/EmotionEntryForm.vue'
import EmotionHistory from '@/components/emotions/EmotionHistory.vue'
import EmotionChart from '@/components/emotions/EmotionChart.vue'

const store = useEmotionsStore()

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
  await Promise.all([store.loadToday(), store.loadHistory(), store.loadPatterns()])
})
</script>

<style scoped>
.emotions-page {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  padding: 1rem 0;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--color-text);
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
</style>
