import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'
import { publicationService } from '@/api/publication.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { FavoritePublicationEntity, PublicationEntity } from '@/types/publication.entity.ts'

export const useFavoritesStore = defineStore('favorites', {
  state: () => ({
    favorites: [] as PublicationEntity[],
    isLoading: true,
    error: null as string | null,
  }),

  actions: {
    async getAllFavorites(): Promise<PublicationEntity[]> {
      try {
        this.isLoading = true
        this.error = null

        const response: FavoritePublicationEntity[] | ErrorResponse = await publicationService.GetAllFavByCurrentUser()
        if (isErrorResponse(response)) {
          this.error = response.error
          return []
        }

        return response.map((p) => p.Publication)
      } catch {
        this.error = 'Ошибка получения избранного, повторите попытку'
        return []
      } finally {
        this.isLoading = false
      }
    },
    async checkFavorite(publicationID: string): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null
        return await publicationService.CheckIsFavorite(publicationID)
      } catch {
        this.error = 'Ошибка информации об избранном, повторите попытку'
        return false
      } finally {
        this.isLoading = false
      }
    },
    async updateFavorite(publicationID: string, isSave: boolean): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await publicationService.UpdateFavorite(publicationID, isSave)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      } catch {
        this.error = 'Ошибка действия над сохраненной публикацией, повторите попытку'
      } finally {
        this.isLoading = false
      }
    },
  },
})
