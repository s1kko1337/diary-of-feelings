<template>
  <div class="home">
    <!-- Background orbs -->
    <div class="orb orb--1" />
    <div class="orb orb--2" />
    <div class="orb orb--3" />

    <!-- Greeting -->
    <section ref="heroEl" class="hero" style="opacity: 0">
      <p class="hero-time">{{ todayFormatted }}</p>
      <h1 class="hero-greeting">{{ greeting }}</h1>
      <p class="hero-sub">{{ motivationalPhrase }}</p>
    </section>

    <!-- Quick stats strip -->
    <div ref="statsEl" class="stats-strip" style="opacity: 0">
      <div class="stat-chip">
        <FlameIcon
          :size="15"
          :stroke-width="1.8"
          class="stat-icon flame"
        />
        <span class="stat-val">{{ streakCount }}</span>
        <span class="stat-label">дней подряд</span>
      </div>
      <div class="stat-divider" />
      <div v-if="lastEmotion" class="stat-chip">
        <span class="stat-emoji">{{ lastEmotion.emoji }}</span>
        <span class="stat-label">{{ lastEmotion.label }}</span>
      </div>
      <button
        v-else
        class="stat-chip stat-cta"
        @click="navigateToEmotions"
      >
        <span class="stat-emoji">?</span>
        <span class="stat-label stat-label--cta">Как ты?</span>
      </button>
    </div>

    <!-- Portrait badge -->
    <PortraitBadge
      v-if="recStore.portrait"
      :portrait="recStore.portrait"
    />

    <!-- Tree Graph -->
    <section
      ref="treeEl"
      class="tree-section"
      style="opacity: 0"
    >
      <p class="tree-question">Куда идём?</p>

      <div class="tree-wrap">
        <svg
          class="tree-svg"
          viewBox="0 0 320 200"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <!-- Trunk -->
          <path
            d="M160,0 L160,80"
            stroke="url(#trunkGrad)"
            stroke-width="3"
            stroke-linecap="round"
          />
          <!-- Left branch -->
          <path
            ref="leftBranchEl"
            d="M160,80 C160,110 80,115 80,150"
            stroke="url(#leftGrad)"
            stroke-width="2.5"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Right branch -->
          <path
            ref="rightBranchEl"
            d="M160,80 C160,110 240,115 240,150"
            stroke="url(#rightGrad)"
            stroke-width="2.5"
            stroke-linecap="round"
            fill="none"
          />
          <!-- Root glow -->
          <circle cx="160" cy="80" r="8" fill="#6366f1" opacity="0.25" />
          <circle cx="160" cy="80" r="4" fill="#6366f1" />

          <defs>
            <linearGradient id="trunkGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" stop-opacity="0.2" />
              <stop offset="100%" stop-color="#6366f1" />
            </linearGradient>
            <linearGradient id="leftGrad" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#6366f1" />
              <stop offset="100%" stop-color="#a78bfa" />
            </linearGradient>
            <linearGradient id="rightGrad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stop-color="#6366f1" />
              <stop offset="100%" stop-color="#f0b8c0" />
            </linearGradient>
          </defs>
        </svg>

        <!-- Branch nodes -->
        <button
          ref="leftNodeEl"
          class="branch-node branch-node--tasks"
          style="opacity: 0"
          @click="navigateToTasks"
        >
          <div class="branch-node-icon tasks-icon">
            <CheckSquareIcon :size="22" :stroke-width="1.6" />
          </div>
          <span class="branch-node-label">
            Задачи
            <span v-if="todayTaskCount > 0" class="badge">
              ({{ todayTaskCount }})
            </span>
          </span>
          <span class="branch-node-sub">планы · заметки · база</span>
        </button>

        <button
          ref="rightNodeEl"
          class="branch-node branch-node--emotions"
          style="opacity: 0"
          @click="navigateToEmotions"
        >
          <div class="branch-node-icon emotions-icon">
            <HeartIcon :size="22" :stroke-width="1.6" />
          </div>
          <span class="branch-node-label">Эмоции</span>
          <span class="branch-node-sub">
            <template v-if="todayEmotionEmoji">
              {{ todayEmotionEmoji }} сегодня
            </template>
            <template v-else>
              дневник · КПТ · ИИ
            </template>
          </span>
        </button>
      </div>
    </section>

    <!-- Article recommendations -->
    <RecommendationsWidget />

    <!-- FAB -->
    <div class="fab-container">
      <Transition name="fab-backdrop">
        <div
          v-if="fabOpen"
          class="fab-backdrop"
          @click="closeFab"
        />
      </Transition>

      <Transition name="fab-option-up">
        <button
          v-if="fabOpen"
          class="fab-option fab-option--top"
          @click="fabGoToTasks"
        >
          <CheckSquareIcon :size="16" :stroke-width="1.8" />
          <span>Задача</span>
        </button>
      </Transition>

      <Transition name="fab-option-up">
        <button
          v-if="fabOpen"
          class="fab-option fab-option--mid"
          @click="fabGoToEmotions"
        >
          <HeartIcon :size="16" :stroke-width="1.8" />
          <span>Эмоция</span>
        </button>
      </Transition>

      <button
        class="fab-button"
        :class="{ 'fab-button--open': fabOpen }"
        @click="toggleFab"
      >
        <PlusIcon :size="22" :stroke-width="2" />
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import {
  CheckSquareIcon,
  HeartIcon,
  FlameIcon,
  PlusIcon,
} from 'lucide-vue-next'
import { useAuthStore } from '@/stores/auth'
import { useTasksStore } from '@/stores/tasks'
import { useEmotionsStore } from '@/stores/emotions'
import { useRecommendationsStore } from '@/stores/recommendations'
import { getEmotion } from '@/api/mock/data/emotions-wheel'
import RecommendationsWidget from '@/components/home/RecommendationsWidget.vue'
import PortraitBadge from '@/components/home/PortraitBadge.vue'
import gsap from 'gsap'

