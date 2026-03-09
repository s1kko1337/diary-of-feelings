<template>
  <Transition name="slide-down">
    <div v-if="isOffline" class="offline-banner">
      <WifiOff :size="16" />
      <span>Нет соединения — работаем офлайн</span>
    </div>
  </Transition>
</template>

<script setup>
import { WifiOff } from 'lucide-vue-next'
import { useOfflineStatus } from '@/composables/useOfflineStatus'

const { isOffline } = useOfflineStatus()
</script>

<style scoped>
.offline-banner {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--color-warm);
  color: white;
  font-size: 0.85rem;
  font-weight: 500;
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.slide-down-enter-from,
.slide-down-leave-to {
  transform: translateY(-100%);
  opacity: 0;
}
</style>
