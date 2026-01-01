import type { PublicationEntity } from '@/types/publication.entity.ts'
import type { filterType } from '@/stores/publication.store.ts'


export const fitlerPublications = (arr: PublicationEntity[], filter: filterType): PublicationEntity[] => {
  if (arr.length > 0) {

    if (filter.date) {
      switch (filter.date) {
        case 'month':
          const monthAgo = new Date();
          monthAgo.setDate(monthAgo.getDate() - 30);

          arr = arr.filter(pub => {
            const pubDate = new Date(pub.created_at)
            return pubDate >= monthAgo
          })
          break
        case 'six months':
          const sixMonthsAgo = new Date();
          sixMonthsAgo.setDate(sixMonthsAgo.getDate() - 180);

          arr = arr.filter(pub => {
            const pubDate = new Date(pub.created_at)
            return pubDate >= sixMonthsAgo
          })
          break
      }
    }
    if (filter.categories.length > 0) {
      // каждая публикация должна содержать все выбранные категории фильтра
      arr = arr.filter(el => {
        for (const category of filter.categories) {
          if (!el.PublicationCategories.find((pCat) => pCat.Category.name === category.Category.name)) {
            return false
          }
        }
        return true
      })
    }

    return arr
  } else return []
}