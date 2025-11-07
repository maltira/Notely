<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/useNotification'
import { formatDate } from '@/utils/date_format.ts'
import Spinner from '@/components/UI/Spinner.vue'
import type { UpdatedUser, UserEntity } from '@/types/user.entity.ts'
import DeleteModal from '@/components/UI/modal/DeleteModal.vue'
import EditModal from '@/components/UI/modal/EditModal.vue'
import { useThemeStore } from '@/stores/theme.store.ts'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

const userStore = useUserStore()
const { user, users, isLoading, error, filteredUsers, searchQuery } = storeToRefs(userStore)
const { fetchAllUsers, updateUser, deleteUser, setSearchQuery } = userStore
const { success, err } = useNotification()

const openStatusSelect = ref<number | null>(null)

const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const userDeleting = ref<UserEntity | null>(null)
const userEditing = ref<UserEntity | null>(null)

const toggleDeleteModal = (user: UserEntity) => {
  isDeleteModalOpen.value = !isDeleteModalOpen.value

  if (isDeleteModalOpen.value) {
    userDeleting.value = user
  } else {
    userDeleting.value = null
  }
}

const toggleEditModal = (user: UserEntity) => {
  isEditModalOpen.value = !isEditModalOpen.value

  if (isEditModalOpen.value) {
    userEditing.value = user
  } else {
    userEditing.value = null
  }
}

const changeStatusSelect = (index: number) => {
  if (openStatusSelect.value === index) {
    openStatusSelect.value = null
  } else {
    openStatusSelect.value = index
  }
}

const changeUserStatus = async (userID: string, is_block: boolean) => {
  const newUser: UpdatedUser = {
    id: userID,
    is_block: is_block,
  }
  await updateUser(newUser)

  if (error.value) {
    err('Ошибка обновления пользователя', error.value.toString())
  }
  else if (!users.value) {
    err('Ошибка обновления пользователя', "Список пользователей пуст")
  }
  else {
    const usrIdx = users.value.findIndex((e) => e.id === userID)
    if (usrIdx !== -1) {
      users.value[usrIdx]!.is_block = is_block
    }
    openStatusSelect.value = null
    success('Пользователь обновлен', `Вы изменили данные у пользователя с ID: ${userID}`)
  }
}

const changeUser = async (req: UpdatedUser) => {
  console.log(req)
  await updateUser(req)
  if (error.value) {
    err('Ошибка обновления пользователя', error.value.toString())
  }
  else if (!users.value) {
    err('Ошибка обновления пользователя', "Список пользователей пуст")
  }
  else {
    success('Пользователь обновлен', `Вы изменили данные у пользователя с ID: ${req.id}`)
    await fetchAllUsers()
  }
}

const deleteUserByID = async (id: string) => {
  await deleteUser(id)

  if (error.value) {
    err('Ошибка удаления пользователя', error.value.toString())
  }
  else if (!users.value) {
    err('Ошибка удаления пользователя', "Список пользователей пуст")
  }
  else {
    users.value = users.value.filter((e) => e.id !== id)
    isDeleteModalOpen.value = false
    success('Пользователь удалён', `Вы удалили пользователя с ID: ${id}`)
  }
}

