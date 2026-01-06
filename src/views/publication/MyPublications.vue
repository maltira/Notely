<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date_format.ts'
import PublicationItem from '@/components/UI/PublicationItem.vue'
import { usePubViewStore } from '@/stores/view.store.ts'
import PublicationModal from '@/components/Modals/PublicationModal.vue'
import Skeleton from '@/components/UI/Skeleton.vue'
import { useUserStore } from '@/stores/user.store.ts'
import { filterPublications } from '@/utils/filterPublication.ts'
import type { PublicationEntity } from '@/types/publication.entity.ts'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const pubViewStore = usePubViewStore()
const { viewMode } = storeToRefs(pubViewStore)

const publicationStore = usePublicationStore()
const { userPublications, isLoading: pubLoading, filter } = storeToRefs(publicationStore)

const isLoading = computed(() => pubLoading.value || userPublications.value === undefined)

const selectedPublication = ref<PublicationEntity | null>(null)
const isPublicationOpen = ref<boolean>(false)

const togglePublicationModal = (id: string) => {
  isPublicationOpen.value = !isPublicationOpen.value

  selectedPublication.value = userPublications.value.find((p) => p.id === id) || null
}

const listPublications = computed(() => {
  if (filter.value.date !== null || filter.value.categories.length > 0)
    return filterPublications(userPublications.value, filter.value)
  return userPublications.value
})

onMounted(() => {
  filter.value.date = null
  filter.value.categories = []
})
</script>

<template>
  <div class="publications_page">
    <div class="page-header skeleton" v-if="isLoading">
      <div class="search-result-header">
        <Skeleton width="254px" height="31px" />
        <Skeleton width="274px" height="19px" />
      </div>
    </div>
    <div class="page-header" v-else>
      <div class="search-result-header">
        <h1>
          Мои публикации
          <span :style="{ opacity: 0.3 }">({{ listPublications!.length }})</span>
        </h1>
        <p>Здесь находятся все ваши публикации</p>
      </div>
    </div>

    <div class="list-publication skeleton" v-if="isLoading">
      <Skeleton v-for="i in 12" :key="i" :width="viewMode === 'single' ? '100%' : '341px'" height="360px" border-radius="20px" />
    </div>
    <div class="list-publication" v-else-if="listPublications!.length > 0">
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
.publications_page {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-result-header {
  display: flex;
  gap: 8px;
  flex-direction: column;

  & > h1 {
    @include h2-text;
    display: flex;
    align-items: center;
    gap: 12px;

    & > img {
      opacity: 0.7;
      cursor: pointer;
      &:hover {
        opacity: 1;
      }
    }
  }
  & > p {
    @include button-text;
    opacity: 0.6;
  }
}
.search-result-none {
  @include button-text;
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
}

.list-publication {
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.publication-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 30px;
  padding: 30px;
  background: $white-primary;
  border: 1px solid rgba(gray, 0.2);
  background: rgba(gray, 0.05);
  width: calc(100% / 4 - 15px + 15px / 4); // ширина конейнера - отступ + поправка по правому отступу
  border-radius: 12px;
  cursor: pointer;

  &:hover {
    border: 1px solid rgba(gray, 0.8);
    background: rgba(gray, 0.08);
    transform: scale(1.02);
    box-shadow: 0 0 32px 0 rgba(white, 0.02);

    .category-item {
      background: rgba(gray, 0.4);
      & > p {
        opacity: 0.9;
      }
    }
  }
}
.p-header {
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > h2 {
    font-size: 28px;
    font-weight: 700;
    opacity: 0.9;
  }

  & > p {
    opacity: 0.7;
    font-size: 16px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 8; /* number of lines to show */
    line-clamp: 8;
    -webkit-box-orient: vertical;
    white-space: pre-line;
  }
}
.p-categories {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;

  & > .category-item {
    padding: 5px 15px;
    border-radius: 8px;
    background: rgba(gray, 0.3);
    & > p {
      font-size: 16px;
      opacity: 0.7;
    }
  }
}
.p-footer {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  & > p {
    opacity: 0.7;
    font-size: 16px;

    width: fit-content;
    white-space: nowrap;
    background: rgba(gray, 0.2);
    padding: 8px 15px;
    border-radius: 16px;
  }

  & > .user-info {
    display: flex;
    gap: 8px;
    align-items: center;
    background: rgba(gray, 0.2);
    padding: 8px 15px;
    border-radius: 16px;
    opacity: 0.7;

    max-width: 50%;

    & > p {
      font-size: 16px;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    & > img {
      opacity: 0.7;
    }

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>
