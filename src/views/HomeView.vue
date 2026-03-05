<template>
  <div class="home">
    <!-- Hero -->
    <section class="hero">
      <p class="hero-label">{{ greeting }}</p>
      <h1 class="hero-title">Как проходит<br />твой день?</h1>
    </section>

    <!-- Quick emotion check-in -->
    <section class="card">
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
    <section class="card">
      <p class="card-label">Статьи на сегодня</p>
      <div class="articles-list">
        <div v-for="(article, i) in articleStubs" :key="i" class="article-item">
          <span class="article-item-tag">{{ article.tag }}</span>
          <p class="article-item-title">{{ article.title }}</p>
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
  },
  {
    tag: 'Глубина',
    title: 'Почему мы избегаем тишины',
  },
  {
    tag: 'Рефлексия',
    title: 'Письмо себе в конце дня',
  },
]
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-section);
}

/* Hero */
.hero {
  position: relative;
  padding: var(--space-2xl) 0 var(--space-lg);
  text-align: left;
}

@media (min-width: 1024px) {
  .hero {
    padding: var(--space-2xl) 0 var(--space-lg);
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
  font-size: 2.75rem;
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1.1;
  background: linear-gradient(135deg, #0f0f0f 0%, #6366f1 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 2.75rem;
  }
}

/* Cards */
.card {
  padding: 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-card);
}

.card--accent {
  background: var(--color-warm-soft);
  border: 1px solid rgb(245 158 11 / 0.15);
  box-shadow: none;
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
  color: var(--color-accent);
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
  color: var(--color-accent);
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
  border-radius: var(--radius-md);
  border: 1px solid var(--pill-accent, var(--color-border));
  background: var(--pill-bg);
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--color-text);
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.emotion-pill:hover {
  border-color: var(--pill-accent, var(--color-accent));
  background: var(--pill-bg);
  box-shadow: 0 0 0 3px rgb(99 102 241 / 0.08);
  transform: translateY(-1px);
}

.emotion-pill:active {
  transform: translateY(0) scale(0.98);
}

.emotion-pill-emoji {
  font-size: 1rem;
}

/* Article list — flat with left accent */
.articles-list {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.article-item {
  padding: 1rem 0 1rem 1rem;
  border-left: 2px solid var(--color-accent);
  border-bottom: 1px solid var(--color-border);
  cursor: pointer;
  transition: background 0.15s ease;
}

.article-item:last-child {
  border-bottom: none;
}

.article-item:hover {
  background: var(--color-surface-hover);
}

.article-item-tag {
  display: inline-block;
  font-size: 0.65rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  margin-bottom: 0.25rem;
}

.article-item-title {
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.4;
  color: var(--color-text);
}
</style>
