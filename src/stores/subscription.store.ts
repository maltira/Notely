import { defineStore } from 'pinia'
import type { ErrorResponse, MessageResponse } from '@/types/error.entity.ts'
import { isErrorResponse } from '@/utils/response_type.ts'
import type { SubscriptionEntity } from '@/types/subscription.entity.ts'
import { subscriptionService } from '@/api/subscription.service.ts'

export const useSubscriptionStore = defineStore('subscription', {
  state: () => ({
    isLoading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchAllUserSubscriptions(userID: string): Promise<SubscriptionEntity[] | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: SubscriptionEntity[] | ErrorResponse = await subscriptionService.fetchAllUserSubscriptions(userID)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      } catch {
        this.error = 'Ошибка получения подписок, повторите попытку'
        return null
      } finally {
        this.isLoading = false
      }
    },
    async fetchAllUserSubscribers(userID: string): Promise<SubscriptionEntity[] | null> {
      try {
        this.isLoading = true
        this.error = null

        const response: SubscriptionEntity[] | ErrorResponse = await subscriptionService.fetchAllUserSubscribers(userID)

        if (isErrorResponse(response)) {
          this.error = response.error
          return null
        }

        return response
      } catch {
        this.error = 'Ошибка получения подписчиков, повторите попытку'
        return null
      } finally {
        this.isLoading = false
      }
    },
    async checkIsSubscribe(userID: string, targetID: string): Promise<boolean> {
      try {
        this.isLoading = true
        this.error = null

        const response: boolean | ErrorResponse = await subscriptionService.checkIsSubscribe(userID, targetID)
        if (isErrorResponse(response)) {
          this.error = response.error
          return false
        }
        return response
      } catch {
        this.error = 'Ошибка получения информации, повторите попытку'
        return false
      } finally {
        this.isLoading = false
      }
    },
    async updateSubscription(targetID: string, isSubscribe: boolean): Promise<void> {
      try {
        this.isLoading = true
        this.error = null

        const response: MessageResponse | ErrorResponse = await subscriptionService.updateSubscription(targetID, isSubscribe)

        if (isErrorResponse(response)) {
          this.error = response.error
          return
        }
      } catch {
        this.error = 'Ошибка обновления подписки, повторите попытку'
      } finally {
        this.isLoading = false
      }
    },
  },
})