// Закрытие при клике вне компонента
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.td-status')) {
    openStatusSelect.value = null
  }
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await fetchAllUsers()
  if (error.value) {
    err('Ошибка получения пользователей', error.value.toString())
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="home_page">
    <Spinner v-if="isLoading" />
    <div class="search-result-header" v-if="searchQuery">
      <p @click="setSearchQuery('')">← Вернуться назад</p>
      <h1>Записи по запросу «{{searchQuery}}»</h1>
    </div>
    <table v-if="!error && !isLoading && filteredUsers && filteredUsers.length > 0">
      <thead>
        <tr class="main-row">
          <td>
            <button>
              ID
              <img src="/icons/arrow.svg" alt="arrow" width="16px" />
            </button>
          </td>
          <td>
            <button>
              Имя
              <img src="/icons/arrow.svg" alt="arrow" width="16px" />
            </button>
          </td>
          <td>
            <button>
              Email
              <img src="/icons/arrow.svg" alt="arrow" width="16px" />
            </button>
          </td>
          <td>
            <button>
              Группа
              <img src="/icons/arrow.svg" alt="arrow" width="16px" />
            </button>
          </td>
          <td>
            <button>
              Статус
              <img src="/icons/arrow.svg" alt="arrow" width="16px" />
            </button>
          </td>
          <td>
            <button>
              Последнее посещение
              <img src="/icons/arrow.svg" alt="arrow" width="16px" />
            </button>
          </td>
          <td v-if="user && user.Group.name === 'Админ'"></td>
          <td v-if="user && user.Group.name === 'Админ'"></td>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(usr, i) in filteredUsers" :key="i">
          <td>{{ usr.id }}</td>
          <td>{{ usr.name }}</td>
          <td>{{ usr.email }}</td>
          <td>{{ usr.Group.name }}</td>
          <td class="td-status">
            <button
              :class="{
                disabled: user && user.Group.name !== 'Админ',
                block: usr.is_block,
                'active-status': openStatusSelect === i,
                'dark-theme': theme === 'dark'
              }"
              @click="changeStatusSelect(i)"
            >
              {{ usr.is_block ? 'Заблокирован' : 'Доступен' }}
              <img
                src="/icons/arrow.svg"
                :class="{ disabled: user && user.Group.name !== 'Админ' }"
                alt="arrow"
                width="16px"
              />
            </button>
            <div class="block-status" v-if="openStatusSelect === i" @click.stop>
              <p
                :class="{ selected: usr.is_block }"
                @click="usr.is_block ? null : changeUserStatus(usr.id, true)"
              >
                Заблокирован
              </p>
              <p
                :class="{ selected: !usr.is_block }"
                @click="usr.is_block ? changeUserStatus(usr.id, false) : null"
              >
                Доступен
              </p>
            </div>
          </td>
          <td>{{ formatDate(usr.last_visit_at, 'DD/MM/YYYY HH:mm') }}</td>
          <td v-if="user && user.Group.name === 'Админ'" class="action"><img @click="toggleEditModal(usr)" :src="theme === 'dark' ? '/icons/edit-white.svg' : '/icons/edit.svg'" alt="edit"></td>
          <td v-if="user && user.Group.name === 'Админ'" class="action" ><img @click="toggleDeleteModal(usr)" :src="theme === 'dark' ? '/icons/delete-white.svg' : '/icons/delete.svg'" alt="del"></td>
        </tr>
      </tbody>
    </table>
    <p v-else class="search-result-none">Ничего не найдено</p>
  </div>

  <DeleteModal :is-open="isDeleteModalOpen" :user="userDeleting" :on-user-delete="deleteUserByID" @close="isDeleteModalOpen = false"/>
  <EditModal :is-open="isEditModalOpen" :user="userEditing" :update-user="changeUser" @close="isEditModalOpen = false"/>
</template>

<style scoped lang="scss">
.home_page {
  margin-top: 80px;
  padding: 50px 20px;
}
table {
  width: 100%;
  & > thead > tr, & > tbody > tr {
    &.main-row {
      & > td {
        font-weight: 500;
        padding: 10px;
      }
    }
    & > td {
      font-size: 16px;
      padding: 10px;

      &.td-status {
        position: relative;
        width: 1%;
        white-space: nowrap;

        & > button {
          display: flex;
          width: 250px;
          justify-content: space-between;
          align-items: center;
          border-radius: 32px;
          padding: 5px 20px;
          background: #e6fbe7;
          font-weight: 500;
          color: #5e9a10;
          opacity: 0.7;
          position: relative;
          z-index: 2;

          &.dark-theme {
            opacity: 0.9;


          }
          &.block {
            background: #ffe4db;
            color: #ff4201;
          }
          & > img {
            opacity: 0.7;
            transform: translateY(2px);

            &.disabled {
              display: none;
            }
          }
          &:hover {
            opacity: 0.8;
          }
          &.active-status {
            opacity: 0.8;
            z-index: 4;
          }
          &.disabled {
            pointer-events: none;
            justify-content: start;
          }
        }

        & > .block-status {
          padding: 10px 0;
          display: flex;
          flex-direction: column;
          position: absolute;
          background: #f5f5f5;
          top: 50px;
          width: 250px;
          border-radius: 12px;
          z-index: 3;

          & > p {
            font-size: 16px;
            width: 100%;
            padding: 15px 20px;
            opacity: 0.8;
            cursor: pointer;
            color: $black-primary;

            &.selected {
              opacity: 0.3;
              pointer-events: none;
            }
            &:hover {
              opacity: 1;
              background: rgba(gray, 0.1);
            }
          }
        }
      }
    }
  }
  & > thead > tr > td > button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > img {
      transform: translateY(2px);
      opacity: 0.5;
    }

    &:hover {
      & > img {
        opacity: 1;
      }
    }
    &.active-filter{
      & > img {
        opacity: 1;
      }
    }
  }
}
table, th, td {
  border: 1px solid rgba(gray, 0.1);
}

.action {
  text-align: center;

  & > img {
    cursor: pointer;
    width: 20px;
    opacity: 0.7;

    &:hover{
      opacity: 0.9;
    }
  }
}

.search-result-header{
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-bottom: 35px;
  & > h1 {
    font-size: 28px;
  }
  & > p {
    font-size: 16px;
    opacity: 0.7;
    cursor: pointer;

    &:hover{
      opacity: 0.9;
    }
  }
}
.search-result-none{
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  padding: 10px;
}
</style>