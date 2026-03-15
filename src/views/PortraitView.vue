<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-3xl font-bold text-ink-900">Эмоциональный портрет</h1>
      <p class="text-ink-500 text-sm mt-1">Анализ за последние 30 дней</p>
    </div>

    <div v-if="!portrait" class="text-center py-20">
      <div class="w-20 h-20 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-5">
        <Fingerprint class="w-10 h-10 text-ink-300" />
      </div>
      <h3 class="font-display text-lg font-semibold text-ink-700 mb-1">Портрет ещё не построен</h3>
      <p class="text-ink-400 text-sm max-w-xs mx-auto">
        Записывайте эмоции, ведите КПТ дневник и выполняйте задачи, чтобы увидеть свой портрет
      </p>
    </div>

    <template v-else>
      <!-- Data quality -->
      <div v-if="portrait.dataQuality < 0.5" class="bg-gold-200/30 rounded-2xl px-5 py-4 flex items-start gap-3 border border-gold-300/30">
        <AlertCircle class="w-5 h-5 text-gold-600 mt-0.5 shrink-0" />
        <div>
          <p class="text-sm font-semibold text-gold-700">Качество данных: {{ Math.round(portrait.dataQuality * 100) }}%</p>
          <p class="text-xs text-gold-600 mt-0.5">Чем больше записей, тем точнее портрет</p>
        </div>
      </div>

      <!-- Hero metrics -->
      <div class="grid grid-cols-2 gap-3">
        <!-- Dominant emotion — full width -->
        <div class="col-span-2 bg-gradient-to-br from-terra-500 to-terra-600 rounded-2xl p-6 text-white relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
          <p class="text-terra-200 text-xs font-semibold uppercase tracking-wider">Доминирующая эмоция</p>
          <p class="font-display text-3xl font-bold mt-2">{{ portrait.dominantEmotion || 'Недостаточно данных' }}</p>
          <p v-if="portrait.dominantCategory" class="text-terra-200 text-sm mt-1">{{ categoryLabel(portrait.dominantCategory) }}</p>
        </div>

        <!-- Mood trend -->
        <div class="bg-white rounded-2xl p-5 border border-ink-100">
          <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Тренд</p>
          <div class="flex items-baseline gap-2 mt-2">
            <span class="text-3xl font-display font-bold" :class="trendColor">{{ trendArrow }}</span>
            <span class="text-sm font-medium" :class="trendColor">{{ trendLabel }}</span>
          </div>
        </div>

        <!-- Stress level -->
        <div class="bg-white rounded-2xl p-5 border border-ink-100">
          <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Стресс</p>
          <p class="text-3xl font-display font-bold mt-2" :class="stressColor">
            {{ portrait.stressLevel?.toFixed(1) || '—' }}
          </p>
          <div class="w-full bg-cream-200 rounded-full h-2 mt-3">
            <div class="h-full rounded-full transition-all" :class="stressBarColor" :style="{ width: `${(portrait.stressLevel || 0) * 10}%` }" />
          </div>
        </div>

        <!-- Productivity -->
        <div class="bg-white rounded-2xl p-5 border border-ink-100">
          <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Продуктивность</p>
          <p class="text-3xl font-display font-bold text-forest-600 mt-2">
            {{ portrait.productivityRate != null ? Math.round(portrait.productivityRate * 100) : '—' }}%
          </p>
          <div class="w-full bg-cream-200 rounded-full h-2 mt-3">
            <div class="h-full rounded-full bg-forest-500 transition-all" :style="{ width: `${(portrait.productivityRate || 0) * 100}%` }" />
          </div>
        </div>

        <!-- Data quality gauge -->
        <div class="bg-white rounded-2xl p-5 border border-ink-100">
          <p class="text-[10px] font-semibold text-ink-400 uppercase tracking-wider">Качество данных</p>
          <p class="text-3xl font-display font-bold text-ink-900 mt-2">{{ Math.round((portrait.dataQuality || 0) * 100) }}%</p>
          <div class="w-full bg-cream-200 rounded-full h-2 mt-3">
            <div class="h-full rounded-full bg-terra-400 transition-all" :style="{ width: `${(portrait.dataQuality || 0) * 100}%` }" />
          </div>
        </div>
      </div>

      <!-- Emotion distribution -->
      <section v-if="hasEmotionData" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">Распределение эмоций</h2>
        <!-- Horizontal stacked bar -->
        <div v-if="totalEmotionCount" class="h-6 flex rounded-full overflow-hidden mb-4">
          <div
            v-for="(count, name) in sortedEmotions"
            :key="name"
            class="transition-all"
            :class="emotionBarColor(name)"
            :style="{ flex: count }"
            :title="`${name}: ${count}`"
          />
        </div>
        <!-- Legend -->
        <div class="space-y-2">
          <div v-for="(count, name) in sortedEmotions" :key="name" class="flex items-center gap-3">
            <span class="w-3 h-3 rounded-full shrink-0" :class="emotionBarColor(name)" />
            <span class="text-sm text-ink-700 flex-1">{{ name }}</span>
            <span class="text-xs font-bold text-ink-500 tabular-nums">{{ count }}</span>
            <span class="text-xs text-ink-400 w-10 text-right">{{ Math.round(count / totalEmotionCount * 100) }}%</span>
          </div>
        </div>
      </section>

      <!-- Top distortions -->
      <section v-if="hasDistortionData" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-4">Когнитивные искажения</h2>
        <div class="space-y-3">
          <div v-for="(count, name) in portrait.topDistortions" :key="name" class="flex items-center gap-3">
            <span class="text-sm text-ink-700 flex-1">{{ name }}</span>
            <div class="w-24 h-2.5 bg-cream-200 rounded-full overflow-hidden">
              <div class="h-full bg-violet-400 rounded-full" :style="{ width: `${(count / maxDistortionCount) * 100}%` }" />
            </div>
            <span class="text-xs font-bold text-ink-500 w-5 text-right tabular-nums">{{ count }}</span>
          </div>
        </div>
      </section>

      <!-- Active themes -->
      <section v-if="portrait.activeThemes?.length" class="bg-white rounded-2xl p-5 border border-ink-100">
        <h2 class="font-display text-lg font-semibold text-ink-900 mb-3">Активные темы</h2>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="(theme, i) in portrait.activeThemes"
            :key="theme"
            class="px-4 py-2 rounded-2xl text-sm font-medium"
            :class="themeColors[i % themeColors.length]"
          >
            {{ theme }}
          </span>
        </div>
      </section>

      <p v-if="portrait.computedAt" class="text-xs text-ink-400 text-center pt-2">
        Обновлено {{ new Date(portrait.computedAt).toLocaleString('ru-RU') }}
      </p>
    </template>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRecommendationsStore } from '@/stores/recommendations'
