import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'
import type { AuthRequest, AuthResponse } from '@/types/auth.entity.ts'

class AuthService {
  private baseURL = config.apiUrl


  // ? Вход
  async login(req: AuthRequest): Promise<AuthResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(req),
    })
    return response.json()
  }

  // ? Проверка авторизации
  async checkAuthStatus(): Promise<AuthResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/auth/status`, {
      method: 'GET',
      credentials: 'include',
    })

    return response.json()
  }

  // ? Выход с аккаунта
  async logout(): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
    })

    return response.json()
  }
}

export const authService = new AuthService()