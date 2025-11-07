<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {useRouter} from "vue-router";
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import { onMounted, ref } from 'vue'
import NewRecordModal from '@/components/UI/modal/NewRecordModal.vue'
import type { CreateUserRequest } from '@/types/user.entity.ts'
import { useNotification } from '@/composables/useNotification.ts'
import { useThemeStore } from '@/stores/theme.store.ts'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const themeStore = useThemeStore()

const { user, error } = storeToRefs(userStore)
const { logout } = authStore
const { createUser, fetchAllUsers, setSearchQuery } = userStore
const { theme } = storeToRefs(themeStore)
const { toggleTheme } = themeStore

const isSearchOpen = ref(false)
const search = ref("")
const isDarkTheme = ref(false)

const isNewRecordModalOpen = ref(false)
const { success, err } = useNotification()

const toggleNewRecordModal = () => {
  isNewRecordModalOpen.value = !isNewRecordModalOpen.value
}

const LogOut = async () => {
  await logout()
  await router.push("/auth")
}

const createNewUser = async (req: CreateUserRequest) => {
  await createUser(req)
  if (error.value) {
    err('Ошибка создания пользователя', error.value.toString())
  }
  else {
    success("Успешная операция", "Вы добавили нового пользователя в базу данных")
    await fetchAllUsers()
  }
}
const toggleSearch = () => {
  const searchInput = document.getElementById('search-input')
  isSearchOpen.value = !isSearchOpen.value

  if (searchInput && isSearchOpen.value) {
    searchInput.focus()
  }
}
const handleSearch = () => {
  const searchInput = document.getElementById('search-input')
  isSearchOpen.value = false
  if (searchInput) {
    searchInput!.blur()
  }

  if (search.value) {
    setSearchQuery(search.value)
    search.value = ""
  }
}

const handleTheme = (theme: 'dark' | 'light') => {
  toggleTheme(theme)
  isDarkTheme.value = theme === 'dark'
}

onMounted(() => {
  isDarkTheme.value = theme.value === 'dark'
})
</script>

<template>
  <div class="header">
    <div class="theme-selector">
      <button class="theme-icon" @click="handleTheme('dark')" :class="{'active': isDarkTheme}">
        🌙
      </button>
      <button class="theme-icon" @click="handleTheme('light')" :class="{'active': !isDarkTheme}">
        🌞
      </button>
      <div :style="{
        width: '31px',
        height: '31px',
        background: 'white',
        borderRadius: '99px',
        position: 'absolute',
        transform: isDarkTheme ? 'translateX(4%)' : 'translateX(121%)',
      }"></div>
    </div>
    <div class="buttons-header">
      <form autocomplete="off" @submit.prevent="handleSearch" class="button search-record" @click="toggleSearch">
        <img :src=" theme === 'dark' ? '/icons/search-white.svg' : '/icons/search.svg'" alt="add">
        <input
          id="search-input"
          placeholder="Найти запись"
          autocomplete="off"
          type="text"
          name="search"
          @blur="isSearchOpen=false"
          v-model="search"
        >
      </form>
      <RouterLink to="/publications" class="button publics">
        Публикации
      </RouterLink>
      <button v-if="user && user.Group.name === 'Админ'" @click="toggleNewRecordModal" class="button new-record">
        <img :src=" theme === 'dark' ? '/icons/add-white.svg' : '/icons/add.svg'" alt="add">
        Новая запись
      </button>
      <button class="button exit-button" @click="LogOut">
        <img :src=" theme === 'dark' ? '/icons/exit-white.svg' : '/icons/exit.svg'" alt="exit">
        Выйти
      </button>
    </div>
  </div>
  <NewRecordModal :is-open="isNewRecordModalOpen" :create-user="createNewUser" @close="isNewRecordModalOpen = false"/>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: space-between;

  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  padding: 0 20px;
}

.buttons-header {
  display: flex;
  gap: 15px;
}
.button, form {
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.7;
  cursor: pointer;

  width: 120px;
  padding: 10px 20px;
  background: rgba(gray, 0.2);
  border-radius: 32px;
  &.publics{
    font-weight: 500;
    width: fit-content;
    padding-left: 25px;
    padding-right: 25px;
  }
  &.new-record {
    width: fit-content;
  }
  &.search-record {
    width: 300px;
    justify-content: start;
    background: transparent;
    border: 2px solid rgba(gray, 0.2);

    & > img {
      opacity: 0.4;
    }
  }
  & > img {
    width: 16px;
    transform: translateY(1px);
  }
  &:hover{
    opacity: 0.9;
  }
}

.theme-selector{
  display: flex;
  gap: 5px;
  background: rgba(gray, 0.1);
  padding: 5px 5px;
  border-radius: 99px;
  position: relative;
  & > .theme-icon {
    height: auto;
    padding: 5px;
    width: auto;
    background: none;
    z-index: 10;

    &:hover{
      background: rgba(gray, 0.05);
    }

  }
}
</style>