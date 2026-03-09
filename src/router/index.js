import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/splash',
    },
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: { public: true },
    },
    {
      path: '/splash',
      name: 'splash',
      component: () => import('@/views/SplashView.vue'),
      meta: { public: true },
    },
    {
      path: '/home',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    // Tasks section (all tabs inside TasksView)
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
    },
    {
      path: '/notes',
      redirect: { name: 'tasks', query: { tab: 'notes' } },
    },
    {
      path: '/library',
      redirect: { name: 'tasks', query: { tab: 'library' } },
    },
    // Emotions section
    {
      path: '/emotions',
      name: 'emotions',
      component: () => import('@/views/EmotionsView.vue'),
    },
    {
      path: '/assistant',
      name: 'assistant',
      component: () => import('@/views/AssistantView.vue'),
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/views/ReportView.vue'),
    },
    // CBT
    {
      path: '/cbt',
      name: 'cbt',
      component: () => import('@/views/CbtView.vue'),
    },
    {
      path: '/cbt/new',
      name: 'cbt-new',
      component: () => import('@/views/CbtEntryView.vue'),
    },
    {
      path: '/cbt/:id',
      name: 'cbt-entry',
      component: () => import('@/views/CbtEntryView.vue'),
      props: true,
    },
    // Other
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/ArticleView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
    },
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/views/OnboardingView.vue'),
      meta: { public: true },
    },
  ],
})

router.beforeEach(async (to) => {
  const authStore = useAuthStore()

  // Загружаем пользователя один раз
  if (!authStore.user) {
    await authStore.fetchMe()
  }

  // Публичные маршруты — всегда доступны
  if (to.meta.public) return true

  // Не авторизован — на /auth
  if (!authStore.isAuthenticated) {
    return { name: 'auth' }
  }

  // Авторизован и идёт на /auth — на /home
  if (to.name === 'auth') {
    return { name: 'home' }
  }
})

export default router
