<template>
  <section class="rec-widget">
    <div class="rec-header">
      <BookOpenIcon :size="18" :stroke-width="1.8" class="rec-header-icon" />
      <h2 class="rec-title">Чтение на сегодня</h2>
    </div>

    <!-- Loading skeleton -->
    <div v-if="recStore.loading" class="rec-list">
      <div
        v-for="n in 3"
        :key="n"
        class="rec-card rec-card--skeleton"
      >
        <div class="skeleton-line skeleton-line--short" />
        <div class="skeleton-line skeleton-line--long" />
        <div class="skeleton-line skeleton-line--medium" />
      </div>
    </div>

    <!-- Empty state -->
    <div
      v-else-if="recStore.recommendations.length === 0"
      class="rec-empty"
    >
      <BookOpenIcon
        :size="28"
        :stroke-width="1.5"
        class="rec-empty-icon"
      />
      <p class="rec-empty-text">Рекомендации появятся позже</p>
    </div>

    <!-- Recommendation cards -->
    <div v-else class="rec-list">
      <article
        v-for="rec in recStore.recommendations"
        :key="rec.id"
        class="rec-card"
        :class="{
          'rec-card--read': rec.isRead,
          [`rec-card--${rec.slot}`]: true,
        }"
      >
        <!-- Top row: slot badge + match score -->
        <div class="rec-card-top">
          <span
            class="rec-slot-badge"
            :class="`rec-slot--${rec.slot}`"
          >
            {{ slotLabel(rec.slot) }}
          </span>

          <span
            class="rec-match-badge"
            :class="matchScoreClass(rec.matchScore)"
          >
            {{ matchPercent(rec.matchScore) }}%
          </span>
        </div>

        <!-- Card body -->
        <div class="rec-card-body">
          <span class="rec-category-icon">
            {{ categoryEmoji(rec.article.category) }}
          </span>
          <div class="rec-card-text">
            <!-- Title row with tone icon -->
            <div class="rec-title-row">
              <span class="rec-tone-icon">
                {{ toneIcon(rec.article.tone) }}
              </span>
              <h3 class="rec-article-title">
                {{ rec.article.title }}
              </h3>
            </div>

            <!-- Meta row: difficulty + reading time -->
            <div class="rec-meta-row">
              <span
                class="rec-difficulty-chip"
                :class="difficultyClass(rec.article.difficulty)"
              >
                {{ difficultyLabel(rec.article.difficulty) }}
              </span>
              <span class="rec-reading-time">
                <ClockIcon :size="12" :stroke-width="1.8" />
                ~{{ rec.article.readingTimeMin }} мин
              </span>
            </div>

            <p class="rec-article-summary">
              {{ rec.article.summary }}
            </p>

            <!-- Match reason -->
            <p
              v-if="rec.matchReason"
              class="rec-match-reason"
            >
              Почему это вам: {{ rec.matchReason }}
            </p>
          </div>
        </div>

        <!-- Card footer -->
        <div class="rec-card-footer">
          <!-- Helpful feedback (shown after opened) -->
          <div
            v-if="rec.openedAt"
            class="rec-helpful-row"
          >
            <template v-if="rec.helpful === null">
              <span class="rec-helpful-label">Было полезно?</span>
              <button
                class="rec-helpful-btn rec-helpful-btn--up"
                @click="handleHelpful(rec.id, true)"
              >
                <ThumbsUpIcon :size="15" :stroke-width="1.8" />
              </button>
              <button
                class="rec-helpful-btn rec-helpful-btn--down"
                @click="handleHelpful(rec.id, false)"
              >
                <ThumbsDownIcon :size="15" :stroke-width="1.8" />
              </button>
            </template>
            <span
              v-else-if="rec.helpful === true"
              class="rec-helpful-result rec-helpful-result--up"
            >
              <ThumbsUpIcon :size="14" :stroke-width="1.8" />
              Полезно
            </span>
            <span
              v-else
              class="rec-helpful-result rec-helpful-result--down"
            >
              <ThumbsDownIcon :size="14" :stroke-width="1.8" />
              Не полезно
            </span>
          </div>

          <div class="rec-card-actions">
            <span v-if="rec.isRead" class="rec-read-badge">
              &#10003; Прочитано
            </span>
            <a
              v-else
              :href="rec.article.url"
              target="_blank"
              rel="noopener noreferrer"
              class="rec-read-link"
              @click="handleOpen(rec.id)"
            >
              Читать &rarr;
            </a>
          </div>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import {
  BookOpenIcon,
  ClockIcon,
  ThumbsUpIcon,
  ThumbsDownIcon,
} from 'lucide-vue-next'
import { useRecommendationsStore } from '@/stores/recommendations'

