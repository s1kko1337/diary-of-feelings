<template>
  <div class="onboarding">
    <OnboardingProgress :current="step" :total="totalSteps" />

    <!-- Step 1: Welcome + Name -->
    <OnboardingStep
      v-if="step === 1"
      title="Привет!"
      subtitle="Как тебя зовут? Это поможет сделать общение теплее."
    >
      <template #icon>
        <div class="welcome-orb" />
      </template>
      <input
        v-model="answers.name"
        type="text"
        class="name-input"
        placeholder="Твоё имя"
        maxlength="30"
        @keydown.enter="nextStep"
      />
    </OnboardingStep>

    <!-- Step 2: Difficulties -->
    <OnboardingStep
      v-if="step === 2"
      title="Что тебя беспокоит?"
      subtitle="Выбери то, что актуально сейчас. Можно несколько."
    >
      <template #icon>
        <HeartIcon :size="32" :stroke-width="1.5" />
      </template>
      <TopicSelector v-model="answers.difficulties" :options="difficultiesOptions" />
    </OnboardingStep>

    <!-- Step 3: Goals -->
    <OnboardingStep v-if="step === 3" title="Чего хочется?" subtitle="Что ты ждёшь от дневника?">
      <template #icon>
        <TargetIcon :size="32" :stroke-width="1.5" />
      </template>
      <TopicSelector v-model="answers.goals" :options="goalsOptions" />
    </OnboardingStep>

    <!-- Step 4: Day type -->
    <OnboardingStep
      v-if="step === 4"
      title="Когда удобнее?"
      subtitle="Когда тебе комфортнее рефлексировать?"
    >
      <template #icon>
        <SunriseIcon :size="32" :stroke-width="1.5" />
      </template>
      <OptionSelector v-model="answers.dayType" :options="dayTypeOptions" />
    </OnboardingStep>

    <!-- Step 5: Topics -->
    <OnboardingStep
      v-if="step === 5"
      title="Интересные темы"
      subtitle="О чём хочется читать и думать?"
    >
      <template #icon>
        <BookOpenIcon :size="32" :stroke-width="1.5" />
      </template>
      <TopicSelector v-model="answers.topics" :options="topicsOptions" />
    </OnboardingStep>

    <!-- Step 6: Feedback style -->
    <OnboardingStep
      v-if="step === 6"
      title="Стиль общения"
      subtitle="Как тебе комфортнее получать обратную связь?"
    >
      <template #icon>
        <MessageCircleIcon :size="32" :stroke-width="1.5" />
      </template>
      <OptionSelector v-model="answers.feedbackStyle" :options="feedbackOptions" />
    </OnboardingStep>

    <!-- Navigation -->
    <div class="nav-row">
      <button v-if="step > 1" class="nav-btn nav-btn--back" @click="prevStep">
        <ArrowLeftIcon :size="16" :stroke-width="2" />
        Назад
      </button>
      <div v-else />
      <button class="nav-btn nav-btn--next" :disabled="!canProceed" @click="nextStep">
        {{ step === totalSteps ? 'Начать' : 'Дальше' }}
        <ArrowRightIcon :size="16" :stroke-width="2" />
      </button>
    </div>

    <!-- Skip -->
    <button v-if="step < totalSteps" class="skip-btn" @click="handleSkip">Пропустить всё</button>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  HeartIcon,
  TargetIcon,
  SunriseIcon,
  BookOpenIcon,
  MessageCircleIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'
import OnboardingStep from '@/components/onboarding/OnboardingStep.vue'
import OnboardingProgress from '@/components/onboarding/OnboardingProgress.vue'
import TopicSelector from '@/components/onboarding/TopicSelector.vue'
import OptionSelector from '@/components/onboarding/OptionSelector.vue'

const router = useRouter()
const userStore = useUserStore()

const totalSteps = 6
const step = ref(1)

const answers = ref({
  name: '',
  difficulties: [],
  goals: [],
  dayType: null,
  topics: [],
  feedbackStyle: null,
})

const difficultiesOptions = [
  { value: 'stress', emoji: '\u{1F62E}\u200D\u{1F4A8}', label: 'Стресс' },
  { value: 'anxiety', emoji: '\u{1F630}', label: 'Тревожность' },
  { value: 'relationships', emoji: '\u{1F465}', label: 'Отношения' },
  { value: 'work', emoji: '\u{1F4BC}', label: 'Работа' },
  { value: 'health', emoji: '\u{1F3CB}\uFE0F', label: 'Здоровье' },
  { value: 'meaning', emoji: '\u{1F50D}', label: 'Поиск смысла' },
  { value: 'sleep', emoji: '\u{1F634}', label: 'Сон' },
  { value: 'self-esteem', emoji: '\u{1F49B}', label: 'Самооценка' },
]

