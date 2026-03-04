<template>
  <div class="progress">
    <div
      v-for="i in total"
      :key="i"
      class="progress-dot"
      :class="{
        'progress-dot--active': i === current,
        'progress-dot--done': i < current,
      }"
    />
  </div>
</template>

<script setup>
defineProps({
  current: { type: Number, required: true },
  total: { type: Number, required: true },
})
</script>

<style scoped>
.progress {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.progress-dot {
  width: 8px;
  height: 8px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  transition: all 0.3s ease;
}

.progress-dot--active {
  width: 24px;
  background: var(--color-primary);
}

.progress-dot--done {
  background: var(--color-primary);
  opacity: 0.5;
}
</style>
