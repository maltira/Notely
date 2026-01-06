<script setup lang="ts">
import { useRoute } from 'vue-router'
import SettingsModal from '@/components/Modals/SettingsModal.vue'
import { ref } from 'vue'
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import type { UpdatedGreeting } from '@/types/user.entity.ts'
import { useNotification } from '@/composables/useNotification.ts'
import router from '@/router'
import Skeleton from '@/components/UI/Skeleton.vue'

const route = useRoute()

const { infoNotification } = useNotification()
const userStore = useUserStore()
const { user, error, isLoading } = storeToRefs(userStore)
const { updateUserGreeting } = userStore

const isSettingsOpen = ref(false)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

const routes = [
  [
    { path: '/', name: 'Все публикации', icon: 'home.svg' },
    { path: '/categories', name: 'Категории', icon: 'category.svg' },
    { path: '/authors', name: 'Авторы', icon: 'user.svg' },
  ],
  [
    { path: '/publications/me', name: 'Мои публикации', icon: 'box.svg' },
    { path: '/drafts', name: 'Черновики', icon: 'page.svg' },
    { path: '/favorites', name: 'Сохраненное', icon: 'saved-outline.svg' },
    { path: '/subscriptions', name: 'Мои подписки', icon: 'user-check.svg' },
  ],
]

const closeGreeting = async () => {
  const req: UpdatedGreeting = {
    id: user.value!.id,
    is_greeting_closed: true,
  }
  await updateUserGreeting(req)

  if (error.value) {
    infoNotification('❌' + error.value)
  } else {
    user.value!.is_greeting_closed = true
    if (route.path === '/greeting') {
      await router.push('/')
    }
  }
}
</script>

<template>
  <div class="sidebar">
    <div class="route-block skeleton" v-if="isLoading">
      <div class="block">
        <Skeleton width="90px" height="18px" />
        <div class="routes">
          <Skeleton width="100%" height="36px" />
          <Skeleton width="100%" height="36px" />
          <Skeleton width="100%" height="36px" />
          <Skeleton width="100%" height="36px" />
        </div>
      </div>
      <div class="block">
        <Skeleton width="90px" height="18px" />
        <div class="routes">
          <Skeleton width="100%" height="36px" />
          <Skeleton width="100%" height="36px" />
          <Skeleton width="100%" height="36px" />
          <Skeleton width="100%" height="36px" />
        </div>
      </div>
    </div>
    <div class="route-block" v-else>
      <div class="block main">
        <p>ГЛАВНАЯ</p>
        <div class="routes">
          <RouterLink
            id="greeting"
            to="/greeting"
            class="tab-container close"
            :class="{ active: route.path === '/greeting' }"
            v-if="user && !user.is_greeting_closed"
          >
            <div class="route">
              <img src="/icons/mood.svg" alt="img" />
              Добро пожаловать
            </div>
            <img @click.stop.prevent @click="closeGreeting" class="close-container" src="/icons/close.svg" alt="close" />
          </RouterLink>
          <RouterLink
            v-for="(el, i) in routes[0]"
            :key="i"
            :to="el.path"
            class="tab-container"
            :class="{ active: route.path === el.path }"
          >
            <img :src="`/icons/${el.icon}`" alt="img" />
            {{ el.name }}
          </RouterLink>
        </div>
      </div>
      <div class="block personal">
        <p>ЛИЧНОЕ</p>
        <div class="routes">
          <RouterLink
            v-for="(el, i) in routes[1]"
            :key="i"
            :to="el.path"
            class="tab-container"
            :class="{ active: route.path === el.path }"
          >
            <img :src="`/icons/${el.icon}`" alt="img" />
            {{ el.name }}
          </RouterLink>
        </div>
      </div>
    </div>

    <div class="route-block skeleton" v-if="isLoading">
      <div class="routes">
        <Skeleton width="100%" height="32px" />
        <Skeleton width="100%" height="32px" />
        <Skeleton width="100%" height="32px" />
      </div>
    </div>
    <div class="block settings" v-else>
      <div class="routes">
        <button class="tab-container" v-if="user">
          <img src="/icons/notif.svg" alt="img" />
          Уведомления
        </button>
        <button class="tab-container" v-if="user" @click="toggleSettings">
          <img src="/icons/settings.svg" alt="img" />
          Настройки
        </button>
        <RouterLink to="/about" class="tab-container">
          <img src="/icons/question-line.svg" alt="img" />
          О нас
        </RouterLink>
      </div>
    </div>
  </div>

  <SettingsModal v-if="isSettingsOpen" @close="isSettingsOpen = false" />
</template>

<style scoped lang="scss">
.sidebar {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex-shrink: 0;

  height: calc(100vh - 150px);
  width: 280px;

  padding: 24px;

  border-right: 1px solid rgba($black-primary, 0.1);
}

.block {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 24px;

  & > .routes {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  & > p {
    @include tag-text;
    opacity: 0.2;
  }
}

.tab-container {
  @include sidebar-tab;

  &.close {
    justify-content: space-between;

    & > .route {
      display: flex;
      gap: 12px;
      align-items: center;

      & > img {
        width: 20px;
      }
    }

    & > .close-container {
      width: 14px;
      opacity: 0;
    }

    &:hover {
      & > .close-container {
        opacity: 1;
      }
    }
  }
}
</style>
