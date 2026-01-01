<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRoute, useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import { computed, ref } from 'vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { usePubViewStore } from '@/stores/view.store.ts'
import FiltersModal from '@/components/Modals/FiltersModal.vue'

const router = useRouter()
const route = useRoute()

const pubViewStore = usePubViewStore()
const authStore = useAuthStore()
const userStore = useUserStore()
const publicationStore = usePublicationStore()

const { viewMode } = storeToRefs(pubViewStore)
const { toggleView } = pubViewStore
const { setSearchQuery } = publicationStore
const { logout } = authStore
const { isAuthenticated } = storeToRefs(authStore)
const { user } = storeToRefs(userStore)

interface routeInterface {
  group: string
  path: string
  name: string
  icon: string

  hideSearch?: boolean
  hideCreate?: boolean
  hideFilters?: boolean
  hideViews?: boolean
}

const routes: routeInterface[] = [
  {
    group: 'Главная',
    path: '/greeting',
    name: 'Добро пожаловать!',
    icon: 'mood.svg',
    hideFilters: true,
    hideViews: true,
  },
  { group: 'Главная', path: '/', name: 'Все публикации', icon: 'home.svg' },
  { group: 'Главная', path: '/categories', name: 'Категории', icon: 'category.svg' },
  { group: 'Главная', path: '/authors', name: 'Авторы', icon: 'user.svg' },
  { group: 'Личное', path: '/publications/me', name: 'Мои публикации', icon: 'box.svg' },
  { group: 'Личное', path: '/drafts', name: 'Черновики', icon: 'page.svg' },
  { group: 'Личное', path: '/saved', name: 'Сохраненное', icon: 'saved.svg' },
  { group: 'Личное', path: '/subscriptions', name: 'Мои подписки', icon: 'user-check.svg' },
]

const isFiltersOpen = ref(false)
const toggleFilters = () => {
  isFiltersOpen.value = !isFiltersOpen.value
}

const isSearchOpen = ref(false)
const search = ref('')

const toggleSearch = () => {
  const searchInput = document.getElementById('search-input')
  isSearchOpen.value = !isSearchOpen.value

  if (searchInput && isSearchOpen.value) {
    searchInput.focus()
  }
}

const handleSearch = async () => {
  const searchInput = document.getElementById('search-input')
  isSearchOpen.value = false
  if (searchInput) {
    searchInput!.blur()
  }

  if (search.value) {
    await router.push('/')
    setSearchQuery(search.value)
    search.value = ''
  }
}

const goToHome = () => {
  router.push('/').then(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  })
}

const goToLogout = async () => {
  await router.push('/login')
  await logout()
}

const currentRoute = computed(() => {
  return routes.find((r) => route.path === r.path)
})
</script>

<template>
  <div class="header">
    <div class="left-side-nav">
      <div class="avatar-block_preview">
        <img
          v-if="user && user.avatar"
          class="avatar-preview"
          :src="`/img/avatars/${user.avatar}`"
          alt="avatar"
        />
        <div class="avatar-preview none" v-else>
          {{ user ? user.name[0] : 'Ч' }}
        </div>
      </div>
      <div class="user-info">
        <div class="user-title">
          <p class="username">{{ user ? user.name : 'Читатель' }}</p>
          <p class="useremail">{{ user ? user.email : 'Почта не указана' }}</p>
        </div>
        <div class="exit-btn" @click="goToLogout">
          <img src="/icons/exit.svg" alt="ex" />
        </div>
      </div>
    </div>
    <div class="right-side-nav">
      <div class="top-side">
        <div class="route">
          <p class="block">{{ currentRoute ? currentRoute.group : 'Не понятненько' }}</p>
          <p class="divider">/</p>
          <img
            class="icon-route"
            :src="`/icons/${currentRoute ? currentRoute.icon : 'file-outline.svg'}`"
            alt="icon"
          />
          <p class="name-route">{{ currentRoute ? currentRoute.name : '404' }}</p>
        </div>
        <p class="logotype" @click="goToHome">Notely</p>
      </div>
      <div class="actions">
        <form
          autocomplete="off"
          @submit.prevent="handleSearch"
          class="search-record"
          :class="{ active: search }"
          @click="toggleSearch"
          v-if="!currentRoute!.hideSearch"
        >
          <img src="/icons/search.svg" alt="add" />
          <input
            id="search-input"
            placeholder="Поиск по публикациям"
            autocomplete="off"
            type="text"
            name="search"
            @blur="isSearchOpen = false"
            v-model="search"
          />
        </form>
        <div class="buttons">
          <button
            v-if="isAuthenticated && !currentRoute!.hideCreate"
            class="btn add"
            @click="router.push('/publication/create')"
          >
            <img src="/icons/add.svg" alt="add" />
            Создать запись
          </button>
          <button class="btn filter" v-if="!currentRoute!.hideFilters" @click="toggleFilters">
            <img src="/icons/filter.svg" alt="filter" />
            Фильтры
          </button>
          <button class="btn-select-view" v-if="!currentRoute!.hideViews">
            <img
              src="/icons/four-block.svg"
              :class="{ active: viewMode === 'multi' }"
              alt="blocks"
              @click="toggleView('multi')"
            />
            <img
              src="/icons/columns.svg"
              :class="{ active: viewMode === 'single' }"
              alt="rows"
              :style="{ transform: 'rotate(90deg)' }"
              @click="toggleView('single')"
            />
          </button>
        </div>
      </div>
    </div>
  </div>

  <FiltersModal v-if="isFiltersOpen" @close="isFiltersOpen = false"/>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  justify-content: space-between;
  position: relative;

  height: 150px;

  align-items: center;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;

  background: $white-primary;
}

