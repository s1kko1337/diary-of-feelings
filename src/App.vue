<template>
  <div class="app">
    <!-- Desktop top navbar -->
    <AppNavbar />

    <!-- Mobile header -->
    <AppHeader />

    <!-- Content -->
    <main class="app-main">
      <router-view />
    </main>

    <!-- Mobile bottom nav -->
    <AppBottomNav />
  </div>
</template>

<script setup>
import AppNavbar from '@/components/layout/AppNavbar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppBottomNav from '@/components/layout/AppBottomNav.vue'
</script>

<style scoped>
.app {
  position: relative;
  min-height: 100dvh;
  overflow-x: hidden;
}

.app-main {
  position: relative;
  z-index: 1;
  max-width: 720px;
  margin: 0 auto;
  padding: 0.5rem 1.25rem calc(var(--bottom-nav-height) + 1.5rem);
}

@media (min-width: 1024px) {
  .app-main {
    padding: 88px 2rem 3rem;
  }
}
</style>
