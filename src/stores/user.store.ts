import { defineStore } from 'pinia'
import type { UserEntity } from '@/types/user.entity.ts'
import type { ErrorResponse } from '@/types/error.entity.ts'
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
          // TODO: logout
          return null
        }
        // Пришёл ответ User (200)
        this.setUser(response)
        return response
      }
      catch {
        this.error = 'Ошибка получения данных пользователя, повторите попытку авторизации'
        // TODO: logout
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
  },
})