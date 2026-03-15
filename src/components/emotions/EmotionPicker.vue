<template>
  <div class="space-y-6">
    <!-- Category grid — large, tactile cards -->
    <div>
      <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider mb-3">Что вы чувствуете?</p>
      <div class="grid grid-cols-3 gap-2.5">
        <button
          v-for="cat in categories"
          :key="cat.key"
          @click="selectCategory(cat.key)"
          class="relative rounded-2xl p-3.5 pt-4 text-center transition-all duration-300 border-2 group"
          :class="[
            selected.category === cat.key
              ? `${cat.border} shadow-lg scale-[1.03]`
              : 'border-transparent hover:scale-[1.02] hover:shadow-sm',
            cat.bg,
          ]"
        >
          <span class="text-2xl sm:text-3xl block mb-1.5 transition-transform duration-300 group-hover:scale-110">{{ cat.emoji }}</span>
          <span class="text-xs sm:text-sm font-semibold block" :class="cat.text">{{ cat.label }}</span>
          <div
            v-if="selected.category === cat.key"
            class="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-sm"
            :class="cat.dot"
          >
            <svg class="w-2.5 h-2.5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round"><path d="M20 6L9 17l-5-5"/></svg>
          </div>
        </button>
      </div>
    </div>

    <!-- Emotion name cloud -->
    <Transition name="fade">
      <div v-if="selected.category" class="space-y-3">
        <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">Уточните эмоцию</p>
        <div class="flex flex-wrap gap-2">
          <button
            v-for="name in suggestedEmotions"
            :key="name"
            @click="selectEmotion(name)"
            class="px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border"
            :class="selected.emotion === name
              ? activeCat.pillActive
              : activeCat.pill"
          >
            {{ name }}
          </button>
        </div>
        <div class="relative">
          <input
            v-model="customEmotion"
            type="text"
            placeholder="Или напишите своё..."
            class="w-full rounded-xl border border-ink-200 bg-white px-4 py-2.5 text-sm placeholder:text-ink-400 focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
            @input="selected.emotion = customEmotion"
            @keydown.enter.prevent="selected.emotion && (selected.intensity >= 0) && submit()"
          />
        </div>
      </div>
    </Transition>

    <!-- Intensity gauge -->
    <Transition name="fade">
      <div v-if="selected.emotion" class="space-y-2">
        <div class="flex items-baseline justify-between">
          <p class="text-xs font-semibold text-ink-400 uppercase tracking-wider">Интенсивность</p>
          <span class="font-display text-4xl font-bold tabular-nums leading-none" :class="intensityColor">
            {{ selected.intensity }}
          </span>
        </div>
        <div
          ref="sliderEl"
          class="relative h-14 rounded-2xl overflow-hidden cursor-pointer select-none touch-none"
          @pointerdown="onSliderDown"
        >
          <!-- Gradient bg -->
          <div class="absolute inset-0 rounded-2xl" :style="sliderGradient" />
          <!-- Fill -->
          <div
            class="absolute inset-y-0 left-0 rounded-2xl transition-[width] duration-75"
            :style="{ width: fillWidth, ...sliderFillGradient }"
          />
          <!-- Scale labels -->
          <div class="absolute inset-0 flex items-center">
            <div
              v-for="n in 11"
              :key="n"
              class="flex-1 flex items-center justify-center"
            >
              <span
                class="text-[11px] font-bold transition-all duration-150 relative z-10"
                :class="n - 1 <= selected.intensity ? 'text-white drop-shadow-sm scale-110' : 'text-ink-400/60'"
              >
                {{ n - 1 }}
              </span>
            </div>
          </div>
          <!-- Thumb indicator -->
          <div
            class="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-7 h-7 rounded-full bg-white shadow-lg ring-2 transition-[left] duration-75 z-20"
            :class="intensityRing"
            :style="{ left: fillWidth }"
          />
        </div>
        <div class="flex justify-between text-[10px] text-ink-400 px-1">
          <span>спокойствие</span>
          <span>максимум</span>
        </div>
      </div>
    </Transition>

    <!-- Note -->
    <Transition name="fade">
      <div v-if="selected.emotion">
        <textarea
          v-model="selected.note"
          placeholder="Что произошло? (необязательно)"
          rows="2"
          class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm placeholder:text-ink-400 resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100 transition-colors"
        />
      </div>
    </Transition>

    <!-- Time Capsule -->
    <Transition name="fade">
      <div v-if="selected.emotion" class="space-y-2">
        <label class="flex items-center gap-3 cursor-pointer px-1">
          <input
            type="checkbox"
            v-model="selected.isTimeCapsule"
            class="w-4 h-4 rounded border-ink-300 text-violet-500 focus:ring-violet-300 transition-colors"
          />
          <span class="text-sm text-ink-600 font-medium">Капсула времени</span>
          <span class="text-xs text-ink-400">— запечатать до определённой даты</span>
        </label>
        <Transition name="fade">
          <div v-if="selected.isTimeCapsule" class="pl-7">
            <input
              type="date"
              v-model="selected.capsuleRevealDate"
              :min="tomorrowStr"
              class="rounded-lg border border-ink-200 px-3 py-1.5 text-sm text-ink-700 focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-100 transition-colors"
            />
          </div>
        </Transition>
      </div>
    </Transition>

    <!-- Submit -->
    <Transition name="fade">
      <button
        v-if="selected.emotion"
        @click="submit"
        :disabled="submitting || (selected.isTimeCapsule && !selected.capsuleRevealDate)"
        class="w-full py-3.5 rounded-2xl font-semibold text-sm text-white shadow-md hover:shadow-lg transition-all duration-200 active:scale-[0.98] disabled:opacity-50"
        :class="activeCat?.submitBg || 'bg-terra-500 hover:bg-terra-600'"
      >
        {{ submitting ? 'Сохраняю...' : selected.isTimeCapsule ? 'Запечатать капсулу' : 'Записать эмоцию' }}
      </button>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, computed, ref } from 'vue'

