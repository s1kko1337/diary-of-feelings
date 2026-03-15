<template>
  <div class="app-shell">
    <AppSidebar class="hidden lg:flex" @open-search="searchOpen = true" />

    <main class="app-main">
      <div class="max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-8">
        <RouterView v-slot="{ Component }">
          <Transition name="page" mode="out-in">
            <component :is="Component" />
          </Transition>
        </RouterView>
      </div>
    </main>

    <AppMobileNav class="lg:hidden" />
    <SearchModal v-model="searchOpen" />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '@/stores/auth'
import AppSidebar from './AppSidebar.vue'
import AppMobileNav from './AppMobileNav.vue'
import SearchModal from '@/components/search/SearchModal.vue'

const auth = useAuthStore()
const searchOpen = ref(false)

onMounted(() => {
  if (!auth.user) auth.fetchProfile()
})
</script>

<style scoped>
.app-shell {
  min-height: 100vh;
  min-height: 100dvh;
  background-color: var(--color-cream-100);
}

.app-main {
  min-height: 100vh;
  min-height: 100dvh;
  padding-bottom: calc(56px + env(safe-area-inset-bottom, 0px));
}

@media (min-width: 1024px) {
  .app-main {
    margin-left: 16rem;
    padding-bottom: 0;
  }
}
</style>
