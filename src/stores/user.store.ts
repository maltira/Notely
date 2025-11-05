import { defineStore } from 'pinia'
import type {UpdatedUser, UserEntity} from '@/types/user.entity.ts'
import type {ErrorResponse, MessageResponse} from '@/types/error.entity.ts'
import { userService } from '@/api/user.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'


export const useUserStore = defineStore('user', {
  state: () => ({
    user: null as UserEntity | null,
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    setUser(user: UserEntity) {
      this.user = user
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
    }
  },
})