const emit = defineEmits(['submit'])
const submitting = ref(false)
const customEmotion = ref('')
const sliderEl = ref(null)

const selected = reactive({ category: null, emotion: '', intensity: 5, note: '', isTimeCapsule: false, capsuleRevealDate: '' })

const tomorrowStr = (() => {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0, 10)
})()

const categories = [
  {
    key: 'joy', label: 'Радость', emoji: '\u2728',
    bg: 'bg-gradient-to-br from-gold-200 to-gold-300/60',
    border: 'border-gold-500', text: 'text-gold-600', dot: 'bg-gold-500',
    pill: 'border-gold-300 bg-gold-200/40 text-gold-600 hover:bg-gold-200',
    pillActive: 'border-gold-500 bg-gold-500 text-white shadow-sm',
    submitBg: 'bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-600 hover:to-gold-600',
  },
  {
    key: 'sadness', label: 'Грусть', emoji: '\uD83D\uDCA7',
    bg: 'bg-gradient-to-br from-sky-300/50 to-sky-400/30',
    border: 'border-sky-500', text: 'text-sky-600', dot: 'bg-sky-500',
    pill: 'border-sky-300 bg-sky-300/30 text-sky-600 hover:bg-sky-300/50',
    pillActive: 'border-sky-500 bg-sky-500 text-white shadow-sm',
    submitBg: 'bg-gradient-to-r from-sky-500 to-sky-600 hover:from-sky-600 hover:to-sky-600',
  },
  {
    key: 'anger', label: 'Злость', emoji: '\uD83D\uDD25',
    bg: 'bg-gradient-to-br from-rose-300/50 to-rose-400/30',
    border: 'border-rose-500', text: 'text-rose-600', dot: 'bg-rose-500',
    pill: 'border-rose-300 bg-rose-300/30 text-rose-600 hover:bg-rose-300/50',
    pillActive: 'border-rose-500 bg-rose-500 text-white shadow-sm',
    submitBg: 'bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-600 hover:to-rose-600',
  },
  {
    key: 'anxiety', label: 'Тревога', emoji: '\uD83C\uDF00',
    bg: 'bg-gradient-to-br from-coral-300/50 to-coral-400/30',
    border: 'border-coral-500', text: 'text-coral-600', dot: 'bg-coral-500',
    pill: 'border-coral-300 bg-coral-300/30 text-coral-600 hover:bg-coral-300/50',
    pillActive: 'border-coral-500 bg-coral-500 text-white shadow-sm',
    submitBg: 'bg-gradient-to-r from-coral-500 to-coral-600 hover:from-coral-600 hover:to-coral-600',
  },
  {
    key: 'fear', label: 'Страх', emoji: '\uD83D\uDCA8',
    bg: 'bg-gradient-to-br from-violet-300/50 to-violet-400/30',
    border: 'border-violet-500', text: 'text-violet-600', dot: 'bg-violet-500',
    pill: 'border-violet-300 bg-violet-300/30 text-violet-600 hover:bg-violet-300/50',
    pillActive: 'border-violet-500 bg-violet-500 text-white shadow-sm',
    submitBg: 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-600',
  },
  {
    key: 'disgust', label: 'Отвращение', emoji: '\uD83C\uDF43',
    bg: 'bg-gradient-to-br from-forest-200/60 to-forest-300/40',
    border: 'border-forest-500', text: 'text-forest-700', dot: 'bg-forest-600',
    pill: 'border-forest-300 bg-forest-200/40 text-forest-700 hover:bg-forest-200/60',
    pillActive: 'border-forest-600 bg-forest-600 text-white shadow-sm',
    submitBg: 'bg-gradient-to-r from-forest-600 to-forest-700 hover:from-forest-700 hover:to-forest-700',
  },
]

