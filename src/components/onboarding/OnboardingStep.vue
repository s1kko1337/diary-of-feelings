<template>
  <div class="step">
    <div class="step-icon">
      <slot name="icon" />
    </div>
    <h2 class="step-title">{{ title }}</h2>
    <p v-if="subtitle" class="step-subtitle">{{ subtitle }}</p>
    <div class="step-content">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped>
.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 1rem 0;
}

.step-icon {
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.step-title {
  font-size: 1.5rem;
  font-weight: 700;
  letter-spacing: -0.03em;
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.step-subtitle {
  font-size: 0.9rem;
  line-height: 1.65;
  color: var(--color-text-secondary);
  max-width: 320px;
  margin-bottom: 1.5rem;
}

.step-content {
  width: 100%;
  max-width: 400px;
}
</style>
