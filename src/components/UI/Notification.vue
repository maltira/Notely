<script setup lang="ts">
import { useNotification } from '@/composables/useNotification.ts'

const { notifications, removeNotification } = useNotification()

const handleClose = (id: number) => {
  removeNotification(id)
}
</script>

<template>
  <div class="notification-container">
    <div class="notification" v-for="notification in notifications" :key="notification.id" :class="{ exiting: notification.exiting }">
      <div class="not_info">
        <img v-if="notification.type != 'info'" :src="`/icons/check-${notification.type}.svg`" width="32px" alt="check">
        <div class="not_info__content">
          <p class="title">{{notification.title}}</p>
          <p class="desc">{{notification.description}}</p>
        </div>
      </div>
      <div class="img-container" @click="handleClose(notification.id)">
        <img
          src="/icons/close.svg"
          width="20px"
          alt="close"
          class="close">
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.notification-container {
  position: fixed;
  right: 50px;
  bottom: 50px;
  z-index: 9999;
}
.notification {
  width: 470px;
  border-radius: 12px;
  background: white;
  border: 1px solid rgba(gray, 0.2);
  padding: 14px 20px;

  margin-top: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;

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

.img-container {
  opacity: 0.8;
  cursor: pointer;
  padding: 10px;

  &:hover{
    opacity: 1;
  }
}

.not_info{
  display: flex;
  gap: 16px;
  align-items: center;

  & > .not_info__content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    & > .title{
      font-weight: 500;
    }
    & > .desc {
      font-size: 16px;
      line-height: 100%;
      font-style: normal;
      width: 305px;
      opacity: 0.7;
    }
  }
}

@media screen and (max-width: 799px) {
  .notification-container {
    top: 0;
    right: 0;
    left: 0;
    height: fit-content;
    padding: 15px;

    & .notification {
      width: 100%;
    }
  }
  .img-container {
    display: none;
  }
  .desc {
    width: 100% !important;
  }
}
</style>