const goalsOptions = [
  { value: 'calm', emoji: '\u{1F9D8}', label: 'Спокойствие' },
  { value: 'self-understanding', emoji: '\u{1F52E}', label: 'Понять себя' },
  { value: 'inspiration', emoji: '\u{2728}', label: 'Вдохновение' },
  { value: 'growth', emoji: '\u{1F331}', label: 'Рост' },
  { value: 'habits', emoji: '\u{1F504}', label: 'Привычки' },
  { value: 'gratitude', emoji: '\u{1F64F}', label: 'Благодарность' },
]

const dayTypeOptions = [
  {
    value: 'morning',
    emoji: '\u{1F305}',
    label: 'Утро',
    description: 'Планировать день и настраиваться',
  },
  {
    value: 'evening',
    emoji: '\u{1F307}',
    label: 'Вечер',
    description: 'Рефлексировать и подводить итоги',
  },
]

const topicsOptions = [
  { value: 'emotions', emoji: '\u{1F49C}', label: 'Эмоции' },
  { value: 'relationships', emoji: '\u{1F91D}', label: 'Отношения' },
  { value: 'work', emoji: '\u{1F4A1}', label: 'Работа и карьера' },
  { value: 'meaning', emoji: '\u{1F30C}', label: 'Смысл жизни' },
  { value: 'health', emoji: '\u{1F33F}', label: 'Здоровье' },
  { value: 'growth', emoji: '\u{1F4DA}', label: 'Саморазвитие' },
  { value: 'creativity', emoji: '\u{1F3A8}', label: 'Творчество' },
]

const feedbackOptions = [
  {
    value: 'gentle',
    emoji: '\u{1F338}',
    label: 'Мягко',
    description: 'Бережно и с поддержкой',
  },
  {
    value: 'direct',
    emoji: '\u{1F3AF}',
    label: 'Прямо',
    description: 'Честно и по существу',
  },
  {
    value: 'motivating',
    emoji: '\u{1F525}',
    label: 'Мотивирующе',
    description: 'С энергией и вдохновением',
  },
]

const canProceed = computed(() => {
  if (step.value === 1) return answers.value.name.trim().length > 0
  if (step.value === 4) return answers.value.dayType !== null
  if (step.value === 6) return answers.value.feedbackStyle !== null
  return true
})

function nextStep() {
  if (!canProceed.value) return
  if (step.value < totalSteps) {
    step.value++
  } else {
    finishOnboarding()
  }
}

function prevStep() {
  if (step.value > 1) step.value--
}

async function finishOnboarding() {
  await userStore.completeOnboarding(answers.value)
  router.push('/')
}

async function handleSkip() {
  await userStore.completeOnboarding({
    name: answers.value.name || '',
    difficulties: [],
    goals: [],
    dayType: 'evening',
    topics: [],
    feedbackStyle: 'gentle',
  })
  router.push('/')
}
</script>

<style scoped>
.onboarding {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-height: 70vh;
  padding: 2rem 0;
}

.welcome-orb {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-lavender), var(--color-peach), var(--color-mint));
  box-shadow:
    0 8px 32px rgb(184 165 216 / 0.3),
    0 0 60px rgb(184 165 216 / 0.15);
  animation: pulse-soft 4s ease-in-out infinite;
}

@keyframes pulse-soft {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

.name-input {
  width: 100%;
  padding: 14px 20px;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: 1rem;
  font-family: var(--font-main);
  text-align: center;
  outline: none;
  transition: all 0.2s ease;
}

.name-input::placeholder {
  color: var(--color-text-muted);
}

.name-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-soft);
}

/* Navigation */
.nav-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 400px;
  margin-top: 2rem;
  gap: 12px;
}

.nav-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 12px 24px;
  border-radius: var(--radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  font-family: var(--font-main);
  cursor: pointer;
  transition: all 0.2s ease;
  border: none;
}

.nav-btn--back {
  background: var(--color-surface);
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
}

.nav-btn--back:hover {
  color: var(--color-text);
}

.nav-btn--next {
  background: var(--color-primary);
  color: white;
  margin-left: auto;
}

.nav-btn--next:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-card);
}

.nav-btn--next:disabled {
  opacity: 0.4;
  pointer-events: none;
}

.skip-btn {
  margin-top: 1.5rem;
  padding: 8px 16px;
  background: none;
  border: none;
  font-size: 0.8rem;
  font-family: var(--font-main);
  color: var(--color-text-muted);
  cursor: pointer;
  transition: color 0.2s ease;
}

.skip-btn:hover {
  color: var(--color-text-secondary);
}
</style>