const router = useRouter()
const authStore = useAuthStore()
const tasksStore = useTasksStore()
const emotionsStore = useEmotionsStore()
const recStore = useRecommendationsStore()

// Template refs
const heroEl = ref(null)
const statsEl = ref(null)
const treeEl = ref(null)
const leftBranchEl = ref(null)
const rightBranchEl = ref(null)
const leftNodeEl = ref(null)
const rightNodeEl = ref(null)

// FAB state
const fabOpen = ref(false)

function toggleFab() {
  fabOpen.value = !fabOpen.value
}

function closeFab() {
  fabOpen.value = false
}

function fabGoToTasks() {
  fabOpen.value = false
  router.push({ name: 'tasks' })
}

function fabGoToEmotions() {
  fabOpen.value = false
  router.push({ name: 'emotions' })
}

// Today's date string for comparisons
const todayStr = new Date().toISOString().slice(0, 10)

// Today's task count
const todayTaskCount = computed(() =>
  tasksStore.tasks.filter((t) => t.date === todayStr).length,
)

// Today's emotion emoji for the branch node subtitle
const todayEmotionEmoji = computed(() => {
  const entry = emotionsStore.todayEntries[0]
  if (!entry) return null
  const info = getEmotion(entry.emotion)
  return info?.emoji ?? null
})

// Last recorded emotion for the stats strip
const lastEmotion = computed(() => {
  const entry = emotionsStore.history[0]
    ?? emotionsStore.todayEntries[0]
  if (!entry) return null
  const info = getEmotion(entry.emotion)
  if (!info) return null
  return { emoji: info.emoji, label: info.label }
})

// Streak: consecutive days with emotion entries ending today
const streakCount = computed(() => {
  const all = emotionsStore.history
  if (!all.length) return 0

  // Collect unique dates
  const dates = new Set(all.map((e) => e.date))

  // Count consecutive days backwards from today
  let count = 0
  const day = new Date()
   
  while (true) {
    const ds = day.toISOString().slice(0, 10)
    if (!dates.has(ds)) break
    count++
    day.setDate(day.getDate() - 1)
  }
  return count
})

// Greeting based on time of day
const greeting = computed(() => {
  const hour = new Date().getHours()
  let text = hour < 6
    ? 'Доброй ночи'
    : hour < 12
      ? 'Доброе утро'
      : hour < 18
        ? 'Добрый день'
        : 'Добрый вечер'
  return authStore.userName
    ? `${text}, ${authStore.userName}`
    : text
})

const todayFormatted = computed(() =>
  new Date().toLocaleDateString('ru-RU', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }),
)

