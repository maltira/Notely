import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import type { AuthResponse } from '@/types/auth.entity.ts'
import { usePubViewStore } from '@/stores/view.store.ts'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { useTutorialStore } from '@/stores/tutorial.store.ts'
import { useSubscriptionStore } from '@/stores/subscription.store.ts'
import { useCategoriesStore } from '@/stores/categories.store.ts'
import { useFavoritesStore } from '@/stores/favorite.store.ts'

export function useAppInit() {
  const isAppReady = ref(false)
  const userStore = useUserStore()

  const initApp = async (): Promise<void> => {
    try {
      resetData()
      const authStore = useAuthStore()
      const auth: AuthResponse | null = await authStore.checkAuth()

      await initGeneralData()

      if (auth && auth.user) {
        userStore.setUser(auth.user)
        await initCurrentUser(auth.user.id)
      }
    }
    catch (error) {
      console.error("App initialization failed:", error)
    }
    finally {
      isAppReady.value = true
    }
  }
  return {
    isAppReady,
    initApp,
  }
}

const initCurrentUser = async (id: string) => {
  try {
    const publicationStore = usePublicationStore()
    const subscriptionStore = useSubscriptionStore()
    const favoriteStore = useFavoritesStore()

    // Параллельная загрузка данных пользователя
    const [drafts, favorites, subscriptions, subscribers] = await Promise.allSettled([
      publicationStore.fetchPublicationsByUserID(id, true),
      favoriteStore.getAllFavorites(),
      subscriptionStore.fetchAllUserSubscriptions(id),
      subscriptionStore.fetchAllUserSubscribers(id),
    ])

    publicationStore.userPublications = publicationStore.publications.filter((p) => p.user_id === id)

    if (drafts.status === 'fulfilled') {
      publicationStore.userDrafts = drafts.value
    }

    if (favorites.status === 'fulfilled') {
      favoriteStore.favorites = favorites.value
    }

    if (subscriptions.status === 'fulfilled') {
      subscriptionStore.userSubscriptions = subscriptions.value
    }

    if (subscribers.status === 'fulfilled') {
      subscriptionStore.userSubscribers = subscribers.value
    }
  } catch (error) {
    console.error('Ошибка инициализации данных пользователя:', error)
  }
}

const initGeneralData = async () => {
  try {
    const publicationStore = usePublicationStore()
    const categoriesStore = useCategoriesStore()
    const tutorialStore = useTutorialStore()
    const pubViewStore = usePubViewStore()
    const userStore = useUserStore()

    // * Инициализация вида публикаций
    pubViewStore.initializeView()

    const [tutorials, categories] = await Promise.allSettled([
      tutorialStore.fetchAllTutorials(),
      categoriesStore.getAllCategories(),
    ])

    if (tutorials.status === 'fulfilled') {
      tutorialStore.tutorials = tutorials.value
    }

    if (categories.status === 'fulfilled') {
      categoriesStore.categories = categories.value
    }

    // * Все публикации
    publicationStore.publications = await publicationStore.fetchAllPublications()
    // * Все пользователи
    userStore.users = await userStore.fetchAllUsers()
  }
  catch (error) {
    console.error('Ошибка инициализации общих данных:', error)
  }
}

const resetData = () => {
  const publicationStore = usePublicationStore()
  const categoriesStore = useCategoriesStore()
  const tutorialStore = useTutorialStore()
  const pubViewStore = usePubViewStore()
  const userStore = useUserStore()
  const subscriptionStore = useSubscriptionStore()
  const favoriteStore = useFavoritesStore()

  pubViewStore.initializeView()
  tutorialStore.tutorials = []
  categoriesStore.categories = null
  publicationStore.publications = []
  userStore.users = []

  publicationStore.userPublications = []
  publicationStore.userDrafts = []
  favoriteStore.favorites = []
  subscriptionStore.userSubscriptions = []
  subscriptionStore.userSubscribers = []
}