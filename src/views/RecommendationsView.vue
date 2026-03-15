<template>
  <div class="space-y-6">
    <div>
      <h1 class="font-display text-3xl font-bold text-ink-900">Рекомендации</h1>
      <p class="text-ink-500 text-sm mt-1">Персональные статьи на основе вашего портрета</p>
    </div>

    <div v-if="store.loading" class="text-sm text-ink-400 text-center py-16">Загрузка...</div>

    <template v-else-if="store.recommendations.length">
      <!-- Time slots -->
      <section v-for="slot in slots" :key="slot.key" class="space-y-3">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 rounded-full flex items-center justify-center" :class="slot.bg">
            <component :is="slot.icon" class="w-4 h-4" :class="slot.iconColor" />
          </div>
          <div>
            <h2 class="text-sm font-semibold text-ink-900">{{ slot.label }}</h2>
            <p class="text-[10px] text-ink-400">{{ slot.desc }}</p>
          </div>
          <span
            v-if="isCurrentSlot(slot.key)"
            class="ml-auto text-[10px] font-bold text-terra-500 bg-terra-50 px-2 py-0.5 rounded-full"
          >
            Сейчас
          </span>
        </div>

        <div v-if="bySlot[slot.key]?.length" class="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <ArticleCard
            v-for="rec in bySlot[slot.key]"
            :key="rec.id"
            :rec="rec"
            @read="store.read"
            @helpful="handleHelpful"
          />
        </div>
        <div v-else class="bg-cream-200/50 rounded-xl py-4 text-center">
          <p class="text-xs text-ink-400">Нет рекомендаций для этого времени</p>
        </div>
      </section>
    </template>

    <!-- Empty state -->
    <div v-else class="text-center py-16">
      <div class="w-16 h-16 rounded-full bg-cream-200 flex items-center justify-center mx-auto mb-4">
        <Sparkles class="w-8 h-8 text-ink-300" />
      </div>
      <h3 class="font-display text-lg font-semibold text-ink-700 mb-1">Рекомендации ещё не готовы</h3>
      <p class="text-ink-400 text-sm max-w-xs mx-auto">
        Записывайте эмоции и ведите дневник — мы подберём персональные статьи для вас
      </p>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRecommendationsStore } from '@/stores/recommendations'
import ArticleCard from '@/components/recommendations/ArticleCard.vue'
import { Sun, Cloud, Moon, Sparkles } from 'lucide-vue-next'

const store = useRecommendationsStore()

const slots = [
  { key: 'morning', label: 'Утро', desc: '6:00 — 12:00', icon: Sun, bg: 'bg-gold-200/60', iconColor: 'text-gold-600' },
  { key: 'afternoon', label: 'День', desc: '12:00 — 18:00', icon: Cloud, bg: 'bg-sky-300/40', iconColor: 'text-sky-600' },
  { key: 'evening', label: 'Вечер', desc: '18:00 — 00:00', icon: Moon, bg: 'bg-violet-300/40', iconColor: 'text-violet-600' },
]

onMounted(() => store.fetchToday())

const bySlot = computed(() => {
  const groups = { morning: [], afternoon: [], evening: [] }
  for (const rec of store.recommendations) {
    const s = rec.slot || 'morning'
    if (groups[s]) groups[s].push(rec)
  }
  return groups
})

function isCurrentSlot(slot) {
  const h = new Date().getHours()
  if (slot === 'morning') return h >= 6 && h < 12
  if (slot === 'afternoon') return h >= 12 && h < 18
  if (slot === 'evening') return h >= 18 || h < 6
  return false
}

async function handleHelpful(id, isHelpful) {
  await store.helpful(id, isHelpful)
}
</script>