const phrases = [
  'Каждый день -- это шанс быть добрее к себе',
  'Ты заслуживаешь внимания к своим чувствам',
  'Маленькие шаги тоже считаются',
  'Забота о себе -- не эгоизм, а необходимость',
  'Сегодня хороший день, чтобы начать',
  'Ты не обязан быть идеальным, достаточно быть собой',
  'Иногда лучшее, что можно сделать -- просто быть',
  'Разреши себе отдохнуть без чувства вины',
  'Твои чувства важны, даже когда они сложные',
  'Один маленький шаг сегодня -- большой путь завтра',
  'Ты уже делаешь больше, чем думаешь',
  'Нормально не знать все ответы прямо сейчас',
  'Тишина -- тоже ответ. Прислушайся к себе',
  'Дай себе столько времени, сколько нужно',
  'Каждое утро -- чистая страница',
  'Быть уязвимым -- это тоже сила',
  'Ты достоин того хорошего, что с тобой происходит',
  'Не сравнивай свою жизнь с чужими историями',
  'Прогресс -- не прямая линия, и это нормально',
  'Позволь сегодняшнему дню быть достаточным',
  'Твоё спокойствие важнее чужих ожиданий',
  'Ошибки -- это часть пути, а не конец дороги',
  'Сделай глубокий вдох. Ты справляешься',
  'Даже облачный день не отменяет солнца',
  'Бережное отношение к себе -- основа всего',
  'Ты растёшь, даже когда кажется, что стоишь на месте',
  'Благодарность за мелочи меняет всё',
  'Не торопись. Хорошее приходит в своё время',
  'Сегодня ты -- ближе к себе, чем вчера',
  'Каждый момент осознанности -- это победа',
  'Нежность к себе -- не слабость, а мудрость',
  'Ты заслуживаешь паузу в бесконечной гонке',
]
const motivationalPhrase = computed(
  () => phrases[new Date().getDate() % phrases.length],
)

// Navigation
function navigateToTasks() {
  router.push({ name: 'tasks' })
}

function navigateToEmotions() {
  router.push({ name: 'emotions' })
}

// Load data and run animations on mount
onMounted(async () => {
  // Load store data (non-blocking for animations)
  Promise.all([
    tasksStore.fetchTasks(),
    emotionsStore.loadToday(),
    emotionsStore.loadHistory(),
    recStore.fetchToday(),
    recStore.fetchPortrait(),
  ]).catch(() => {
    // Silently handle -- home page degrades gracefully
  })

  // GSAP entrance animation
  const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

  tl.to(heroEl.value, { opacity: 1, y: 0, duration: 0.6 }, 0)
  tl.to(
    statsEl.value,
    { opacity: 1, y: 0, duration: 0.5 },
    0.25,
  )
  tl.to(treeEl.value, { opacity: 1, duration: 0.4 }, 0.4)

  // Draw branches
  const ll = leftBranchEl.value.getTotalLength()
  const rl = rightBranchEl.value.getTotalLength()
  gsap.set(
    [leftBranchEl.value, rightBranchEl.value],
    (i) => ({
      strokeDasharray: i === 0 ? ll : rl,
      strokeDashoffset: i === 0 ? ll : rl,
    }),
  )
  tl.to(
    leftBranchEl.value,
    { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' },
    0.5,
  )
  tl.to(
    rightBranchEl.value,
    { strokeDashoffset: 0, duration: 0.7, ease: 'power2.inOut' },
    0.6,
  )

  tl.to(
    leftNodeEl.value,
    { opacity: 1, scale: 1, y: 0, duration: 0.4 },
    1.1,
  )
  tl.to(
    rightNodeEl.value,
    { opacity: 1, scale: 1, y: 0, duration: 0.4 },
    1.2,
  )
})
</script>

<style scoped>
.home {
  min-height: calc(100dvh - var(--bottom-nav-height, 64px));
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2rem;
  padding: 2.5rem 1rem 2rem;
  position: relative;
  overflow: hidden;
}

/* Background orbs */
.orb {
  position: fixed;
  border-radius: 50%;
  filter: blur(70px);
  opacity: 0.28;
  pointer-events: none;
  z-index: 0;
}
.orb--1 {
  width: 350px;
  height: 350px;
  background: #c4b5e0;
  top: -80px;
  right: -80px;
  animation: drift 24s ease-in-out infinite alternate;
}
.orb--2 {
  width: 250px;
  height: 250px;
  background: #a8dfc8;
  bottom: 80px;
  left: -60px;
  animation: drift 20s ease-in-out infinite alternate-reverse;
}
.orb--3 {
  width: 180px;
  height: 180px;
  background: #f8c9a0;
  top: 40%;
  right: 10%;
  animation: drift 28s ease-in-out infinite alternate;
}
@keyframes drift {
  from { transform: translate(0, 0) scale(1); }
  to { transform: translate(24px, 18px) scale(1.06); }
}

/* Hero */
.hero {
  text-align: center;
  position: relative;
  z-index: 1;
}
.hero-time {
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.07em;
  text-transform: uppercase;
  color: #6366f1;
  margin: 0 0 0.5rem;
}
.hero-greeting {
  font-size: clamp(2rem, 7vw, 2.8rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  color: var(--color-text, #1a1714);
  margin: 0 0 0.6rem;
}
.hero-sub {
  font-size: 0.9rem;
  color: var(--color-text-secondary, rgba(26, 23, 20, 0.55));
  font-style: italic;
  line-height: 1.5;
  margin: 0;
  max-width: 280px;
}

/* Stats strip */
.stats-strip {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.7rem 1.4rem;
  background: rgba(255, 255, 255, 0.6);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 50px;
  box-shadow: 0 2px 16px rgba(100, 80, 160, 0.08);
  position: relative;
  z-index: 1;
}
.stat-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.stat-cta {
  cursor: pointer;
  border: none;
  background: none;
  padding: 0;
  transition: opacity 0.2s ease;
}
.stat-cta:hover {
  opacity: 0.7;
}
.stat-label--cta {
  color: #6366f1;
  font-weight: 600;
}
.stat-icon { color: #f59e0b; }
.stat-emoji { font-size: 1rem; }
.stat-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text, #1a1714);
}
.stat-label {
  font-size: 0.78rem;
  color: var(--color-text-secondary, rgba(26, 23, 20, 0.55));
}
.stat-divider {
  width: 1px;
  height: 20px;
  background: rgba(0, 0, 0, 0.1);
}

/* Tree section */
.tree-section {
  width: 100%;
  max-width: 360px;
  position: relative;
  z-index: 1;
}
.tree-question {
  text-align: center;
  font-size: 0.78rem;
  font-weight: 600;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.35));
  margin: 0 0 0.5rem;
}
.tree-wrap {
  position: relative;
}
.tree-svg {
  width: 100%;
  height: auto;
  display: block;
}

/* Branch nodes */
.branch-node {
  position: absolute;
  bottom: -8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  padding: 1rem 1.2rem;
  border-radius: 18px;
  border: 1.5px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.65);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 24px rgba(100, 80, 160, 0.1);
  cursor: pointer;
  text-align: center;
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    border-color 0.25s ease;
  width: 130px;
}
.branch-node:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 32px rgba(100, 80, 160, 0.18);
}
.branch-node:active {
  transform: scale(0.96);
}
.branch-node--tasks { left: 0; }
.branch-node--emotions { right: 0; }

