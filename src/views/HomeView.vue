<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date_format.ts'
import type { PublicationEntity, PublicationRequest } from '@/types/publication.entity.ts'
import { useNotification } from '@/composables/useNotification.ts'
import { useUserStore } from '@/stores/user.store.ts'
import { parseCategories } from '@/utils/validate_categories.ts'

const { infoNotification } = useNotification()

const userStore = useUserStore()
const publicationStore = usePublicationStore()

const { user } = storeToRefs(userStore)
const { error, searchPublicationQuery, allPublications, isLoading } = storeToRefs(publicationStore)
const { fetchAllPublications, createPublication, deletePublication, setSearchQuery } =
  publicationStore

const isPublicationModalOpen = ref(false)
const publicationOpen = ref<PublicationEntity | null>(null)
const isNewPostModalOpen = ref(false)

const togglePublicationModal = (id: number) => {
  isPublicationModalOpen.value = !isPublicationModalOpen.value

  if (isPublicationModalOpen.value && allPublications.value[id]) {
    publicationOpen.value = allPublications.value[id]
  } else {
    publicationOpen.value = null
  }
}
const toggleNewPostModal = () => {
  isNewPostModalOpen.value = !isNewPostModalOpen.value
}

const DeletePublication = async (id: string) => {
  await deletePublication(id)
  if (error.value) {
    infoNotification('Ошибка: ' + error.value.toString())
  } else {
    infoNotification(`Вы успешно удалили публикацию`)
    isPublicationModalOpen.value = false
  }
}
const CreatePublication = async (req: PublicationRequest) => {
  await createPublication(req)

  if (error.value) {
    infoNotification('Ошибка: ' + error.value.toString())
  } else {
    infoNotification(`Публикация «${req.title}» создана`)
    isNewPostModalOpen.value = false
  }
}

onMounted(async () => {
  await fetchAllPublications()
})
</script>

<template>
  <div class="publications_page">
    <div class="page-header">
      <div class="search-result-header">
        <p
          v-if="searchPublicationQuery"
          @click="searchPublicationQuery ? setSearchQuery('') : null"
        >
          ← Все публикации
        </p>
        <h1>
          {{
            searchPublicationQuery
              ? `Публикации по запросу «${searchPublicationQuery}»`
              : 'Все публикации'
          }}
        </h1>
      </div>
      <button
        v-if="(user && user.Group.name === 'Админ') || (user && user.Group.can_publish_posts)"
        @click="toggleNewPostModal"
        class="button new-post"
      >
        <img src="/icons/add.svg" alt="add" />
        Новая публикация
      </button>
    </div>
    <div class="list-publication" v-if="!isLoading && allPublications.length > 0">
      <div
        v-for="(p, i) in allPublications"
        :key="i"
        class="publication-item"
        @click="togglePublicationModal(i)"
      >
        <div class="p-header">
          <h2>{{ p.title }}</h2>
          <p>{{ p.description }}</p>
          <div class="p-categories" v-if="parseCategories(p.categories).length > 0">
            <div
              class="category-item"
              v-for="(c, i) in parseCategories(p.categories).slice(0, 5)"
              :key="i"
            >
              <p>{{ c }}</p>
            </div>
          </div>
        </div>
        <div class="p-footer">
          <div class="user-info">
            <img
              width="16px"
              src="/icons/user.svg"
              alt=""
            />
            <p>{{ p.User.name || 'Unknown' }}</p>
          </div>
          <p>{{ formatDate(p.created_at, 'DD/MM/YYYY HH:mm') }}</p>
        </div>
      </div>
    </div>
    <p v-if="!isLoading && allPublications.length === 0" class="search-result-none">
      Ничего не найдено
    </p>
  </div>

<!--  <NewPostModal-->
<!--    :is-open="isNewPostModalOpen"-->
<!--    :create-post="CreatePublication"-->
<!--    @close="isNewPostModalOpen = false"-->
<!--  />-->
<!--  <PublicationModal-->
<!--    :is-open="isPublicationModalOpen"-->
<!--    :on-delete="DeletePublication"-->
<!--    :publication="publicationOpen"-->
<!--    @close="isPublicationModalOpen = false"-->
<!--  />-->
</template>

<style scoped lang="scss">
.publications_page {
  margin-top: 80px;
  padding: 50px 50px;
  display: flex;
  flex-direction: column;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.button {
  height: 40px;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  opacity: 0.7;
  cursor: pointer;

  width: fit-content;
  padding: 10px 20px;
  background: rgba(gray, 0.2);
  border-radius: 32px;

  & > img {
    width: 16px;
    transform: translateY(1px);
  }

  &:hover {
    opacity: 0.9;
  }
}

.search-result-header {
  display: flex;
  gap: 10px;
  flex-direction: column;
  margin-bottom: 35px;
  & > h1 {
    font-size: 36px;
  }
  & > p {
    font-size: 16px;
    opacity: 0.7;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
.search-result-none {
  height: 400px;
  display: flex;
  justify-content: center;
  align-items: center;
  opacity: 0.7;
  padding: 10px;
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