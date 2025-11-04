import config from '@/config'
import type { UserEntity } from '@/types/user.entity.ts'
import type { ErrorResponse } from '@/types/error.entity.ts'

class UserService {
  private baseURL: string = config.apiUrl

  // ? Получение текущего пользователя
  async fetchCurrentUser(): Promise<UserEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'GET',
    })
    return response.json()
  }

  async fetchUserByID(id: string): Promise<UserEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'GET',
    })
    return response.json()
  }

  async fetchUserByEmail(email: string): Promise<UserEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user/email/${email}`, {
      method: 'GET',
    })
    return response.json()
  }
}

export const userService = new UserService()