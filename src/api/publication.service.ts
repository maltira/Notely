import config from '@/config'
import type { PublicationEntity, PublicationRequest } from '@/types/publication.entity.ts'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'

class PublicationService {
  private baseURL: string = config.apiUrl

  async fetchAll(): Promise<PublicationEntity[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/publication/all`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async fetchByID(id: string): Promise<PublicationEntity | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/publication/${id}`, {
      method: 'GET',
      credentials: "include"
    })
    return response.json()
  }

  async createPublication(req: PublicationRequest): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/publication/create`, {
      method: 'POST',
      credentials: "include",
      body: JSON.stringify(req)
    })
    return response.json()
  }

  async deletePublication(id: string): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/publication/${id}`, {
      method: 'DELETE',
      credentials: "include"
    })
    return response.json()
  }
}

export const publicationService = new PublicationService();