import config from '@/config'
import type { ErrorResponse } from '@/types/error.entity.ts'
import type { TutorialEntity } from '@/types/tutorial.entity.ts'

class TutorialService {
  private baseURL: string = config.apiUrl

  async fetchAll(): Promise<TutorialEntity[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/tutorial/all`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }
}

export const tutorialService = new TutorialService()