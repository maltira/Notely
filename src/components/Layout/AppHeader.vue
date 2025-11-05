<script setup lang="ts">
import {useAuthStore} from "@/stores/auth.store";
import {useRouter} from "vue-router";
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import { ref } from 'vue'
import NewRecordModal from '@/components/UI/modal/NewRecordModal.vue'
import type { CreateUserRequest } from '@/types/user.entity.ts'
import { useNotification } from '@/composables/useNotification.ts'

const router = useRouter()
const authStore = useAuthStore()
const userStore = useUserStore()
const { user, error } = storeToRefs(userStore)
const { logout } = authStore
const { createUser, fetchAllUsers } = userStore

const isNewRecordModalOpen = ref(false)
const { success, err } = useNotification()

const toggleNewRecordModal = () => {
  isNewRecordModalOpen.value = !isNewRecordModalOpen.value
}

const LogOut = async () => {
  await logout()
  await router.push("/auth")
}

const createNewUser = async (req: CreateUserRequest) => {
  await createUser(req)
  if (error.value) {
    err('Ошибка создания пользователя', error.value.toString())
  }
  else {
    isNewRecordModalOpen.value = false
    success("Успешная операция", "Вы добавили нового пользователя в базу данных")

    await fetchAllUsers()
  }
}
</script>

<template>
  <div class="header">
    <div class="buttons-header">
      <button v-if="user && user.Group.name === 'Админ'" @click="toggleNewRecordModal" class="new-record">
        <img src="/icons/add.svg" alt="add">
        Новая запись
      </button>
      <button class="exit-button" @click="LogOut">
        <img src="/icons/exit.svg" alt="exit">
        Выйти
      </button>
    </div>
  </div>
  <NewRecordModal :is-open="isNewRecordModalOpen" :create-user="createNewUser" @close="isNewRecordModalOpen = false"/>
</template>

<style scoped lang="scss">
.header {
  width: 100%;
  height: 80px;
  display: flex;
  justify-content: end;

  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;

  padding: 0 20px;
}

.buttons-header {
  display: flex;
  gap: 15px;
}
button {
  height: 40px;
  color: black;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.7;
  cursor: pointer;

  width: 120px;
  padding: 10px 20px;
  background: rgba(gray, 0.2);
  border-radius: 32px;

  &.new-record {
    width: fit-content;
  }
  & > img {
    width: 16px;
    transform: translateY(1px);
  }

  &:hover{
    opacity: 0.9;
  }
}

</style>