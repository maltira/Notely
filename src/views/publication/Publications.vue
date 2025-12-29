<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date_format.ts'
import PublicationItem from '@/components/UI/PublicationItem.vue'
import { usePubViewStore } from '@/stores/view.store.ts'
import PublicationModal from '@/components/Modals/PublicationModal.vue'

const pubViewStore = usePubViewStore()
const publicationStore = usePublicationStore()

const { viewMode } = storeToRefs(pubViewStore)

const { searchPublicationQuery, allPublications, isLoading } = storeToRefs(publicationStore)
const { fetchAllPublications, setSearchQuery } = publicationStore

const selectedPublication = ref<string>('')
const isPublicationOpen = ref<boolean>(false)

const togglePublicationModal = (id: string) => {
  isPublicationOpen.value = !isPublicationOpen.value
  selectedPublication.value = id
}

onMounted(async () => {
  await fetchAllPublications()
})
</script>

<template>
  <div class="publications_page">
    <div class="page-header">
      <div class="search-result-header">
        <h1>
          <img
            v-if="searchPublicationQuery"
            src="/icons/arr-black.svg"
            alt="arr"
            style="transform: rotate(180deg)"
            @click="searchPublicationQuery ? setSearchQuery('') : null"
          />
          {{
            searchPublicationQuery
              ? `Результаты по запросу «${searchPublicationQuery}»`
              : 'Все публикации'
          }}
        </h1>
        <p v-if="searchPublicationQuery">Найдено публикаций: {{ allPublications.length }}</p>
      </div>
    </div>
    <div class="list-publication" v-if="allPublications.length > 0">
      <PublicationItem
        v-for="p in allPublications"
        :id="p.id"
        :title="p.title"
        :description="p.description"
        :categories="p.PublicationCategories"
        :created_at="formatDate(p.created_at, 'DD/MM/YYYY HH:mm')"
        :author="p.User"
        :background_color="p.background_color"
        :isWide="viewMode === 'single'"

        @openModal="togglePublicationModal"
      >
      </PublicationItem>
    </div>
    <p v-if="!isLoading && allPublications.length === 0" class="search-result-none">
      Ничего не найдено
    </p>
  </div>

  <PublicationModal
    v-if="selectedPublication && isPublicationOpen"
    :pub_id="selectedPublication"
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
  gap: 10px;
  flex-direction: column;

  & > h1 {
    @include h2-text;
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 36px;

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
  width: calc(
    100% / 4 - 15px + 15px / 4
  ); // ширина конейнера - отступ + поправка по правому отступу
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