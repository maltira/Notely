import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: {
      hideHeader: false,
    }
  },
  {
    path: '/auth',
    name: 'Authorization',
    component: LoginView,
    meta: {
      hideHeader: true,
    }
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router