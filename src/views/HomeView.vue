<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <div class="hero-orb" />
      <p class="hero-label">{{ greeting }}</p>
      <h1 class="hero-title">Как проходит<br />твой день?</h1>
    </section>

    <!-- Quick emotion check-in -->
    <section class="glass-card-elevated card">
      <p class="card-label">Что ты чувствуешь?</p>
      <div class="emotion-grid">
        <button
          v-for="emotion in quickEmotions"
          :key="emotion.label"
          class="emotion-pill"
          :style="{ '--pill-bg': emotion.bg, '--pill-accent': emotion.accent }"
        >
          <span class="emotion-pill-emoji">{{ emotion.emoji }}</span>
          {{ emotion.label }}
        </button>
      </div>
      <router-link to="/emotions" class="card-action">
        Открыть дневник
        <ArrowRightIcon :size="14" :stroke-width="2" />
      </router-link>
    </section>

    <!-- Daily set -->
    <section class="glass-card-elevated card">
      <p class="card-label">Статьи на сегодня</p>
      <div class="articles-grid">
        <div v-for="(article, i) in articleStubs" :key="i" class="article-card">
          <div class="article-card-orb" :style="{ background: article.gradient }" />
          <span class="article-card-tag">{{ article.tag }}</span>
          <p class="article-card-title">{{ article.title }}</p>
        </div>
      </div>
    </section>

    <!-- AI advice -->
    <section class="card card--accent">
      <div class="card-row">
        <SparklesIcon :size="20" :stroke-width="1.8" />
        <p class="card-label m-0">Совет дня</p>
      </div>
      <p class="card-body">
        Каждый день здесь будет появляться тёплый совет, основанный на твоих записях и настроении.
      </p>
    </section>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { ArrowRightIcon, SparklesIcon } from 'lucide-vue-next'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()

const greeting = computed(() => {
  const hour = new Date().getHours()
  let text = ''
  if (hour < 6) text = 'Доброй ночи'
  else if (hour < 12) text = 'Доброе утро'
  else if (hour < 18) text = 'Добрый день'
  else text = 'Добрый вечер'
  return userStore.userName ? `${text}, ${userStore.userName}` : text
})

const quickEmotions = [
  {
    emoji: '\u{1F60A}',
    label: 'Радость',
    bg: 'var(--color-peach-soft)',
    accent: 'var(--color-peach)',
  },
  {
    emoji: '\u{1F60C}',
    label: 'Спокойствие',
    bg: 'var(--color-mint-soft)',
    accent: 'var(--color-mint)',
  },
  {
    emoji: '\u{1F614}',
    label: 'Тревога',
    bg: 'var(--color-lavender-soft)',
    accent: 'var(--color-lavender)',
  },
  {
    emoji: '\u{1F62A}',
    label: 'Усталость',
    bg: 'var(--color-rose-soft)',
    accent: 'var(--color-rose)',
  },
  {
    emoji: '\u{1F64F}',
    label: 'Благодарность',
    bg: 'var(--color-peach-soft)',
    accent: 'var(--color-peach)',
  },
]

const articleStubs = [
  {
    tag: 'Разогрев',
    title: 'Как замечать хорошее в обычных днях',
    gradient: 'linear-gradient(135deg, var(--color-peach), var(--color-rose))',
  },
  {
    tag: 'Глубина',
    title: 'Почему мы избегаем тишины',
    gradient: 'linear-gradient(135deg, var(--color-lavender), var(--color-primary))',
  },
  {
    tag: 'Рефлексия',
    title: 'Письмо себе в конце дня',
    gradient: 'linear-gradient(135deg, var(--color-mint), var(--color-lavender))',
  },
]
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Hero */
.hero {
  position: relative;
  padding: 2rem 0 1rem;
  text-align: center;
}

@media (min-width: 1024px) {
  .hero {
    padding: 3rem 0 2rem;
  }
}

.hero-orb {
  width: 80px;
  height: 80px;
  margin: 0 auto 1.5rem;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--color-lavender), var(--color-peach), var(--color-mint));
  box-shadow:
    0 8px 32px rgb(184 165 216 / 0.3),
    0 0 80px rgb(184 165 216 / 0.15);
  animation: pulse-orb 4s ease-in-out infinite;
}

@keyframes pulse-orb {
  0%,
  100% {
    transform: scale(1);
    box-shadow:
      0 8px 32px rgb(184 165 216 / 0.3),
      0 0 80px rgb(184 165 216 / 0.15);
  }
  50% {
    transform: scale(1.06);
    box-shadow:
      0 12px 40px rgb(184 165 216 / 0.4),
      0 0 100px rgb(184 165 216 / 0.2);
  }
}

.hero-label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
  letter-spacing: 0.02em;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  line-height: 1.2;
  color: var(--color-text);
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 2.5rem;
  }
}

/* Cards */
.card {
  -webkit-backdrop-filter: blur(20px);
  backdrop-filter: blur(20px);
  padding: 1.5rem;
}

.card--accent {
  background:
    linear-gradient(135deg, var(--color-lavender-soft), var(--color-mint-soft)),
    var(--color-surface);
}

.card-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--color-text-muted);
  margin-bottom: 1rem;
}

.card-row {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--color-primary);
  margin-bottom: 0.75rem;
}

.card-body {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
}

.card-action {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 1.25rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-primary);
  text-decoration: none;
  transition: gap 0.2s ease;
}

.card-action:hover {
  gap: 10px;
}

/* Emotion pills */
.emotion-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.emotion-pill {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 10px 18px;
  border-radius: var(--radius-full);
  border: 1px solid var(--pill-accent, transparent);
  background: var(--pill-bg);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.25s ease;
}

.emotion-pill:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--pill-accent, rgb(0 0 0 / 0.1));
}

.emotion-pill-emoji {
  font-size: 1rem;
}

/* Article cards — horizontal scroll or grid */
.articles-grid {
  display: grid;
  gap: 10px;
}

@media (min-width: 640px) {
  .articles-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

.article-card {
  position: relative;
  overflow: hidden;
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  background: var(--color-surface-hover);
  transition: transform 0.2s ease;
  cursor: pointer;
}

.article-card:hover {
  transform: translateY(-2px);
}

.article-card-orb {
  position: absolute;
  top: -20px;
  right: -20px;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  opacity: 0.5;
  filter: blur(16px);
}

.article-card-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: 0.5rem;
}

.article-card-title {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
  position: relative;
}
</style>
