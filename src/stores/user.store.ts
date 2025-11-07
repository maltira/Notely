import { defineStore } from 'pinia'
import type { CreateUserRequest, UpdatedUser, UserEntity } from '@/types/user.entity.ts'
import type {ErrorResponse, MessageResponse} from '@/types/error.entity.ts'
import { userService } from '@/api/user.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import { filterUsersArray } from '@/utils/filterUsersArray.ts'


export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserEntity | null,
    users: [] as UserEntity[],
    isLoading: false,
    error: null as string | null,
    searchQuery: null as string | null,
    filterQuery: 'id' as 'id' | 'name' | 'email' | 'group' | 'status' | 'last_visit' | null,
  }),
  getters: {
    filteredUsers: (state) => {
      if (!state.searchQuery) {
        if (state.filterQuery) {
          return filterUsersArray(state.users, state.filterQuery)
        }
        return state.users
      }

      const query = state.searchQuery.toLowerCase()

      if (state.filterQuery) {
        return filterUsersArray(state.users, state.filterQuery)
      }
      else
        return state.users.filter(user =>
          user.id.includes(query) ||
          user.name.toLowerCase().includes(query) ||
          user.email.toLowerCase().includes(query) ||
          user.Group.name.toLowerCase().includes(query)
        )
    }
  },
  actions: {
    setUser(user: UserEntity) {
      this.user = user
    },
    setSearchQuery(query: string) {
      this.searchQuery = query
    },
    setFilterQuery(query: string) {
      this.filterQuery = query
    },

    async fetchCurrentUser(): Promise<UserEntity | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: UserEntity | ErrorResponse = await userService.fetchCurrentUser()

        // Пришла ошибка ErrorResponse (500)
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }
        // Пришёл ответ User (200)
        this.setUser(response)
        return response
      }
      catch {
        this.error = 'Ошибка получения данных пользователя, повторите попытку авторизации'
        return null
      }
      finally {
        this.isLoading = false // Завершаем загрузку
      }
    },

    async fetchUserByID(id: string): Promise<UserEntity | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: UserEntity | ErrorResponse = await userService.fetchUserByID(id)

        // Пришла ошибка ErrorResponse (404 или 500)
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }
        // Пришёл ответ User (200)
        return response
      }
      catch {
        this.error = 'Ошибка получения данных пользователя, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async fetchUserByEmail(email: string): Promise<UserEntity | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: UserEntity | ErrorResponse = await userService.fetchUserByEmail(email)

        // Пришла ошибка ErrorResponse (404 или 500)
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }
        // Пришёл ответ User (200)
        return response
      }
      catch {
        this.error = 'Ошибка получения данных пользователя, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async fetchAllUsers(): Promise<UserEntity[] | null> {
      try{
        this.isLoading = true
        this.error = null

        const response: UserEntity[] | ErrorResponse = await userService.fetchAllUsers()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }
        if (response.length > 0) {
          this.users = [...response].sort((a, b) => a.Group.name.localeCompare(b.Group.name))
        }

        return response
      }
      catch {
        this.error = 'Ошибка получения пользователей, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async updateUser(req: UpdatedUser): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await userService.updateUser(req)
        console.log(response)
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }
        return true
      }
      catch {
        this.error = 'Ошибка обновления пользователя, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async deleteUser(userID: string): Promise<boolean | null > {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await userService.deleteUser(userID)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return true
      }
      catch {
        this.error = 'Ошибка удаления пользователя, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async createUser(req: CreateUserRequest): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await userService.createUser(req)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return true
      }
      catch {
        this.error = 'Ошибка создания пользователя, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    }
  },
})