const recStore = useRecommendationsStore()

const SLOT_LABELS = {
  morning: 'Утро ☀️',
  afternoon: 'День 🌤',
  evening: 'Вечер 🌙',
}

const CATEGORY_EMOJIS = {
  anxiety: '🧠',
  sadness: '💙',
  anger: '🔥',
  productivity: '⚡',
  self_esteem: '⭐',
  relationships: '🤝',
  cbt: '🔍',
  mindfulness: '🍃',
}

const TONE_ICONS = {
  calming: '🌊',
  motivating: '⚡',
  educational: '📚',
  practical: '🛠',
  reflective: '🪞',
}

const DIFFICULTY_LABELS = {
  beginner: 'начинающий',
  intermediate: 'средний',
  advanced: 'продвинутый',
}

function slotLabel(slot) {
  return SLOT_LABELS[slot] || slot
}

function categoryEmoji(category) {
  return CATEGORY_EMOJIS[category] || '📖'
}

function toneIcon(tone) {
  return TONE_ICONS[tone] || ''
}

function difficultyLabel(difficulty) {
  return DIFFICULTY_LABELS[difficulty] || difficulty
}

function difficultyClass(difficulty) {
  const map = {
    beginner: 'rec-diff--beginner',
    intermediate: 'rec-diff--intermediate',
    advanced: 'rec-diff--advanced',
  }
  return map[difficulty] || ''
}

function matchScoreClass(score) {
  if (score >= 0.6) return 'rec-match--high'
  if (score >= 0.3) return 'rec-match--medium'
  return 'rec-match--low'
}

function matchPercent(score) {
  return Math.round((score || 0) * 100)
}

function handleOpen(id) {
  recStore.markOpened(id)
  recStore.markRead(id)
}

function handleHelpful(id, helpful) {
  recStore.markHelpful(id, helpful)
}
</script>

<style scoped>
.rec-widget {
  width: 100%;
  max-width: 420px;
  position: relative;
  z-index: 1;
}

.rec-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.9rem;
}

.rec-header-icon {
  color: var(--color-accent, #6366f1);
}

.rec-title {
  font-size: 0.82rem;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.45));
  margin: 0;
}

.rec-list {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
}

/* Card base */
.rec-card {
  background: var(--color-surface, #fff);
  border-radius: var(--radius-lg, 14px);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  padding: 0.9rem;
  border-left: 3px solid transparent;
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease,
    opacity 0.3s ease;
}

.rec-card:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.09);
}

.rec-card--read {
  opacity: 0.6;
}

/* Slot-colored left border */
.rec-card--morning {
  border-left-color: #f59e0b;
}

.rec-card--afternoon {
  border-left-color: #0ea5e9;
}

.rec-card--evening {
  border-left-color: #7c3aed;
}

/* Card top row */
.rec-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.6rem;
}

.rec-slot-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full, 9999px);
  letter-spacing: 0.02em;
}

.rec-slot--morning {
  background: #fef3c7;
  color: #92400e;
}

.rec-slot--afternoon {
  background: #e0f2fe;
  color: #075985;
}

.rec-slot--evening {
  background: #ede9fe;
  color: #5b21b6;
}

/* Match score badge */
.rec-match-badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.68rem;
  font-weight: 650;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full, 9999px);
  font-family: var(--font-mono, monospace);
}

