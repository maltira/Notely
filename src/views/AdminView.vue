<script setup lang="ts">
import { useUserStore } from '@/stores/user.store'
import { onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/useNotification'
import { formatDate } from '@/utils/date_format.ts'
import Spinner from '@/components/UI/Spinner.vue'
import type { CreateUserRequest, UpdatedUser, UserEntity } from '@/types/user.entity.ts'
import { useRouter } from 'vue-router'

const router = useRouter()

const userStore = useUserStore()
const { user, users, isLoading, error, filteredUsers, searchQuery, filterQuery } =
  storeToRefs(userStore)
const { fetchAllUsers, updateUser, deleteUser, setSearchQuery, setFilterQuery, createUser } =
  userStore
const { infoNotification } = useNotification()

const openStatusSelect = ref<number | null>(null)
const isEditModalOpen = ref(false)
const isDeleteModalOpen = ref(false)
const userDeleting = ref<UserEntity | null>(null)
const userEditing = ref<UserEntity | null>(null)
const isNewRecordModalOpen = ref(false)

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

const toggleNewRecordModal = () => {
  isNewRecordModalOpen.value = !isNewRecordModalOpen.value
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
    infoNotification('Ошибка: ' + error.value.toString())
  } else if (!users.value) {
    infoNotification('Список пользователей пуст')
  } else {
    const usrIdx = users.value.findIndex((e) => e.id === userID)
    if (usrIdx !== -1) {
      users.value[usrIdx]!.is_block = is_block
    }
    openStatusSelect.value = null
    infoNotification(`Вы изменили данные у пользователя с ID: ${userID}`)
  }
}

const changeUser = async (req: UpdatedUser) => {
  await updateUser(req)
  if (error.value) {
    infoNotification('Ошибка: ' + error.value.toString())
  } else if (!users.value) {
    infoNotification('Список пользователей пуст')
  } else {
    infoNotification(`Вы изменили данные у пользователя с ID: ${req.id}`)
    await fetchAllUsers()
  }
}

const deleteUserByID = async (id: string) => {
  await deleteUser(id)

  if (error.value) {
    infoNotification('Ошибка: ' + error.value.toString())
  } else if (!users.value) {
    infoNotification('Список пользователей пуст')
  } else {
    users.value = users.value.filter((e) => e.id !== id)
    isDeleteModalOpen.value = false
    infoNotification(`Вы удалили пользователя с ID: ${id}`)
  }
}

const createNewUser = async (req: CreateUserRequest) => {
  await createUser(req)
  if (error.value) {
    infoNotification('Ошибка: ' + error.value.toString())
  } else {
    infoNotification('Вы добавили нового пользователя в базу данных')
    await fetchAllUsers()
  }
}

// Закрытие при клике вне компонента
const handleClickOutside = (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (!target.closest('.td-status')) {
    openStatusSelect.value = null
  }
}

const handleFilter = (type: string | null) => {
  if (filterQuery.value === type) {
    setFilterQuery(null)
    return
  }
  setFilterQuery(type)
}

