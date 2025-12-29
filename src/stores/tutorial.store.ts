import { defineStore } from 'pinia'
import type { ErrorResponse } from '@/types/error.entity.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { TutorialEntity } from '@/types/tutorial.entity.ts'
import { tutorialService } from '@/api/tutorial.service.ts'

export const useTutorialStore = defineStore('tutorial', {
  state: () => ({
    tutorials: [] as TutorialEntity[],
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAllTutorials(): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: TutorialEntity[] | ErrorResponse = await tutorialService.fetchAll()

        if (isErrorResponse(response)) {
          this.error = response.error
          return
        }

        this.tutorials = response
      } catch {
        this.error = 'Ошибка получения туториалов, повторите попытку'
      } finally {
        this.isLoading = false
      }
    },
  },
})