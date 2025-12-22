<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { UpdatedUser, UserEntity } from '@/types/user.entity.ts'
import Spinner from '@/components/UI/Spinner.vue'
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import SelectRoleModal from '@/components/UI/modal/SelectRoleModal.vue'

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)

interface Props {
  isOpen: boolean
  user: UserEntity | null
  updateUser: (req: UpdatedUser) => Promise<void>
}
const props = defineProps<Props>()

const name = ref('')
const email = ref('')
const password = ref('')
const groupID = ref('')
const groupName = ref('')

const isPasswordVisible = ref(false)
const isRoleModalOpen = ref(false)

const toggleRoleModal = () => {
  isRoleModalOpen.value = !isRoleModalOpen.value
}

// обращение к родителю
const emit = defineEmits<{ close: [] }>()
const handleClose = () => {
  email.value = ''
  name.value = ''
  password.value = ''
  groupID.value = ''
  groupName.value = ''
  emit('close')
}

const isUpdateAvailable = computed(() => {
  if (props.user) {
    return (
      (name.value != '' && name.value != props.user.name) ||
      (email.value != '' && email.value != props.user.email) ||
      password.value != '' ||
      (groupID.value != '' && groupID.value != props.user.group_id)
    )
  } else return false
})

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

const UpdateUser = async () => {
  if (isUpdateAvailable && props.user) {
    const req: UpdatedUser = {
      id: props.user.id
    }
    if (email.value != "" && props.user && props.user.email)
      req.email = email.value
    if (name.value != "" && props.user && props.user.name)
      req.name = name.value
    if (password.value != "")
      req.password = password.value
    if (groupID.value != "" && props.user && props.user.group_id)
      req.group_id = groupID.value

    if (req.email || req.name || req.password || req.group_id)
      await props.updateUser(req)
      handleClose()
  }
}

const handleRoleUpdate = (id: string, name: string) => {
  groupID.value = id
  groupName.value = name
  isRoleModalOpen.value = false
}
// слежка за isOpen
watch(() => props.isOpen,
  (newValue) => {
    if (newValue) {
      document.addEventListener('keydown', handleKeydown)
      email.value = props.user?.email || ""
      name.value = props.user?.name || ""
      groupName.value = props.user?.Group.name || ""
      groupID.value = props.user?.group_id || ""
    } else {
      document.removeEventListener('keydown', handleKeydown)
    }
  },
)
</script>

<template>
  <div class="modal-container" :class="{ active: isOpen }" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button" @click="handleClose">
        <img src="/icons/close.svg" alt="close" width="28px" />
      </div>
      <div class="modal-header">
        <h1>Обновить данные</h1>
        <p>Укажите новые данные для пользователя</p>
      </div>
      <div class="modal-body">
        <input
          v-model="name"
          required
          type="text"
          :placeholder="props.user ? props.user.name : 'Unknown'"
        />
        <input
          v-model="email"
          required
          type="email"
          :placeholder="props.user ? props.user.email : 'Unknown'"
        />
        <div class="password-input">
          <input
            v-model="password"
            required
            :type="isPasswordVisible ? 'text' : 'password'"
            placeholder="Новый пароль"
          />
          <img
            :src="isPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye.svg'"
            alt="visible"
            @click="isPasswordVisible = !isPasswordVisible"
          />
        </div>
        <button class="btn-select-role" @click="toggleRoleModal">
          <span>{{groupName ? groupName : props.user ? props.user.Group.name : 'Unknown'}}</span>
          <img src="/icons/edit.svg" alt="edit" width="16px" />
        </button>
      </div>
      <div class="modal-actions">
        <button
          class="submit_action"
          :class="{ disabled: !isUpdateAvailable || isLoading }"
          @click="isUpdateAvailable ? UpdateUser() : null"
        >
          {{ !isLoading ? 'Сохранить' : '' }}
          <Spinner size="small" v-if="isLoading" />
        </button>
        <button
          class="cancel_action"
          @click="handleClose"
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
    background-color: rgba(black, 0.1);
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

  & > .modal-header {
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

  & > .modal-actions {
    display: flex;
    gap: 20px;

    & > button {
      width: 100%;
      padding: 8px;
      border-radius: 12px;
      &.submit_action {
        color: $white-primary;
        background-color: $black-primary;

        &.disabled {
          opacity: 0.2;
          pointer-events: none;
        }
        &:hover {
          opacity: 0.9;
        }
      }
      &.cancel_action {
        color: $black-primary;
        border: 1px solid rgba($black-primary, 1);
        opacity: 0.7;

        &:hover {
          opacity: 1;
        }
      }
    }
  }
}
.modal-body {
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > input,
  & > div > input, & > button {
    width: 100%;
    height: 48px;
    padding: 0 15px;
    border-radius: 12px;
    background: rgba(gray, 0.1);
  }
  & > .password-input {
    position: relative;
    & > img {
      position: absolute;
      right: 15px;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      z-index: 2;
      opacity: 0.5;

      &:hover {
        opacity: 0.7;
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
.modal-close-button {
  cursor: pointer;
  padding: 4px;
  border-radius: 32px;
  background: $white-primary;
  position: absolute;
  top: 0;
  right: calc(-36px - 12px);

  opacity: 0.6;
  &:hover {
    opacity: 0.8;
  }
  & > img {
    width: 28px;
    height: 28px;
  }
}
</style>