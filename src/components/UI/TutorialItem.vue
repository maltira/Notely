<script setup lang="ts">
import { computed, ref } from 'vue'
import Skeleton from '@/components/UI/Skeleton.vue'
import router from '@/router'

interface Props {
  tutorial_type: string

  title: string
  duration: string
  description: string
  img: string
}
const props = defineProps<Props>()
const emit = defineEmits<{
  toggleSettings: []
  newPublication: []
}>()

const imgLoading = ref(true)

const buttonContent = computed(() => {
  switch (props.tutorial_type) {
    case 'create-pub':
      return { action: () => emit('newPublication'), name: 'Создать' }
    case 'fill-profile':
      return { action: () => emit('toggleSettings'), name: 'Настройки' }
    default:
      return { action: () => null, name: 'Перейти' }
  }
})
</script>

<template>
  <div class="tutorial-item">
    <div class="main-content">
      <Skeleton width="100%" height="116px" border-radius="4px" v-if="imgLoading" style="opacity: 0.3;" />
      <img :src="'/img/' + img" alt="img" v-on:load="imgLoading = false" />
      <div class="main_info-content">
        <div class="header">
          <div class="example-time">
            <img src="/icons/clock.svg" alt="clock" />
            ~ {{ duration }}
          </div>
          <h4>{{ title }}</h4>
        </div>
        <p class="description">{{ description }}</p>
      </div>
    </div>
    <div class="divider"></div>
    <div class="footer-content">
      <button class="more-info" @click="router.push('/about')">
        Узнать больше
        <img src="/icons/arr-black.svg" alt="arr" />
      </button>
      <button class="btn dark" @click="buttonContent.action">{{ buttonContent.name }}</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.tutorial-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 5px;

  background: $white-primary;
  border-radius: 6px;
  border: 1px solid rgba($black-primary, 0.1);
  padding: 24px;

  height: 395px;
  width: 356px;
}

.main-content {
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > img {
    width: 100%;
  }
  & > .main_info-content {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > p {
      @include main-text;
      opacity: 0.6;
    }
    & > .header {
      display: flex;
      flex-direction: column;
      gap: 8px;

      & > h4 {
        @include h4-text;
      }
      & > .example-time {
        @include info-block;
      }
    }
  }
}

.divider {
  width: 100%;
  height: 1px;
  background: $black-primary;
  opacity: 0.1;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  & > .more-info {
    @include info-block;
    cursor: pointer;
    &:hover {
      color: #616161;

      & > img {
        opacity: 0.8;
      }
    }
  }
  & > .btn {
    @include button-icon;
    height: 36px;
  }
}
</style>
