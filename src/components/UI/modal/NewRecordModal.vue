<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import Spinner from '@/components/UI/Spinner.vue'
import type { CreateUserRequest } from '@/types/user.entity.ts'

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

interface Props {
  isOpen: boolean,
  createUser: (req: CreateUserRequest) => Promise<void>,
}
const props = defineProps<Props>()

// обращение к родителю
const emit = defineEmits<{ close: [] }>()
const handleClose = () => {
  email.value = ''
  name.value = ''
  password.value = ''
  group.value = ''
  emit('close')
}

const name = ref("")
const email = ref("")
const password = ref("")
const group = ref("")
const isPasswordVisible = ref(false)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

const isCreateAvailable = computed(() => {
  return name.value != "" && email.value != "" && password.value != "" && group.value != ""
})

const CreateUser = async () => {
  if (isCreateAvailable) {
    const req: CreateUserRequest = {
      email: email.value,
      name: name.value,
      password: password.value,
      group_id: group.value,
    }
    await props.createUser(req)
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
        <h1>Добавить новую запись</h1>
        <p>Укажите данные для создания новой записи в базе данных</p>
      </div>
      <div class="modal-body">
        <input v-model="name" required type="text" placeholder="Введите имя">
        <input v-model="email" required type="email" placeholder="Введите email">
        <div class="password-input">
          <input v-model="password" required :type="isPasswordVisible ? 'text' : 'password'" placeholder="Введите пароль">
          <img :src="isPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye.svg'" alt="visible" @click="isPasswordVisible = !isPasswordVisible">
        </div>
        <input v-model="group" required type="text" placeholder="Выберите группу">
      </div>
      <div class="modal-actions">
        <button class="submit_action" @click="CreateUser" :class="{'disabled': !isCreateAvailable || isLoading}">
          {{!isLoading ? "Добавить" : ""}}
          <Spinner size="small" v-if="isLoading"/>
        </button>
        <button class="cancel_action" @click="handleClose">Отмена</button>
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

        &.disabled {
          opacity: 0.2;
          pointer-events: none;
        }
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
.modal-body{
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > input, & > div > input {
    width: 100%;
    height: 48px;
    padding: 0 15px;
    border-radius: 12px;
    background: rgba(gray, 0.1);
  }
  & > .password-input{
    position: relative;
    & > img {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 2;
      opacity: 0.5;

      &:hover{
        opacity: 0.7;
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