<template>
  <div class="empty-state">
    <div class="empty-state__icon-wrap">
      <BarChart3 :size="40" :stroke-width="1.5" />
    </div>
    <h3 class="empty-state__title">Пока нет данных</h3>
    <p class="empty-state__text">
      Веди дневник несколько дней, чтобы увидеть паттерны
    </p>
    <button class="empty-state__btn" @click="goToEmotions">
      <PenLine :size="18" :stroke-width="1.8" />
      Записать эмоцию
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { BarChart3, PenLine } from 'lucide-vue-next'

const router = useRouter()

function goToEmotions() {
  router.push('/emotions')
}
</script>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  background: var(--color-surface);
  border-radius: var(--radius-xl);
}

.empty-state__icon-wrap {
  width: 72px;
  height: 72px;
  border-radius: var(--radius-lg);
  background: var(--color-accent-subtle);
  color: var(--color-accent);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.25rem;
}

.empty-state__title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text);
  margin: 0 0 0.5rem;
}

.empty-state__text {
  font-size: 0.88rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  max-width: 280px;
  margin: 0 0 1.5rem;
}

.empty-state__btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.6rem 1.2rem;
  background: var(--color-accent);
  color: #fff;
  border: none;
  border-radius: var(--radius-full);
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition:
    background 0.15s ease,
    box-shadow 0.15s ease,
    transform 0.1s ease;
}

.empty-state__btn:hover {
  background: var(--color-accent-hover);
  box-shadow: var(--shadow-float);
}

.empty-state__btn:active {
  transform: scale(0.97);
}
</style>
