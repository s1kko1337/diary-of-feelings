<template>
  <div class="library-page">
    <h1 class="library-title">Библиотека</h1>
    <div class="library-empty">
      <BookOpen :size="48" class="library-icon" />
      <p>Библиотека документов появится в следующей версии</p>
    </div>
  </div>
</template>

<script setup>
import { BookOpen } from 'lucide-vue-next'
</script>

<style scoped>
.library-page {
  padding: 1rem;
  padding-bottom: 5rem;
}

.library-title {
  font-size: 2rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin: 0 0 2rem;
}

.library-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  padding: 3rem 1rem;
  color: var(--color-text-muted);
  text-align: center;
}

.library-icon {
  opacity: 0.3;
}
</style>
