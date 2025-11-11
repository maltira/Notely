<script setup lang="ts">

import { computed, ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import Spinner from '@/components/UI/Spinner.vue'
import type { CreateUserRequest } from '@/types/user.entity.ts'
import { useThemeStore } from '@/stores/theme.store.ts'
import SelectRoleModal from '@/components/UI/modal/SelectRoleModal.vue'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

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
  groupID.value = '700c704d-f5c9-4a95-ad9e-c040b4429050'
  groupName.value = 'Гость'
  emit('close')
}

const name = ref("")
const email = ref("")
const password = ref("")
const isPasswordVisible = ref(false)
const groupID = ref('700c704d-f5c9-4a95-ad9e-c040b4429050')
const groupName = ref('Гость')
const isRoleModalOpen = ref(false)

const toggleRoleModal = () => {
  isRoleModalOpen.value = !isRoleModalOpen.value
}
const handleRoleUpdate = (id: string, name: string) => {
  groupID.value = id
  groupName.value = name
  isRoleModalOpen.value = false
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

const isCreateAvailable = computed(() => {
  return name.value != "" && email.value != "" && password.value != "" && groupID.value != ""
})

const CreateUser = async () => {
  if (isCreateAvailable) {
    const req: CreateUserRequest = {
      email: email.value,
      name: name.value,
      password: password.value,
      group_id: groupID.value,
    }
    await props.createUser(req)
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
  <div class="modal-container" :class="{active: isOpen, 'dark-theme': theme === 'dark'}" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button" @click="handleClose" >
        <img src="/icons/close.svg" alt="close" width="28px">
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
          <img :src="isPasswordVisible ? (theme == 'dark' ? '/icons/eye-closed-white.svg' : '/icons/eye-closed.svg') : (theme == 'dark' ? '/icons/eye-white.svg' : '/icons/eye.svg')" alt="visible" @click="isPasswordVisible = !isPasswordVisible">
        </div>
        <button class="btn-select-role" @click="toggleRoleModal">
          <span>{{groupName ? groupName : 'Выберите роль'}}</span>
          <img :src="theme === 'dark' ? 'icons/edit-white.svg' : 'icons/edit.svg'" alt="edit" width="16px" />
        </button>
      </div>
      <div class="modal-actions">
        <button
          class="submit_action"
          @click="CreateUser"
          :class="{'disabled': !isCreateAvailable || isLoading}"
          :style="{
            background: theme === 'dark' ? 'var(--white-primary)' : 'var(--black-primary)',
            color: theme === 'dark' ? 'var(--black-primary)' : 'var(--white-primary)',
          }"
        >
          {{!isLoading ? "Добавить" : ""}}
          <Spinner size="small" v-if="isLoading"/>
        </button>
        <button
          class="cancel_action"
          @click="handleClose"
          :style="{
            border: theme === 'dark' ? '1px solid var(--white-primary)' : '1px solid var(--black-primary)',
            color: theme === 'dark' ? 'var(--white-primary)' : 'var(--black-primary)',
          }"
        >
          Отмена
        </button>
      </div>
    </div>
  </div>

  <SelectRoleModal :is-open="isRoleModalOpen" :group="groupID" @close="isRoleModalOpen = false" @user-updated="handleRoleUpdate"/>
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
  background: $background-color;
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

  & > input, & > div > input, & > button {
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
      opacity: 0.3;

      &:hover{
        opacity: 0.5;
      }
    }
  }
  & > .btn-select-role {
    display: flex;
    align-items: center;
    justify-content: space-between;
    & > span, & > img {
      font-weight: 400;
    }

    &:hover{
      background: rgba(gray, 0.15);
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