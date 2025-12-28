import type { UserEntity } from '@/types/user.entity.ts'
import type {
  PublicationCategories,
  PublicationCategoriesRequest,
  PublicationCategoriesUpdateRequest,
} from '@/types/category.entity.ts'

// ? Основная сущность
export interface PublicationEntity {
  id: string
  title: string
  description: string
  user_id: string
  background_color: string

  created_at: Date
  updated_at: Date

  User: UserEntity
  PublicationCategories: PublicationCategories[]
}


// ? Сущности для запросов
export interface PublicationRequest {
  title: string
  description: string
  user_id: string
  background_color?: string

  categories: Array<PublicationCategoriesRequest>
}
export interface PublicationUpdateRequest {
  id: string
  title: string | null
  description: string | null
  background_color: string | null

  categories: Array<PublicationCategoriesUpdateRequest> | null
}