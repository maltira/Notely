<script setup lang="ts">

import { watch } from 'vue'
import type { UserEntity } from '@/types/user.entity.ts'

interface Props {
  isOpen: boolean,
  user: UserEntity | null
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
  <div class="modal-container" :class="{active: isOpen}" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button">
        <img src="/icons/close.svg" @click="handleClose"  alt="close" width="28px">
      </div>
      <div class="modal-header">
        <h1>Обновить данные</h1>
        <p>Укажите новые данные для пользователя</p>
      </div>
      <div class="modal-actions">
        <button class="submit_action">Обновить</button>
        <button class="cancel_action" @click="handleClose" >Отмена</button>
      </div>
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
    background-color: rgba(0, 0, 0, .1);
    backdrop-filter: blur(4px);
    visibility: visible;
    opacity: 1;
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

  & > .modal-actions{
    display: flex;
    gap: 20px;

    & > button {
      width: 100%;
      padding: 8px;
      border-radius: 12px;
      &.submit_action{
        color: $white-primary;
        background-color: $black-primary;

        &:hover{
          opacity: 0.9;
        }
      }
      &.cancel_action{
        color: $black-primary;
        border: 1px solid rgba($black-primary, 1);
        opacity: 0.7;

        &:hover{
          opacity: 1;
        }
      }
    }
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