import { defineStore } from 'pinia'
import type { PublicationEntity, PublicationRequest } from '@/types/publication.entity.ts'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'
import { publicationService } from '@/api/publication.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'


export const usePublicationStore = defineStore('publication', {
  state: () => ({
    publications: [] as PublicationEntity[],
    isLoading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPublication(id: string): Promise<PublicationEntity | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: PublicationEntity | ErrorResponse = await publicationService.fetchByID(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      }
      catch {
        this.error = 'Ошибка получения публикации, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async fetchAllPublications(): Promise<PublicationEntity[] | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: PublicationEntity[] | ErrorResponse = await publicationService.fetchAll()

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        this.publications = response
        return response
      }
      catch {
        this.error = 'Ошибка получения публикаций, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async createPublication(req: PublicationRequest): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await publicationService.createPublication(req)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return true
      }
      catch {
        this.error = 'Ошибка созданий публикации, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },

    async deletePublication(id: string): Promise<boolean | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await publicationService.deletePublication(id)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return true
      }
      catch {
        this.error = 'Ошибка удаления публикации, повторите попытку'
        return null
      }
      finally {
        this.isLoading = false
      }
    },
  }
})