<script setup lang="ts">
import { useThemeStore } from '@/stores/theme.store.ts'
import { storeToRefs } from 'pinia'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

interface Props {
  size?: 'small' | 'medium'
}
withDefaults(defineProps<Props>(), {
  size: 'medium'
})
</script>

<template>
  <div class="loading-screen" :class="size">
    <div class="spinner" :style="{
      border: size === 'small' && theme === 'dark' ? '3px solid rgba(black, 0.1)' : '3px solid rgba(white, 0.1)',
      borderTop: size === 'small' && theme === 'dark' ? '3px solid black' : '3px solid white'
    }"></div>
  </div>
</template>

<style scoped lang="scss">
.loading-screen {
  display: flex;
  justify-content: center;
  align-items: center;

  &.medium {
    width: 100%;
    height: 100vh;
    & > .spinner {
      width: 35px;
      height: 35px;
      border: 5px solid rgba(black, 0.1);
      border-top: 5px solid var(--text-primary);
    }
  }
  &.small{
    height: 25px !important;

    & > .spinner {
      width: 20px;
      height: 20px;
      border: 3px solid rgba(white, 0.1);
      border-top: 3px solid white;
    }
  }
}
.spinner {
  border-radius: 100%;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}
@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  50% {
    transform: rotate(180deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>