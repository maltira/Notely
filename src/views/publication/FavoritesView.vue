<script setup lang="ts">
import { usePublicationStore } from '@/stores/publication.store.ts'
import { computed, onMounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import Skeleton from '@/components/UI/Skeleton.vue'
import { usePubViewStore } from '@/stores/view.store.ts'
import PublicationItem from '@/components/UI/PublicationItem.vue'
import { formatDate } from '@/utils/date_format.ts'
import { useUserStore } from '@/stores/user.store.ts'
import PublicationModal from '@/components/Modals/PublicationModal.vue'
import { filterPublications } from '@/utils/filterPublication.ts'
import { useFavoritesStore } from '@/stores/favorite.store.ts'
import type { PublicationEntity } from '@/types/publication.entity.ts'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const pubViewStore = usePubViewStore()
const { viewMode } = storeToRefs(pubViewStore)

const favoriteStore = useFavoritesStore()
const { favorites, isLoading } = storeToRefs(favoriteStore)

const publicationStore = usePublicationStore()
const { filter } = storeToRefs(publicationStore)

const isPublicationOpen = ref<boolean>(false)
const selectedPublication = ref<PublicationEntity | null>(null)

const togglePublicationModal = (id: string) => {
  isPublicationOpen.value = !isPublicationOpen.value

  selectedPublication.value = favorites.value.find((p) => p.id === id) || null
}

const listPublications = computed(() => {
  if (filter.value.date !== null || filter.value.categories.length > 0) return filterPublications(favorites.value, filter.value)
  return favorites.value
})

onMounted(() => {
  filter.value.date = null
  filter.value.categories = []
})
</script>

<template>
  <div class="favorites_page">
    <div class="page-header skeleton" v-if="isLoading">
      <Skeleton width="364px" height="31px" />
      <Skeleton width="424px" height="19px" />
    </div>
    <div class="page-header" v-else>
      <h2>
        Сохранённые публикации <span :style="{ opacity: 0.3 }">({{ listPublications.length }})</span>
      </h2>
      <p>Все ваши сохранненые публикации находятся здесь</p>
    </div>

    <div class="list-publication skeleton" v-if="isLoading">
      <Skeleton v-for="i in 12" :key="i" :width="viewMode === 'single' ? '100%' : '341px'" height="360px" border-radius="20px" />
    </div>
    <div class="list-publication" v-else-if="listPublications.length > 0">
      <PublicationItem
        v-for="p in listPublications"
        :id="p.id"
        :title="p.title"
        :description="p.description"
        :categories="p.PublicationCategories"
        :created_at="formatDate(p.created_at, 'DD/MM/YYYY HH:mm')"
        :author="user!"
        :background_color="p.background_color"
        :isWide="viewMode === 'single'"
        @openModal="togglePublicationModal"
      />
    </div>

    <p v-else class="search-result-none">Ничего не найдено</p>
  </div>
  <PublicationModal
    v-if="selectedPublication && isPublicationOpen"
    :pub="selectedPublication"
    @close="isPublicationOpen = false"
  />
</template>

<style scoped lang="scss">
.favorites_page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}
.page-header {
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > p {
    @include main-text;
    opacity: 0.6;
  }
  & > h2 {
    @include h2-text;
  }
}
.list-publication {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.search-result-none {
  @include button-text;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
}
</style>
