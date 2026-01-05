<script setup lang="ts">
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import { computed, onMounted, ref } from 'vue'
import Skeleton from '@/components/UI/Skeleton.vue'

const userStore = useUserStore()
const { user, users, isLoading } = storeToRefs(userStore)
const { fetchAllUsers } = userStore

const search = ref<string>('')
const isSearchOpen = ref(false)

const toggleSearch = () => {
  const searchInput = document.getElementById('search-users')
  isSearchOpen.value = !isSearchOpen.value

  if (searchInput && isSearchOpen.value) {
    searchInput.focus()
  }
}

const handleSearch = async () => {
  const searchInput = document.getElementById('search-users')
  isSearchOpen.value = false
  if (searchInput) {
    searchInput!.blur()
  }
}

const allUsers = computed(() => {
  if (search.value) {
    return users.value
      .sort((a, b) => a.name.localeCompare(b.name))
      .filter((user) => user.name.toLowerCase().includes(search.value.toLowerCase()))
  } else {
    return users.value.sort((a, b) => a.name.localeCompare(b.name))
  }
})

onMounted(async () => {
  await fetchAllUsers()
})
</script>

<template>
  <div class="authors_page">
    <div class="title_block">
      <h2>Авторы публикаций</h2>
      <p>Здесь представлены все пользователи сервиса Notely</p>
    </div>
    <form
      autocomplete="off"
      @submit.prevent="handleSearch"
      class="search-record"
      :class="{ active: search }"
      @click="toggleSearch"
    >
      <img src="/icons/search.svg" alt="add" />
      <input id="search-users" placeholder="Поиск по пользователям" type="text" @blur="isSearchOpen = false" v-model="search" />
    </form>
    <div class="userlist_block skeleton" v-if="isLoading">
      <Skeleton height="60px" border-radius="12px" />
      <Skeleton height="60px" border-radius="12px" />
      <Skeleton height="60px" border-radius="12px" />
      <Skeleton height="60px" border-radius="12px" />
    </div>
    <div class="userlist_block" v-if="allUsers.length > 0">
      <div v-for="u in allUsers" class="user-item">
        <div class="user-info">
          <img class="avatar-preview" v-if="u.avatar" :src="`/img/avatars/${u.avatar}`" alt="avatar" />
          <div class="avatar-preview none" v-else>
            {{ u.name[0] }}
          </div>
          <p class="username">{{ u.name }}</p>
        </div>
        <div class="user-subscribe">
          <p></p>
          <button class="subscribe dark" v-if="user && u.id !== user.id">Подписаться</button>
          <span v-else-if="user && u.id === user.id">Это ваш аккаунт</span>
        </div>
      </div>
    </div>
    <p class="not-found" v-else-if="!isLoading">Ничего не найдено</p>
  </div>
</template>

<style scoped lang="scss">
.authors_page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > .title_block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > h2 {
      @include h2-text;
    }
    & > p {
      @include button-text;
      opacity: 0.6;
    }
  }
}
.userlist_block {
  display: flex;
  flex-direction: column;
  gap: 8px;

  padding: 12px;
  border-radius: 12px;
  background: $gray-primary;
  border: 1px solid rgba($black-primary, 0.1);

  & > .user-item {
    display: flex;
    justify-content: space-between;
    align-items: center;

    background: $white-primary;
    border-radius: 12px;
    padding: 12px;

    border: 1px solid transparent;

    cursor: pointer;

    & > .user-info {
      display: flex;
      align-items: center;
      gap: 12px;

      & > .avatar-preview {
        @include tag-text;
        line-height: 100%;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 36px;
        height: 36px;

        border: 1px solid rgba($black-primary, 0.1);
        border-radius: 100%;

        &.none {
          color: $blue-color;
          background: rgba($blue-color, 0.1);
        }
      }
      & > .username {
        @include button-text;

        opacity: 0.8;
      }
    }
    & > .user-subscribe {
      display: flex;
      align-items: center;
      gap: 12px;

      & > p {
        @include button-text;
        opacity: 0.3;
      }
      & > .subscribe {
        @include button-icon;
        height: 36px;
      }
      & > span {
        @include button-text;
        opacity: 0.4 !important;
        margin-right: 10px;
      }
    }

    &:hover {
      border: 1px solid rgba($black-primary, 0.1);
      .username {
        opacity: 0.99;
      }
    }
  }
}
form {
  @include input-form-icon;
  gap: 10px;
  width: 100%;

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
.not-found {
  @include button-text;
  opacity: 0.6;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
</style>
