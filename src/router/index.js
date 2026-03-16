import { createRouter, createWebHistory } from 'vue-router'

const TOKEN_KEY = 'dof-token'
const hasToken = () => !!localStorage.getItem(TOKEN_KEY)

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/auth',
      name: 'auth',
      component: () => import('@/views/AuthView.vue'),
      meta: { guest: true },
    },
    {
      path: '/',
      component: () => import('@/components/layout/AppLayout.vue'),
      children: [
        { path: '', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: 'emotions', name: 'emotions', component: () => import('@/views/EmotionsView.vue') },
        { path: 'tasks', name: 'tasks', component: () => import('@/views/TasksView.vue') },
        { path: 'notes', name: 'notes', component: () => import('@/views/NotesView.vue') },
        { path: 'cbt', name: 'cbt', component: () => import('@/views/CbtView.vue') },
        { path: 'assistant', name: 'assistant', component: () => import('@/views/AssistantView.vue') },
        { path: 'reports', name: 'reports', component: () => import('@/views/ReportsView.vue') },
        { path: 'recommendations', name: 'recommendations', component: () => import('@/views/RecommendationsView.vue') },
        { path: 'portrait', name: 'portrait', component: () => import('@/views/PortraitView.vue') },
        { path: 'settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
      ],
    },
    {
      path: '/admin',
      component: () => import('@/components/layout/AdminLayout.vue'),
      meta: { admin: true },
      children: [
        { path: '', name: 'admin-dashboard', component: () => import('@/views/admin/AdminDashboard.vue') },
        { path: 'users', name: 'admin-users', component: () => import('@/views/admin/AdminUsers.vue') },
        { path: 'users/:id', name: 'admin-user-detail', component: () => import('@/views/admin/AdminUserDetail.vue'), props: true },
        { path: 'roles', name: 'admin-roles', component: () => import('@/views/admin/AdminRoles.vue') },
        { path: 'assistant', name: 'admin-assistant', component: () => import('@/views/admin/AdminAssistant.vue') },
        { path: 'audit', name: 'admin-audit', component: () => import('@/views/admin/AdminAudit.vue') },
      ],
    },
    { path: '/:pathMatch(.*)*', redirect: '/' },
  ],
})

router.beforeEach((to) => {
  const authenticated = hasToken()
  if (!to.meta.guest && !authenticated) return { name: 'auth' }
  if (to.meta.guest && authenticated) return { name: 'home' }
})

export default router
