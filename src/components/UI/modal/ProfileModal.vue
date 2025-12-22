<script setup lang="ts">

import { watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import { useAuthStore } from '@/stores/auth.store.ts'
import router from '@/router'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const authStore = useAuthStore()
const { logout } = authStore

interface Props {
  isOpen: boolean,
}
const props = defineProps<Props>()

// обращение к родителю
const emit = defineEmits<{ close: [] }>()
const handleClose = () => {
  emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

const LogOut = async () => {
  await logout()
  await router.push("/login")
  handleClose()
}

// слежка за isOpen
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="modal-container" :class="{active: isOpen }" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button" @click="handleClose">
        <img src="/icons/close.svg" alt="close" width="28px">
      </div>
      <div class="modal-header">
        <h1>Мой профиль</h1>
        <p>Здесь указана ваша личная инфорамация</p>
      </div>
      <div class="modal-body">
        <p>Имя: {{user ? user.name : "Unknown"}}</p>
        <p>Email: {{user ? user.email : "Unknown"}}</p>
        <p>Группа: {{user ? user.Group.name : "Unknown"}}</p>
      </div>
      <button
        class="exit_btn"
        @click="LogOut"
      >
        <img width="20px" src="/icons/exit-red.svg" alt="exit">
        Выйти из профиля
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;
  visibility: hidden;
  opacity: 0;
  z-index: 1003;

  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background-color: rgba(black, .1);
    backdrop-filter: blur(4px);
    visibility: visible;
    opacity: 1;

    &.dark-theme {
      background: rgba(white, 0.1);
    }
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 35px;
  background: $white-primary;
  width: 500px;
  position: relative;
  padding: 40px;

  border-radius: 16px;

  & > .modal-header{
    display: flex;
    flex-direction: column;
    gap: 10px;
    & > h1 {
      font-size: 24px;
      text-align: center;
    }
    & > p {
      font-size: 16px;
      text-align: center;
      opacity: 0.6;
    }
  }
}
.modal-body{
  display: flex;
  flex-direction: column;
  gap: 5px;

  & > p {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 20px;
    border-radius: 16px;

    background-color: rgba(gray, 0.1);
    font-size: 16px;
    opacity: 0.7;
  }
}
.exit_btn{
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;

  width: 100%;
  height: 48px;
  border-radius: 16px;

  background: rgba($red-color, 0.05);
  border: 1px solid rgba($red-color, 0.2);
  opacity: 0.7;
  color: $red-color !important;

  &:hover{
    opacity: 0.99;
  }
}
.modal-close-button{
  cursor: pointer;
  padding: 4px;
  border-radius: 32px;
  background: $white-primary;
  position: absolute;
  top: 0;
  right: calc(-36px - 12px);

  opacity: 0.6;
  &:hover{
    opacity: 0.8;
  }
  & > img {
    width: 28px;
    height: 28px;
  }
}
</style>