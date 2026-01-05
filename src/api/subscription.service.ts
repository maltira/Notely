import config from '@/config'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'
import type { SubscriptionEntity } from '@/types/subscription.entity.ts'

class SubscriptionService {
  private baseURL: string = config.apiUrl

  // Подписки
  async fetchAllUserSubscriptions(userID: string): Promise<SubscriptionEntity[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/subscription/all/${userID}`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  // Подписчики
  async fetchAllUserSubscribers(userID: string): Promise<SubscriptionEntity[] | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/subscriber/all/${userID}`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  async checkIsSubscribe(userID: string, targetID: string): Promise<boolean | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/subscriber/check?user_id=${userID}&target_id=${targetID}`, {
      method: 'GET',
      credentials: 'include',
    })
    return response.json()
  }

  async updateSubscription(targetID: string, isCreate: boolean): Promise<MessageResponse | ErrorResponse> {
    const response = await fetch(`${this.baseURL}/subscription/update/${targetID}?is_subscribe=${isCreate}`, {
      method: 'POST',
      credentials: 'include',
    })
    return response.json()
  }
}

export const subscriptionService = new SubscriptionService()