.rec-match--high {
  background: #dcfce7;
  color: #166534;
}

.rec-match--medium {
  background: #fef3c7;
  color: #92400e;
}

.rec-match--low {
  background: #f3f4f6;
  color: #6b7280;
}

/* Card body */
.rec-card-body {
  display: flex;
  gap: 0.65rem;
  align-items: flex-start;
}

.rec-category-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  line-height: 1;
  margin-top: 0.1rem;
}

.rec-card-text {
  min-width: 0;
  flex: 1;
}

/* Title row with tone icon */
.rec-title-row {
  display: flex;
  align-items: baseline;
  gap: 0.35rem;
  margin-bottom: 0.25rem;
}

.rec-tone-icon {
  font-size: 0.85rem;
  flex-shrink: 0;
  line-height: 1;
}

.rec-article-title {
  font-size: 0.9rem;
  font-weight: 650;
  color: var(--color-text, #1a1714);
  margin: 0;
  line-height: 1.35;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Meta row */
.rec-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.rec-difficulty-chip {
  font-size: 0.62rem;
  font-weight: 600;
  padding: 0.1rem 0.4rem;
  border-radius: var(--radius-full, 9999px);
  text-transform: lowercase;
  letter-spacing: 0.02em;
}

.rec-diff--beginner {
  background: #dcfce7;
  color: #166534;
}

.rec-diff--intermediate {
  background: #fef3c7;
  color: #92400e;
}

.rec-diff--advanced {
  background: #fee2e2;
  color: #991b1b;
}

.rec-reading-time {
  display: inline-flex;
  align-items: center;
  gap: 0.2rem;
  font-size: 0.7rem;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.45));
}

.rec-article-summary {
  font-size: 0.8rem;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.5));
  line-height: 1.5;
  margin: 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* Match reason */
.rec-match-reason {
  font-size: 0.72rem;
  font-style: italic;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.4));
  margin: 0.3rem 0 0;
  line-height: 1.4;
}

/* Card footer */
.rec-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.6rem;
  gap: 0.5rem;
}

.rec-card-actions {
  margin-left: auto;
}

.rec-read-link {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-accent, #6366f1);
  text-decoration: none;
  transition: opacity 0.15s ease;
}

.rec-read-link:hover {
  opacity: 0.75;
}

.rec-read-badge {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.45));
}

/* Helpful feedback */
.rec-helpful-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.rec-helpful-label {
  font-size: 0.72rem;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.45));
  margin-right: 0.15rem;
}

.rec-helpful-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: 1px solid var(--color-border, #e8e8e8);
  border-radius: var(--radius-md, 10px);
  background: transparent;
  color: var(--color-text-muted, #888);
  cursor: pointer;
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}

.rec-helpful-btn--up:hover {
  background: #dcfce7;
  border-color: #86efac;
  color: #166534;
}

.rec-helpful-btn--down:hover {
  background: #fee2e2;
  border-color: #fca5a5;
  color: #991b1b;
}

.rec-helpful-result {
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.72rem;
  font-weight: 550;
}

.rec-helpful-result--up {
  color: #22c55e;
}

.rec-helpful-result--down {
  color: #ef4444;
}

/* Empty state */
.rec-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 2rem 1rem;
  text-align: center;
}

.rec-empty-icon {
  color: var(--color-text-muted, rgba(26, 23, 20, 0.3));
}

.rec-empty-text {
  font-size: 0.85rem;
  color: var(--color-text-muted, rgba(26, 23, 20, 0.45));
  margin: 0;
}

/* Skeleton loading */
.rec-card--skeleton {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  pointer-events: none;
}

.skeleton-line {
  height: 12px;
  border-radius: 6px;
  background: linear-gradient(
    90deg,
    #f0f0f0 25%,
    #e0e0e0 50%,
    #f0f0f0 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s ease-in-out infinite;
}

.skeleton-line--short {
  width: 35%;
}

.skeleton-line--long {
  width: 90%;
}

.skeleton-line--medium {
  width: 60%;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