.left-side-nav {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;

  padding: 24px;
  width: 280px;
  height: 100%;

  border-right: 1px solid rgba($black-primary, 0.1);
  border-bottom: 1px solid rgba($black-primary, 0.1);

  & > .avatar-block_preview {
    width: fit-content;

    & > .avatar-preview {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 50px;
      height: 50px;

      border: 1px solid rgba($black-primary, 0.1);
      border-radius: 100%;

      cursor: default;

      &.none {
        color: $blue-color;
        background: rgba($blue-color, 0.1);
      }
    }
  }

  & > .user-info {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .user-title {
      display: flex;
      flex-direction: column;
      gap: 0;

      & > .username {
        @include main-text;
        font-weight: 500;

        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      & > .useremail {
        @include tag-text;
        opacity: 0.3;

        max-width: 150px;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }

    & > .exit-btn {
      background: $gray-primary;
      padding: 6px;
      border-radius: 6px;

      cursor: pointer;

      & > img {
        opacity: 0.6;
        width: 22px;
        height: 22px;
      }

      &:hover {
        & > img {
          opacity: 0.9;
        }
      }
    }
  }
}

.right-side-nav {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  padding: 24px;
  border-bottom: 1px solid rgba($black-primary, 0.1);
  height: 100%;

  & > .top-side {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .route {
      display: flex;
      align-items: center;
      gap: 8px;

      & > p {
        @include main-text;

        &.block {
          opacity: 0.3;
        }

        &.name-route {
          font-weight: 500;
        }
      }
      & > img {
        width: 20px;
        height: 20px;
      }
    }

    & > .logotype {
      @include main-text;

      background: linear-gradient(to right, #adffc6 -500%, #16a6ff -10%, #733a89 50%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 350% 220%;

      cursor: pointer;

      &:hover {
        transform: translateX(1px);
      }
    }
  }

  & > .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > .buttons {
      display: flex;
      align-items: center;
      gap: 8px;

      & > .btn {
        @include button-icon;
      }

      & > .btn-select-view {
        display: flex;
        align-items: center;

        gap: 10px;

        background: $gray-primary;
        border: 1px solid rgba($black-primary, 0.1);
        border-radius: 8px;
        padding: 10px 12px;

        height: 40px;

        & > img {
          width: 20px;
          height: 20px;
          opacity: 0.3;

          &.active {
            opacity: 1 !important;
          }

          &:hover {
            opacity: 0.6;
          }
        }
      }
    }
  }
}

form {
  @include input-form-icon;
  gap: 10px;
  width: 300px;

  cursor: text;

  & > input {
    @include button-text;

    &::placeholder {
      transition: 200ms;
      opacity: 0.5;
    }
  }
  & > img {
    width: 20px;
    transform: translateY(1px);
  }

  &:hover {
    & > input::placeholder {
      opacity: 0.85;
    }
  }
}
</style>