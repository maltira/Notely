import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.entity.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { TutorialEntity } from '@/types/tutorial.entity.ts'
import { tutorialService } from '@/api/tutorial.service.ts'

export const useTutorialStore = defineStore('tutorial', {
  state: () => ({
    tutorials: [] as TutorialEntity[],
    isLoading: true,
    error: null as string | null,
  }),
  actions: {
    async fetchAllTutorials(): Promise<TutorialEntity[]> {
      try {
        this.isLoading = true
        this.error = null

        const response: TutorialEntity[] | ErrorResponse = await tutorialService.fetchAll()

        if (isErrorResponse(response)) {
          this.error = response.error
          return []
        }

        return response
      } catch {
        this.error = 'Ошибка получения туториалов, повторите попытку'
        return []
      } finally {
        this.isLoading = false
      }
    },
  },
})