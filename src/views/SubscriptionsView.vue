<script setup lang="ts">
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import { computed, ref } from 'vue'
import Skeleton from '@/components/UI/Skeleton.vue'
import { useSubscriptionStore } from '@/stores/subscription.store.ts'
import { useNotification } from '@/composables/useNotification.ts'

// ? Уведомления
const { infoNotification } = useNotification()

// ? subscriptionStore
const subscriptionStore = useSubscriptionStore()
const { userSubscribers, userSubscriptions, error, isLoading: subLoading } = storeToRefs(subscriptionStore)
const { updateSubscription } = subscriptionStore

// ? userStore
const userStore = useUserStore()
const { user, isLoading: userLoading } = storeToRefs(userStore)

const isLoading = computed(() => {
  return userLoading.value || subLoading.value
})

const search = ref<string>('')
const isSearchOpen = ref(false)

const toggleSearch = () => {
  const searchInput = document.getElementById('search-subs')
  isSearchOpen.value = !isSearchOpen.value

  if (searchInput && isSearchOpen.value) {
    searchInput.focus()
  }
}

const handleSearch = async () => {
  const searchInput = document.getElementById('search-subs')
  isSearchOpen.value = false
  if (searchInput) {
    searchInput!.blur()
  }
}

const allSubscriptions = computed(() => {
  if (search.value) {
    return userSubscriptions.value
      .sort((a, b) => a.TargetUser!.name.localeCompare(b.TargetUser!.name))
      .filter((user) => user.TargetUser!.name.toLowerCase().includes(search.value.toLowerCase()))
  } else {
    return userSubscriptions.value.sort((a, b) => a.TargetUser!.name.localeCompare(b.TargetUser!.name))
  }
})

const isMySubscriber = (userID: string): boolean => {
  return userSubscribers.value.find((s) => s.user_id === userID) !== undefined
}

const updateSub = async (targetID: string) => {
  const btn = document.getElementById('btn-' + targetID)
  const currentFlag = !btn!.classList.contains('dark')

  await updateSubscription(targetID, !currentFlag)

  if (error.value) {
    infoNotification('❌ ' + error.value)
  } else {
    if (!currentFlag) {
      btn!.classList.remove('dark')
      btn!.innerText = 'Вы подписаны'
    } else {
      btn!.classList.add('dark')
      btn!.innerText = 'Подписаться'
    }
  }
}
</script>

<template>
  <div class="authors_page">
    <div class="title_block">
      <h2>Мои подписки</h2>
      <p>Здесь отображены все пользователи, на которых вы подписаны</p>
    </div>
    <form
      autocomplete="off"
      @submit.prevent="handleSearch"
      class="search-record"
      :class="{ active: search }"
      @click="toggleSearch"
    >
      <img src="/icons/search.svg" alt="add" />
      <input id="search-subs" placeholder="Поиск по пользователям" type="text" @blur="isSearchOpen = false" v-model="search" />
    </form>

    <div class="userlist_block skeleton" v-if="isLoading">
      <Skeleton height="60px" border-radius="12px" v-for="i in 12" :key="i" />
    </div>
    <div class="userlist_block" v-else-if="allSubscriptions.length > 0">
      <div v-for="u in allSubscriptions" class="user-item">
        <div class="user-info">
          <img
            class="avatar-preview"
            v-if="u.TargetUser && u.TargetUser.avatar"
            :src="`/img/avatars/${u.TargetUser.avatar}`"
            alt="avatar"
          />
          <div class="avatar-preview none" v-else>
            {{ u.TargetUser!.name[0] }}
          </div>
          <p class="username">{{ u.TargetUser!.name }}</p>
        </div>
        <div class="user-subscribe">
          <p v-if="isMySubscriber(u.TargetUser!.id)">Подписан(а) на вас</p>
          <button
            :id="'btn-' + u.TargetUser!.id"
            v-if="user && u.TargetUser!.id !== user.id"
            class="subscribe"
            @click="updateSub(u.TargetUser!.id)"
          >
            Вы подписаны
          </button>
        </div>
      </div>
    </div>

    <p class="not-found" v-else>Ничего не найдено</p>
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
