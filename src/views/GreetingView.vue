<script setup lang="ts">
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import SettingsModal from '@/components/Modals/SettingsModal.vue'
import { computed, onMounted, ref } from 'vue'
import TutorialItem from '@/components/UI/TutorialItem.vue'
import router from '@/router'
import { useTutorialStore } from '@/stores/tutorial.store.ts'
import { useNotification } from '@/composables/useNotification.ts'
import Skeleton from '@/components/UI/Skeleton.vue'

const { infoNotification } = useNotification()

const tutorialStore = useTutorialStore()
const { tutorials, error, isLoading: tutorialLoading } = storeToRefs(tutorialStore)
const userStore = useUserStore()
const { user, isLoading: userLoading } = storeToRefs(userStore)

const isLoading = computed(() => {
  return tutorialLoading.value || userLoading.value
})

const isSettingsOpen = ref(false)

const toggleSettings = () => {
  isSettingsOpen.value = !isSettingsOpen.value
}

onMounted(async () => {
  if (error.value) {
    infoNotification('❌ ' + error.value)
  }
})
</script>

<template>
  <div class="greeting_page">
    <div class="page-header skeleton" v-if="isLoading">
      <Skeleton width="550px" height="42px" />
      <Skeleton width="750px" height="19px" />
    </div>
    <div class="page-header" v-else>
      <h2>{{ user ? user.name : 'Читатель' }}, приветствуем в <span>Notely!</span></h2>
      <p>На данном этапе вы можете указать указать данные о себе и узнать больше о нас!</p>
    </div>

    <div class="list-tutorials skeleton" v-if="isLoading">
      <Skeleton width="356px" height="396px" border-radius="6px" />
      <Skeleton width="356px" height="396px" border-radius="6px" />
    </div>
    <div class="list-tutorials" v-else-if="tutorials">
      <TutorialItem
        v-for="t in tutorials"
        :title="t.title"
        :tutorial_type="t.tutorial_type"
        :duration="t.duration"
        :description="t.description"
        :img="t.image"
        @toggle-settings="toggleSettings"
        @new-publication="router.push('/publication/create')"
      />
    </div>

    <p class="none-content" v-else>Ничего не найдено</p>
  </div>

  <SettingsModal v-if="isSettingsOpen" @close="isSettingsOpen = false" />
</template>

<style scoped lang="scss">
.greeting_page {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > h2 {
    @include h2-text;

    & > span {
      background: linear-gradient(to right, #adffc6 -500%, #16a6ff -10%, #733a89 50%, #16a6ff 110%, #adffc6 600%);
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      background-size: 500% 100%;

      animation: gradient-flow 30s infinite ease;
    }
  }
  & > p {
    @include button-text;
    opacity: 0.6;
  }
}

@keyframes gradient-flow {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.list-tutorials {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.none-content {
  @include button-text;
  opacity: 0.7;

  display: flex;
  align-items: center;
  justify-content: center;

  height: 200px;
}
</style>
