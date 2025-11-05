<script setup lang="ts">
import Spinner from '@/components/UI/Spinner.vue'
import { useAppInit } from '@/composables/useAppInit.ts'
import { computed, onMounted } from 'vue'
import AppHeader from '@/components/Layout/AppHeader.vue'
import { useRoute } from 'vue-router'
import Notification from '@/components/UI/Notification.vue'

const { isAppReady, initApp } = useAppInit()
const route = useRoute()

const hideHeader = computed(() => {
  return route.meta.hideHeader === true
})

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <Spinner v-if="!isAppReady" />

  <template v-else>
    <AppHeader v-if="!hideHeader"/>
    <div class="main-content" :class="{ 'full-height': hideHeader }">
      <RouterView/>
    </div>
  </template>

  <Notification/>
</template>

<style lang="scss" scoped>

</style>
