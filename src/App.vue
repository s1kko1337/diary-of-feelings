<template>
  <OfflineBanner />
  <main v-if="isSplash">
    <router-view />
  </main>
  <template v-else>
    <main class="app-main">
      <router-view />
    </main>
    <AppBottomNav v-if="showNav" />
  </template>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import AppBottomNav from '@/components/layout/AppBottomNav.vue'
import OfflineBanner from '@/components/layout/OfflineBanner.vue'
import { useTheme } from '@/composables/useTheme'

const route = useRoute()
const { initTheme } = useTheme()

const hiddenNavRoutes = ['splash', 'onboarding', 'auth']

const isSplash = computed(() => route.name === 'splash')

const showNav = computed(() => {
  return !hiddenNavRoutes.includes(route.name)
})


onMounted(() => {
  initTheme()
})
</script>

<style scoped>
.app-main {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 0.5rem 1.25rem calc(var(--bottom-nav-height) + 1.5rem);
}
</style>