onMounted(async () => {
  document.addEventListener('click', handleClickOutside)
  await fetchAllUsers()
  if (error.value) {
    infoNotification('Ошибка: ' + error.value.toString())
  }
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>

<template>
  <div class="admin_page">
    <div class="page-header">
      <div class="search-result-header">
        <p @click="router.push('/')">← {{ 'Главное меню' }}</p>
        <h1>{{ 'Список всех пользователей' }}</h1>
      </div>
      <button
        v-if="user && user.Group.name === 'Админ'"
        @click="toggleNewRecordModal"
        class="button new-record"
      >
        <img src="/icons/add.svg" alt="add" />
        Новая запись
      </button>
    </div>
    <Spinner v-if="isLoading" />
    <div
      v-if="!error && !isLoading && filteredUsers && filteredUsers.length > 0"
      class="table-container"
    >
      <table>
        <thead>
          <tr class="main-row">
            <td>
              <button
                @click="handleFilter('id')"
                :class="{ 'active-filter': filterQuery === 'id' }"
              >
                ID
                <img
                  src="/icons/arrow.svg"
                  alt="arrow"
                  width="12px"
                />
              </button>
            </td>
            <td>
              <button
                @click="handleFilter('name')"
                :class="{ 'active-filter': filterQuery === 'name' }"
              >
                Имя
                <img
                  src="/icons/arrow.svg"
                  alt="arrow"
                  width="12px"
                />
              </button>
            </td>
            <td>
              <button
                @click="handleFilter('email')"
                :class="{ 'active-filter': filterQuery === 'email' }"
              >
                Email
                <img
                  src="/icons/arrow.svg"
                  alt="arrow"
                  width="12px"
                />
              </button>
            </td>
            <td>
              <button
                @click="handleFilter('group')"
                :class="{ 'active-filter': filterQuery === 'group' }"
              >
                Группа
                <img
                  src="/icons/arrow.svg"
                  alt="arrow"
                  width="12px"
                />
              </button>
            </td>
            <td>
              <button
                @click="handleFilter('status')"
                :class="{ 'active-filter': filterQuery === 'status' }"
              >
                Статус
                <img
                  src="/icons/arrow.svg"
                  alt="arrow"
                  width="12px"
                />
              </button>
            </td>
            <td>
              <button
                @click="handleFilter('last_visit')"
                :class="{ 'active-filter': filterQuery === 'last_visit' }"
              >
                Последнее посещение
                <img
                  src="/icons/arrow.svg"
                  alt="arrow"
                  width="12px"
                />
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
            <td v-if="user && user.Group.name === 'Админ'" class="action">
              <img
                @click="toggleEditModal(usr)"
                src="/icons/edit.svg"
                alt="edit"
              />
            </td>
            <td v-if="user && user.Group.name === 'Админ'" class="action">
              <img
                @click="toggleDeleteModal(usr)"
                src="/icons/delete.svg"
                alt="del"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <p v-else class="search-result-none">Ничего не найдено</p>
  </div>

  <!--  <DeleteModal :is-open="isDeleteModalOpen" :user="userDeleting" :on-user-delete="deleteUserByID" @close="isDeleteModalOpen = false"/>-->
  <!--  <EditModal :is-open="isEditModalOpen" :user="userEditing" :update-user="changeUser" @close="isEditModalOpen = false"/>-->
  <!--  <NewRecordModal :is-open="isNewRecordModalOpen" :create-user="createNewUser" @close="isNewRecordModalOpen = false"/>-->
</template>

<style scoped lang="scss">
.admin_page {
  margin-top: 80px;
  padding: 50px 50px;
}

.table-container {
  padding: 15px;
  border-radius: 16px;
  background: rgba(gray, 0.05);
  border: 1px solid rgba(gray, 0.2);
}
table {
  width: 100%;
  & > thead > tr,
  & > tbody > tr {
    &.main-row {
      & > td {
        font-weight: 500;
        padding: 10px 10px 25px 10px;
      }
    }
    & > td {
      font-size: 16px;
      padding: 10px;
      border-bottom: 1px solid rgba(gray, 0.1);

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
  & > tbody > tr:last-child {
    & > td {
      border-bottom: none;
    }
  }
  & > thead > tr > td > button {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;

    & > img {
      transform: translateY(2px);
      opacity: 0.2;
    }

    &:hover {
      & > img {
        opacity: 1;
      }
    }
    &.active-filter {
      & > img {
        opacity: 1;
      }
    }
  }
}

.action {
  text-align: center;

  & > img {
    cursor: pointer;
    width: 20px;
    opacity: 0.7;

    &:hover {
      opacity: 0.9;
    }
  }
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button {
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.7;
  cursor: pointer;

  width: fit-content;
  padding: 10px 20px;
  background: rgba(gray, 0.2);
  border-radius: 32px;

  & > img {
    width: 16px;
    transform: translateY(1px);
  }

  &:hover {
    opacity: 0.9;
  }
}

.search-result-header {
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-bottom: 35px;
  & > h1 {
    font-size: 36px;
  }
  & > p {
    font-size: 16px;
    opacity: 0.7;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
.search-result-none {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  padding: 10px;
}
</style>