// ? Основные сущности
// Они уже созданы, поэтому обладают ID - их же можно использовать как сущности для обновления данных
export interface Category {
  id: string
  name: string
}

export interface PublicationCategories {
  id: string
  publication_id: string
  category_id: string

  background_color: string
  text_color: string
  display_order: number

  Category: Category
}

// ? Сущности для запросов
// На этапе создания у них нет ID
export interface CategoryRequest {
  name: string
}
export interface PublicationCategoriesRequest {
  background_color: string
  text_color: string

  Category: CategoryRequest
}

export interface CategoryUpdateRequest {
  id?: string
  name: string
}
export interface PublicationCategoriesUpdateRequest {
  id?: string
  publication_id?: string
  category_id?: string
  background_color: string
  text_color: string

  Category: CategoryUpdateRequest
}