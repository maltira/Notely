import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import { useUserStore } from '@/stores/user.store.ts'
import NotFoundView from '@/views/NotFoundView.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
  },
  {
    path: '/admin',
    name: 'Admin-panel',
    component: AdminView,
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      await userStore.fetchCurrentUser()
      if (userStore.user?.Group?.name === 'Админ') {
        next()
      } else {
        next('/404')
      }
    }
  },
  {
    path: '/login',
    name: 'Authorization',
    component: LoginView,
    meta: {
      hideHeader: true,
    }
  },
  {
    path: '/404',
    name: 'NotFound',
    component: NotFoundView
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router