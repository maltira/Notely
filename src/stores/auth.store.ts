import { defineStore } from 'pinia'
import type { AuthRequest, AuthResponse } from '@/types/auth.entity.ts'
import { useUserStore } from '@/stores/user.store.ts'
import type { ErrorResponse } from '@/types/error.entity.ts'
import { authService } from '@/api/auth.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { UserEntity } from '@/types/user.entity.ts'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null as string | null,
    isAuthenticated: false,
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async login(req: AuthRequest): Promise<AuthResponse | null>   {
      const userStore = useUserStore()

      try {
        this.isLoading = true // Начинаем загрузку
        this.error = null

        const response: AuthResponse | ErrorResponse = await authService.login(req)

        // Пришла ошибка ErrorResponse (500, 400)
        if (isErrorResponse(response)) {
          this.error = response.error
          return null // Не возвращаем ничего
        }
        // Пришёл ответ AuthResponse (200)
        const user: UserEntity | null = await userStore.fetchCurrentUser()
        if (user === null) { // Неудачная попытка получить пользователя
          this.error = userStore.error
          return null
        }

        // Удачно получили пользователя
        this.isAuthenticated = true
        this.token = response.token

        // Возвращаем только AuthResponse
        return response
      }
      catch {
        this.error = 'Ошибка авторизации, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false // Завершаем загрузку
      }
    },

    async logout(): Promise<boolean> {
      const userStore = useUserStore()
      try {
        this.isLoading = true // Начало загрузки
        this.error = null

        await authService.logout()

        // Обнуляем пользователя при любом ответе (200, 401)
        this.isAuthenticated = false
        this.token = null
        userStore.user = null

        console.log("Logout")

        // Успешный выход
        return true
      }
      catch (e) {
        this.error = 'Ошибка, повторите попытку'
        return false
      }
      finally {
        this.isLoading = false // Завершаем загрузку
      }
    },

    async checkAuth(): Promise<AuthResponse | null> {
      try {
        this.isLoading = true // Начало загрузки
        this.error = null

        const response: AuthResponse | ErrorResponse = await authService.checkAuthStatus()

        // Пришла ошибка (401)
        if (isErrorResponse(response)) {
          this.error = response.error
          this.isAuthenticated = false
          return null
        }

        // Пришёл ответ (authorized)
        return response
      }
      catch {
        this.error = "Ошибка проверки авторизации, повторите попытку"
        this.isAuthenticated = false
        return null
      }
      finally {
        this.isLoading = false // Завершение загрузки
      }
    },
  }
})