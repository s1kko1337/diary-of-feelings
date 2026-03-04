<template>
  <div class="app">
    <!-- 3D decorative orbs -->
    <div class="orb orb--lavender" />
    <div class="orb orb--peach" />
    <div class="orb orb--mint" />

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

/* 3D-style decorative orbs */
.orb {
  position: fixed;
  border-radius: 50%;
  pointer-events: none;
  z-index: 0;
}

.orb--lavender {
  top: -120px;
  right: -80px;
  width: 400px;
  height: 400px;
  background: radial-gradient(circle at 35% 35%, var(--color-lavender), transparent 70%);
  opacity: 0.35;
  filter: blur(60px);
  animation: float-slow 20s ease-in-out infinite;
}

.orb--peach {
  top: 45%;
  left: -120px;
  width: 350px;
  height: 350px;
  background: radial-gradient(circle at 60% 40%, var(--color-peach), transparent 70%);
  opacity: 0.25;
  filter: blur(70px);
  animation: float-slow 25s ease-in-out infinite reverse;
}

.orb--mint {
  bottom: -80px;
  right: 5%;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle at 40% 60%, var(--color-mint), transparent 70%);
  opacity: 0.3;
  filter: blur(60px);
  animation: float-slow 22s ease-in-out infinite 5s;
}

@keyframes float-slow {
  0%,
  100% {
    transform: translate(0, 0) scale(1);
  }
  33% {
    transform: translate(15px, -20px) scale(1.05);
  }
  66% {
    transform: translate(-10px, 15px) scale(0.97);
  }
}
</style>
