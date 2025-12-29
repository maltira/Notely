import { createRouter, createWebHistory } from 'vue-router'
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

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Publications',
    component: Publications,
    children: [
      {
        path: '/pub/edit/:id',
        component: Publications,
        name: 'PublicationEdit',
        props: true,
      },
    ],
  },
  {
    path: '/publication/create',
    name: 'CreatePublication',
    component: NewPublication,
    meta: {
      hideHeader: true,
    },
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      await userStore.fetchCurrentUser()
      if (userStore.user) {
        next()
      } else {
        next('/login')
      }
    },
  },
  {
    path: '/publication/edit/:id',
    name: 'EditPublication',
    component: NewPublication,
    meta: {
      hideHeader: true,
    },
    props: true,
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      await userStore.fetchCurrentUser()
      if (userStore.user) {
        next()
      } else {
        next('/login')
      }
    },
  },
  {
    path: '/publications/me',
    name: 'MyPublication',
    component: MyPublications,
    beforeEnter: async (to, from, next) => {
      const userStore = useUserStore()
      await userStore.fetchCurrentUser()
      if (userStore.user) {
        next()
      } else {
        next('/login')
      }
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