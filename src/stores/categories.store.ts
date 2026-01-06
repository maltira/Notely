import { defineStore } from 'pinia'
import type { ErrorResponse} from '@/types/error.entity.ts'
import { publicationService } from '@/api/publication.service.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { CategorizedGroups } from '@/types/category.entity.ts'


export const useCategoriesStore = defineStore('categories', {
  state: () => ({
    categories: {} as CategorizedGroups | null,
    isLoading: true,
    error: null as string | null,
  }),

  actions: {
    async getAllCategories(): Promise<CategorizedGroups | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: CategorizedGroups | ErrorResponse = await publicationService.getAllCategories()
        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      } catch {
        this.error = 'Ошибка получения категорий, повторите попытку'
        return null
      } finally {
        this.isLoading = false
      }
    },
  },
})
