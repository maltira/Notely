import config from '@/config'
import type {UpdatedUser, UserEntity} from '@/types/user.entity.ts'
import type {ErrorResponse, MessageResponse} from '@/types/error.entity.ts'

class UserService {
  private baseURL: string = config.apiUrl

  // ? Получение текущего пользователя
  async fetchCurrentUser(): Promise<UserEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchUserByID(id: string): Promise<UserEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user/${id}`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchUserByEmail(email: string): Promise<UserEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user/email/${email}`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchAllUsers(): Promise<UserEntity[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async updateUser(req: UpdatedUser): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user`, {
      method: 'PUT',
      credentials: "include",
      body: JSON.stringify(req),
    })
    return response.json()
  }

  async deleteUser(userID: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/user/${userID}`, {
      method: 'DELETE',
      credentials: 'include',
    })
    return response.json()
  }
}

export const userService = new UserService()