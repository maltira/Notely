import {
  createRouter,
  createWebHistory,
  type NavigationGuardNext,
  type RouteLocationNormalizedGeneric,
  type RouteLocationNormalizedLoadedGeneric,
} from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Publications from '@/views/publication/Publications.vue'
import LoginView from '@/views/auth/LoginView.vue'
import AdminView from '@/views/AdminView.vue'
import { useUserStore } from '@/stores/user.store.ts'
import NotFoundView from '@/views/NotFoundView.vue'
import RegistrationView from '@/views/auth/RegistrationView.vue'
import NewPublication from '@/views/publication/NewPublication.vue'
import GreetingView from '@/views/GreetingView.vue'
import MyPublications from '@/views/publication/MyPublications.vue'
import DraftsView from '@/views/publication/DraftsView.vue'
import CategoriesView from '@/views/publication/CategoriesView.vue'
import FavoritesView from '@/views/publication/FavoritesView.vue'
import AboutView from '@/views/AboutView.vue'
import AuthorsView from '@/views/AuthorsView.vue'
import SubscriptionsView from '@/views/SubscriptionsView.vue'
import { useAuthStore } from '@/stores/auth.store.ts'

const checkAuth = async (to: RouteLocationNormalizedGeneric, from: RouteLocationNormalizedLoadedGeneric, next: NavigationGuardNext) => {
  const authStore = useAuthStore()
  const res = await authStore.checkAuth()

  if (res && res.user) {
    next()
  } else {
    next('/login')
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Publications',
    component: Publications,
  },
  {
    path: '/publication/create',
    name: 'CreatePublication',
    component: NewPublication,
    meta: {
      hideHeader: true,
    },
    beforeEnter: checkAuth,
  },
  {
    path: '/publication/edit/:id',
    name: 'EditPublication',
    component: NewPublication,
    meta: {
      hideHeader: true,
    },
    props: true,
    beforeEnter: checkAuth,
  },
  {
    path: '/publications/me',
    name: 'MyPublication',
    component: MyPublications,
    beforeEnter: checkAuth,
  },
  {
    path: '/drafts',
    name: 'MyDrafts',
    component: DraftsView,
    beforeEnter: checkAuth,
  },
  {
    path: '/categories',
    name: 'CategoriesView',
    component: CategoriesView,
  },
  {
    path: '/favorites',
    name: 'MyFavorites',
    component: FavoritesView,
    beforeEnter: checkAuth,
  },

  {
    path: '/authors',
    name: 'AuthorsView',
    component: AuthorsView,
  },
  {
    path: '/subscriptions',
    name: 'SubsctiptionsView',
    component: SubscriptionsView,
    beforeEnter: checkAuth,
  },

  {
    path: '/about',
    name: 'AboutView',
    component: AboutView,
    meta: {
      hideHeader: true,
    },
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
      }
    },
  },

  {
    path: '/login',
    name: 'Authorization',
    component: LoginView,
    meta: {
      hideHeader: true,
    },
  },
  {
    path: '/registration',
    name: 'Registration',
    component: RegistrationView,
    meta: {
      hideHeader: true,
    },
  },

  {
    path: '/greeting',
    name: 'Greeting',
    component: GreetingView,
  },

  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: NotFoundView,
  },
]

export const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router