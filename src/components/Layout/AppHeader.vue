<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store'
import { useRouter } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import { ref } from 'vue'
import { usePublicationStore } from '@/stores/publication.store.ts'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const publicationStore = usePublicationStore()

const { setSearchQuery } = publicationStore
const { logout } = authStore
const { isAuthenticated } = storeToRefs(authStore)
const { user } = storeToRefs(userStore)


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

</script>

<template>
  <div class="header">
    <div class="left-side-nav">
      <div class="avatar">{{ user ? user.name[0] : 'Ч' }}</div>
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
          <p class="block">Главная</p>
          <p class="divider">/</p>
          <img class="icon-route" src="/icons/user.svg" alt="icon" />
          <p class="name-route">Добро пожаловать!</p>
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
          <button v-if="isAuthenticated" class="btn add" @click="router.push('/publication/create')">
            <img src="/icons/add.svg" alt="add" />
            Создать запись
          </button>
          <button class="btn filter">
            <img src="/icons/filter.svg" alt="filter" />
            Фильтры
          </button>
          <button class="btn-select-view">
            <img src="/icons/four-block.svg" class="active" alt="blocks" />
            <img src="/icons/columns.svg" alt="columns" />
          </button>
        </div>
      </div>
    </div>
  </div>
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

  padding: 24px;
  width: 280px;
  height: 100%;

  border-right: 1px solid rgba($black-primary, 0.1);
  border-bottom: 1px solid rgba($black-primary, 0.1);

  & > .avatar {
    display: flex;
    align-items: center;
    justify-content: center;

    width: 50px;
    height: 50px;
    border-radius: 100%;
    background: rgba($blue-color, 0.1);

    cursor: default;
    color: $blue-color;
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
      gap: 8px;

      & > .btn {
        @include button-icon;
      }

      & > .btn-select-view {
        display: flex;
        gap: 10px;

        background: $gray-primary;
        border: 1px solid rgba($black-primary, 0.05);
        border-radius: 8px;
        padding: 12px;

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