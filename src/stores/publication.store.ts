import { defineStore } from 'pinia'
import type {
  PublicationEntity,
  PublicationRequest,
  PublicationUpdateRequest
} from '@/types/publication.entity.ts'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'
import { publicationService } from '@/api/publication.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { PublicationCategoriesRequest } from '@/types/category.entity.ts'

export type filterType = {
  date: null | 'month' | 'six months',
  categories: PublicationCategoriesRequest[]
}

export const usePublicationStore = defineStore('publication', {
  state: () => ({
    publications: [] as PublicationEntity[],
    userDrafts: undefined as undefined | [] as PublicationEntity[],
    userPublications: undefined as undefined | [] as PublicationEntity[],

    isLoading: true,
    error: null as string | null,
    searchPublicationQuery: null as string | null,
    filter: {
      date: null as filterType['date'],
      categories: [] as filterType['categories'],
    },
  }),

  getters: {
    allPublications: (state) => {
      if (!state.searchPublicationQuery) {
        return [...state.publications].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      }

      const query = state.searchPublicationQuery.toLowerCase()
      return state.publications.filter(
        (pub) => pub.title.toLowerCase().includes(query) || pub.description.toLowerCase().includes(query),
      )
    },
  },

  actions: {
    setSearchQuery(query: string) {
      this.searchPublicationQuery = query
    },

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
      } catch {
        this.error = 'Ошибка получения публикации, повторите попытку'
        return null
      } finally {
        this.isLoading = false
      }
    },

    async fetchAllPublications(is_draft: boolean = false): Promise<PublicationEntity[]> {
      try {
        this.isLoading = true
        this.error = null

        const response: PublicationEntity[] | ErrorResponse = await publicationService.fetchAll(is_draft)

        if (isErrorResponse(response)) {
          this.error = response.error
          return []
        }

        return response
      } catch {
        this.error = 'Ошибка получения публикаций, повторите попытку'
        return []
      } finally {
        this.isLoading = false
      }
    },
    async fetchPublicationsByUserID(id: string, is_draft: boolean = false): Promise<PublicationEntity[]> {
      try {
        if (!is_draft) {
          this.isLoading = true
          this.error = null
        }

        const response: PublicationEntity[] | ErrorResponse = await publicationService.fetchByUserID(id, is_draft)
        if (isErrorResponse(response)) {
          this.error = response.error
          return []
        }

        return response
      } catch {
        this.error = 'Ошибка получения публикаций, повторите попытку'
        return []
      } finally {
        this.isLoading = false
      }
    },

    async createPublication(req: PublicationRequest): Promise<void> {
      try {
        const response: MessageResponse | ErrorResponse = await publicationService.createPublication(req)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      } catch {
        this.error = 'Ошибка созданий публикации, повторите попытку'
      }
    },
    async deletePublication(id: string): Promise<void> {
      try {
        const response: MessageResponse | ErrorResponse = await publicationService.deletePublication(id)
        console.log(response)
        if (isErrorResponse(response)) {
          this.error = response.error
        }
      } catch {
        this.error = 'Ошибка удаления публикации, повторите попытку'
      }
    },
    async updatePublication(req: PublicationUpdateRequest): Promise<void> {
      try {
        const response: MessageResponse | ErrorResponse = await publicationService.updatePublication(req)

        if (isErrorResponse(response)) {
          this.error = response.error
        }
      } catch {
        this.error = 'Ошибка изменения публикации, повторите попытку'
      }
    },
  },
})