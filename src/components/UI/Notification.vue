<script setup lang="ts">
import { useNotification } from '@/composables/useNotification.ts'

const { notifications } = useNotification()
</script>

<template>
  <div class="notification-container">
    <div
      class="notification"
      v-for="notification in notifications"
      :key="notification.id"
      :class="{ exiting: notification.exiting }"
    >
      <p class="desc">{{ notification.description }}</p>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification-container {
  position: fixed;
  bottom: 30px;
  right: 30px;
  z-index: 9999;
}

.notification {
  max-width: 500px;
  border-radius: 32px;
  background: white;
  border: 1px solid $gray-primary;

  padding: 10px 32px;
  margin-bottom: 10px;

  box-shadow: -4px 6px 32px 0 rgba(black, 0.06);

  transition: all 300ms ease-in-out;

  transform: translateY(-20px);
  opacity: 0;

  &:not(.exiting) {
    opacity: 1;
    transform: translateY(0);
  }

  &.exiting {
    opacity: 0;
    transform: translateY(-20px);
    pointer-events: none;
  }
}

.desc {
  @include tag-text();
  opacity: 0.9;
}
</style>