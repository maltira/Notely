import type { UserEntity } from '@/types/user.entity.ts'

export interface SubscriptionEntity {
  id: string
  user_id: string
  target_id: string

  created_at: Date

  SubscriberUser: UserEntity | null
  TargetUser: UserEntity | null
}