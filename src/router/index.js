import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/HomeView.vue'),
    },
    {
      path: '/article/:id',
      name: 'article',
      component: () => import('@/views/ArticleView.vue'),
    },
    {
      path: '/emotions',
      name: 'emotions',
      component: () => import('@/views/EmotionsView.vue'),
    },
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
    {
      path: '/tasks',
      name: 'tasks',
      component: () => import('@/views/TasksView.vue'),
    },
    {
      path: '/time',
      name: 'time-tracker',
      component: () => import('@/views/TimeTrackerView.vue'),
    },
    {
      path: '/notes',
      name: 'notes',
      component: () => import('@/views/NotesView.vue'),
    },
    {
      path: '/library',
      name: 'library',
      component: () => import('@/views/LibraryView.vue'),
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
      meta: { skipOnboardingCheck: true },
    },
    {
      path: '/report',
      name: 'report',
      component: () => import('@/views/ReportView.vue'),
    },
    {
      path: '/more',
      name: 'more',
      component: () => import('@/views/MoreView.vue'),
    },
  ],
})

router.beforeEach(async (to) => {
  const userStore = useUserStore()

  if (!userStore.profile) {
    await userStore.fetchProfile()
  }

  if (!userStore.isOnboarded && !to.meta.skipOnboardingCheck) {
    return { name: 'onboarding' }
  }
})

export default router