.branch-node-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.tasks-icon {
  background: rgba(99, 102, 241, 0.12);
  color: #6366f1;
}
.emotions-icon {
  background: rgba(240, 184, 192, 0.3);
  color: #e05c7a;
}

.branch-node-label {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text, #1a1714);
  letter-spacing: -0.02em;
}
.badge {
  font-weight: 600;
  font-size: 0.78rem;
  color: #6366f1;
}
.branch-node-sub {
  font-size: 0.68rem;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.4));
  white-space: nowrap;
}

/* FAB */
.fab-container {
  position: fixed;
  bottom: calc(64px + 1rem);
  right: 1rem;
  z-index: 50;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.6rem;
}

.fab-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.15);
  z-index: 49;
}

.fab-button {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: #6366f1;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 4px 20px rgba(99, 102, 241, 0.35);
  transition:
    transform 0.25s ease,
    box-shadow 0.25s ease,
    background 0.25s ease;
  z-index: 51;
  position: relative;
}
.fab-button:hover {
  box-shadow: 0 6px 28px rgba(99, 102, 241, 0.45);
  transform: scale(1.05);
}
.fab-button--open {
  transform: rotate(45deg);
  background: #4f46e5;
}
.fab-button--open:hover {
  transform: rotate(45deg) scale(1.05);
}

.fab-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: 50px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  box-shadow: 0 4px 16px rgba(100, 80, 160, 0.12);
  cursor: pointer;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--color-text, #1a1714);
  white-space: nowrap;
  z-index: 51;
  position: relative;
  transition:
    transform 0.15s ease,
    box-shadow 0.15s ease;
}
.fab-option:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(100, 80, 160, 0.18);
}
.fab-option--top {
  /* Positioned via flex order, no extra offset needed */
}
.fab-option--mid {
  /* Positioned via flex order */
}

/* FAB transitions */
.fab-backdrop-enter-active,
.fab-backdrop-leave-active {
  transition: opacity 0.2s ease;
}
.fab-backdrop-enter-from,
.fab-backdrop-leave-to {
  opacity: 0;
}

.fab-option-up-enter-active {
  transition:
    opacity 0.2s ease,
    transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.fab-option-up-leave-active {
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;
}
.fab-option-up-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}
.fab-option-up-leave-to {
  opacity: 0;
  transform: translateY(8px) scale(0.95);
}
</style>