const emotionMap = {
  joy: ['Радость', 'Счастье', 'Восторг', 'Благодарность', 'Надежда', 'Вдохновение', 'Любовь', 'Удовольствие'],
  sadness: ['Грусть', 'Тоска', 'Одиночество', 'Разочарование', 'Печаль', 'Ностальгия'],
  anger: ['Злость', 'Раздражение', 'Гнев', 'Обида', 'Возмущение', 'Фрустрация'],
  anxiety: ['Тревога', 'Волнение', 'Напряжение', 'Нервозность', 'Стресс', 'Беспокойство'],
  fear: ['Страх', 'Паника', 'Ужас', 'Неуверенность', 'Опасение', 'Замешательство'],
  disgust: ['Отвращение', 'Презрение', 'Скука', 'Неприязнь', 'Апатия'],
}

const suggestedEmotions = computed(() => emotionMap[selected.category] || [])
const activeCat = computed(() => categories.find(c => c.key === selected.category))

const fillWidth = computed(() => `${Math.max(2, selected.intensity * 10)}%`)

const sliderGradient = { background: 'linear-gradient(90deg, #95D5B2 0%, #F0D98C 50%, #E07A5F 100%)', opacity: 0.2 }
const sliderFillGradient = computed(() => ({
  background: `linear-gradient(90deg, #52B788 0%, #E3C06A 50%, #E07A5F 100%)`,
}))

const intensityColor = computed(() => {
  if (selected.intensity <= 3) return 'text-forest-500'
  if (selected.intensity <= 6) return 'text-gold-600'
  return 'text-coral-500'
})
const intensityRing = computed(() => {
  if (selected.intensity <= 3) return 'ring-forest-400'
  if (selected.intensity <= 6) return 'ring-gold-500'
  return 'ring-coral-500'
})

function selectCategory(key) {
  selected.category = key
  selected.emotion = ''
  customEmotion.value = ''
}

function selectEmotion(name) {
  selected.emotion = name
  customEmotion.value = ''
}

function onSliderDown(e) {
  updateSlider(e)
  const onMove = (ev) => { ev.preventDefault(); updateSlider(ev) }
  const onUp = () => {
    document.removeEventListener('pointermove', onMove)
    document.removeEventListener('pointerup', onUp)
  }
  document.addEventListener('pointermove', onMove)
  document.addEventListener('pointerup', onUp)
}

function updateSlider(e) {
  if (!sliderEl.value) return
  const rect = sliderEl.value.getBoundingClientRect()
  const x = (e.clientX ?? e.touches?.[0]?.clientX ?? 0) - rect.left
  const ratio = Math.max(0, Math.min(1, x / rect.width))
  selected.intensity = Math.round(ratio * 10)
}

async function submit() {
  if (!selected.emotion || submitting.value) return
  if (selected.isTimeCapsule && !selected.capsuleRevealDate) return
  submitting.value = true
  try {
    const payload = {
      emotionCategory: selected.category,
      emotion: selected.emotion,
      intensity: selected.intensity,
      note: selected.note || undefined,
      isTimeCapsule: selected.isTimeCapsule || false,
    }
    if (selected.isTimeCapsule && selected.capsuleRevealDate) {
      payload.capsuleRevealDate = selected.capsuleRevealDate
    }
    await emit('submit', payload)
    selected.category = null
    selected.emotion = ''
    selected.intensity = 5
    selected.note = ''
    selected.isTimeCapsule = false
    selected.capsuleRevealDate = ''
    customEmotion.value = ''
  } finally {
    submitting.value = false
  }
}
</script>
