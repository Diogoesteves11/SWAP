import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/messages/:userId',
    name: 'messages',
    component: () => import('@/pages/MessagesPage.vue'),
    props: true,
  },
  {
    path: '/messages/:userId/new-message',
    name: 'new-message',
    component: () => import('@/pages/NewMessagePage.vue'),
    props: (route) => ({
      initialRecipient: (route.query.recipient as string) || '',
      initialSubject: (route.query.subject as string) || '',
    }),
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import('@/pages/AdminPage.vue'),
  },
  {
    path: '/edit/:studentId',
    name: 'edit',
    component: () => import('@/pages/EditPage.vue'),
    props: false,
  },
  {
    path: '/student/:studentId',
    name: 'student',
    component: () => import('@/pages/StudentPage.vue'),
  },
  {
    path: '/',
    name: 'login',
    component: () => import('@/pages/LoginPage.vue'),
  },
  // 404 catch‑all route
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
