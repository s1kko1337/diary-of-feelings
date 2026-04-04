<template>
  <BaseModal :modelValue="open" @update:modelValue="$emit('close')" title="Запись КПТ" size="lg">
    <div class="space-y-5">
      <!-- Step indicator -->
      <div class="flex gap-1">
        <div
          v-for="s in steps.length"
          :key="s"
          class="flex-1 h-1 rounded-full transition-colors"
          :class="s - 1 <= step ? 'bg-terra-500' : 'bg-ink-200'"
        />
      </div>

      <p class="text-sm font-medium text-ink-500">{{ steps[step].title }}</p>

      <!-- Step 0: Situation -->
      <div v-if="step === 0">
        <textarea
          v-model="form.situation"
          :placeholder="steps[0].placeholder"
          rows="4"
          class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        />
      </div>

      <!-- Step 1: Thoughts -->
      <div v-if="step === 1">
        <textarea
          v-model="form.thoughts"
          :placeholder="steps[1].placeholder"
          rows="4"
          class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        />
      </div>

      <!-- Step 2: Emotions -->
      <div v-if="step === 2" class="space-y-4">
        <!-- Added emotions list -->
        <div v-for="(em, i) in form.emotions" :key="i" class="flex items-center gap-2 bg-cream-100 rounded-xl px-3 py-2">
          <span class="flex-1 text-sm font-medium text-ink-700">{{ em.name }}</span>
          <div class="flex items-center gap-1.5">
            <button @click="em.intensity = Math.max(0, em.intensity - 1)" class="w-6 h-6 rounded-full bg-white border border-ink-200 text-ink-500 text-xs flex items-center justify-center hover:bg-ink-100">−</button>
            <span class="text-sm font-bold text-ink-700 w-5 text-center tabular-nums">{{ em.intensity }}</span>
            <button @click="em.intensity = Math.min(10, em.intensity + 1)" class="w-6 h-6 rounded-full bg-white border border-ink-200 text-ink-500 text-xs flex items-center justify-center hover:bg-ink-100">+</button>
          </div>
          <button @click="form.emotions.splice(i, 1)" class="text-ink-400 hover:text-rose-500 p-1 ml-1">
            <svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg>
          </button>
        </div>

        <!-- Emotion picker pills -->
        <div class="space-y-2">
          <p class="text-xs text-ink-400">Выберите эмоцию:</p>
          <div class="flex flex-wrap gap-1.5">
            <button
              v-for="name in availableEmotions"
              :key="name"
              @click="addEmotion(name)"
              class="px-3 py-1.5 rounded-lg text-xs font-medium transition-all border border-ink-200 bg-white text-ink-600 hover:bg-terra-500/10 hover:border-terra-400 hover:text-terra-600"
            >
              {{ name }}
            </button>
          </div>
        </div>
      </div>

      <!-- Step 3: Distortions -->
      <div v-if="step === 3">
        <div class="flex flex-wrap gap-2">
          <button
            v-for="d in distortionsList"
            :key="d"
            @click="toggleDistortion(d)"
            class="px-3 py-1.5 rounded-lg text-sm transition-all"
            :class="form.distortions.includes(d)
              ? 'bg-violet-500 text-white shadow-sm'
              : 'bg-cream-200 text-ink-600 hover:bg-cream-300'"
          >
            {{ d }}
          </button>
        </div>
      </div>

      <!-- Step 4: Challenging -->
      <div v-if="step === 4">
        <textarea
          v-model="form.challenging"
          :placeholder="steps[4].placeholder"
          rows="4"
          class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        />
      </div>

      <!-- Step 5: Alternative thought -->
      <div v-if="step === 5">
        <textarea
          v-model="form.alternativeThought"
          :placeholder="steps[5].placeholder"
          rows="3"
          class="w-full rounded-xl border border-ink-200 bg-white px-4 py-3 text-sm text-ink-900 placeholder:text-ink-400 resize-none focus:border-terra-400 focus:outline-none focus:ring-2 focus:ring-terra-100"
        />
      </div>
    </div>

    <template #footer>
      <div class="flex justify-between">
        <button
          v-if="step > 0"
          @click="step--"
          class="px-4 py-2 text-sm text-ink-600 hover:bg-cream-200 rounded-xl transition-colors"
        >
          Назад
        </button>
        <div v-else />
        <button
          @click="next"
          :disabled="step === 0 && !form.situation.trim()"
          class="px-5 py-2 text-sm font-medium bg-terra-500 text-white rounded-xl hover:bg-terra-600 transition-all disabled:opacity-40 shadow-sm"
        >
          {{ step === steps.length - 1 ? 'Сохранить' : 'Далее' }}
        </button>
      </div>
    </template>
  </BaseModal>
