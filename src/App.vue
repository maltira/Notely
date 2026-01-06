<script setup lang="ts">
import { useAppInit } from '@/composables/useAppInit.ts'
import { computed, onMounted } from 'vue'
import AppHeader from '@/components/Layout/AppHeader.vue'
import { useRoute } from 'vue-router'
import Notification from '@/components/UI/Notification.vue'
import AppSidebar from '@/components/Layout/AppSidebar.vue'

const { initApp } = useAppInit()
const route = useRoute()

const hideHeader = computed(() => {
  return route.meta.hideHeader === true
})

onMounted(async () => {
  await initApp()
})
</script>

<template>
  <AppHeader v-if="!hideHeader" />

  <div class="main-content">
    <AppSidebar v-if="!hideHeader" />
    <div class="page-view" :class="{ default: hideHeader }">
      <RouterView />
    </div>
  </div>

  <Notification />
</template>

<style lang="scss" scoped>
.main-content {
  display: flex;
  background: $white-primary;
}

.page-view {
  height: calc(100vh - 150px);
  width: 100%;
  padding: 24px;

  overflow-y: scroll;

  &.default {
    height: 100vh;
    padding: 0;
    overflow: auto;
  }

  transition: none;
}
</style>