import { Fingerprint, AlertCircle } from 'lucide-vue-next'

const store = useRecommendationsStore()
const portrait = computed(() => store.portrait)

onMounted(() => store.fetchPortrait())

const categoryLabels = {
  joy: 'Радость', sadness: 'Грусть', anger: 'Злость',
  anxiety: 'Тревога', fear: 'Страх', disgust: 'Отвращение',
}
function categoryLabel(cat) { return categoryLabels[cat] || cat }

const trendArrow = computed(() => {
  const t = portrait.value?.moodTrend
  return t === 'improving' ? '\u2197' : t === 'declining' ? '\u2198' : '\u2192'
})
const trendLabel = computed(() => {
  const t = portrait.value?.moodTrend
  return t === 'improving' ? 'Улучшается' : t === 'declining' ? 'Ухудшается' : 'Стабильно'
})
const trendColor = computed(() => {
  const t = portrait.value?.moodTrend
  return t === 'improving' ? 'text-forest-500' : t === 'declining' ? 'text-coral-500' : 'text-gold-500'
})
const stressColor = computed(() => {
  const s = portrait.value?.stressLevel || 0
  return s <= 3 ? 'text-forest-500' : s <= 6 ? 'text-gold-500' : 'text-coral-500'
})
const stressBarColor = computed(() => {
  const s = portrait.value?.stressLevel || 0
  return s <= 3 ? 'bg-forest-500' : s <= 6 ? 'bg-gold-500' : 'bg-coral-500'
})

const sortedEmotions = computed(() => {
  const ec = portrait.value?.emotionCounts || {}
  return Object.fromEntries(Object.entries(ec).sort(([, a], [, b]) => b - a).slice(0, 10))
})
const totalEmotionCount = computed(() => Object.values(sortedEmotions.value).reduce((a, b) => a + b, 0))
const hasEmotionData = computed(() => Object.keys(portrait.value?.emotionCounts || {}).length > 0)
const hasDistortionData = computed(() => Object.keys(portrait.value?.topDistortions || {}).length > 0)
const maxDistortionCount = computed(() => {
  const vals = Object.values(portrait.value?.topDistortions || {})
  return vals.length ? Math.max(...vals) : 1
})

const emotionColors = [
  'bg-terra-400', 'bg-coral-400', 'bg-gold-400', 'bg-sky-400', 'bg-violet-400',
  'bg-forest-400', 'bg-rose-400', 'bg-terra-300', 'bg-sky-500', 'bg-gold-500',
]
function emotionBarColor(name) {
  const keys = Object.keys(sortedEmotions.value)
  const idx = keys.indexOf(name)
  return emotionColors[idx % emotionColors.length]
}

const themeColors = [
  'bg-terra-100 text-terra-700',
  'bg-sky-300/30 text-sky-700',
  'bg-violet-300/30 text-violet-700',
  'bg-gold-200/60 text-gold-700',
  'bg-forest-200/50 text-forest-700',
]
</script>