</template>

<script setup>
import { ref, reactive, computed, watch } from 'vue'
import BaseModal from '@/components/ui/BaseModal.vue'

const props = defineProps({
  open: Boolean,
  initial: { type: Object, default: null },
})
const emit = defineEmits(['save', 'close'])

const step = ref(0)
const form = reactive({
  situation: '',
  thoughts: '',
  emotions: [],
  distortions: [],
  challenging: '',
  alternativeThought: '',
})

const steps = [
  { title: 'Ситуация', placeholder: 'Опишите ситуацию, которая вызвала переживания...' },
  { title: 'Автоматические мысли', placeholder: 'Какие мысли пришли в голову в тот момент?' },
  { title: 'Эмоции', placeholder: '' },
  { title: 'Когнитивные искажения', placeholder: '' },
  { title: 'Оспаривание', placeholder: 'Как можно оспорить эти мысли? Какие факты против?' },
  { title: 'Альтернативная мысль', placeholder: 'Более сбалансированная мысль...' },
]

const allEmotions = [
  'Радость', 'Счастье', 'Благодарность', 'Надежда', 'Вдохновение',
  'Грусть', 'Тоска', 'Одиночество', 'Разочарование', 'Печаль',
  'Злость', 'Раздражение', 'Гнев', 'Обида', 'Фрустрация',
  'Тревога', 'Волнение', 'Напряжение', 'Стресс', 'Беспокойство',
  'Страх', 'Паника', 'Неуверенность', 'Опасение',
  'Отвращение', 'Скука', 'Апатия',
]

const availableEmotions = computed(() =>
  allEmotions.filter(name => !form.emotions.some(e => e.name === name))
)

function addEmotion(name) {
  form.emotions.push({ name, intensity: 5 })
}

const distortionsList = [
  'Катастрофизация',
  'Черно-белое мышление',
  'Чтение мыслей',
  'Сверхобобщение',
  'Персонализация',
  'Эмоциональное рассуждение',
  'Долженствование',
  'Навешивание ярлыков',
  'Фильтрация',
  'Преуменьшение',
]

watch(() => props.initial, (val) => {
  if (val) {
    Object.assign(form, {
      situation: val.situation || '',
      thoughts: val.thoughts || '',
      emotions: val.emotions?.length ? [...val.emotions] : [],
      distortions: val.distortions ? [...val.distortions] : [],
      challenging: val.challenging || '',
      alternativeThought: val.alternativeThought || '',
    })
  }
}, { immediate: true })

watch(() => props.open, (val) => {
  if (val && !props.initial) {
    step.value = 0
    Object.assign(form, {
      situation: '',
      thoughts: '',
      emotions: [],
      distortions: [],
      challenging: '',
      alternativeThought: '',
    })
  }
})

function toggleDistortion(d) {
  const idx = form.distortions.indexOf(d)
  if (idx === -1) form.distortions.push(d)
  else form.distortions.splice(idx, 1)
}

function next() {
  if (step.value < steps.length - 1) {
    step.value++
  } else {
    const data = {
      situation: form.situation,
      thoughts: form.thoughts || undefined,
      emotions: form.emotions.filter(e => e.name.trim()),
      distortions: form.distortions,
      challenging: form.challenging || undefined,
      alternative_thought: form.alternativeThought || undefined,
    }
    if (props.initial?.id) data.id = props.initial.id
    emit('save', data)
  }
}
</script>
