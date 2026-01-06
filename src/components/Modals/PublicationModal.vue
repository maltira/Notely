<script setup lang="ts">
// ? Параметры
import { onMounted, ref } from 'vue'
import type { PublicationEntity } from '@/types/publication.entity.ts'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/useNotification.ts'
import DeleteModal from '@/components/Modals/DeleteModal.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user.store.ts'
import { formatDate } from '@/utils/date_format.ts'
import { useFavoritesStore } from '@/stores/favorite.store.ts'

interface Props {
  pub: PublicationEntity
}
const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
}>()
const handleClose = () => {
  const pub_modal_container = document.getElementById('pub_modal_container')
  const pub_modal_content = document.getElementById('pub_modal_content')

  isDeleteModalOpen.value = false

  if (pub_modal_container && pub_modal_content) {
    pub_modal_content.style.transform = 'scale(0.8)'
    pub_modal_content.style.opacity = '0'
    pub_modal_container.style.opacity = '0'
  }

  setTimeout(() => {
    emit('close')
  }, 100)
}

const { infoNotification } = useNotification()

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

const publicationStore = usePublicationStore()
const { error } = storeToRefs(publicationStore)

const favoriteStore = useFavoritesStore()
const { updateFavorite } = favoriteStore
const { favorites } = storeToRefs(favoriteStore)

const isFavorite = ref<boolean>(false)

const isDeleteModalOpen = ref<boolean>(false)
const toggleDeleteModal = () => {
  isDeleteModalOpen.value = !isDeleteModalOpen.value
}
const editPub = (id: string) => {
  handleClose()
  router.push('/publication/edit/' + id)
}

const changeFavorite = async () => {
  isFavorite.value = !isFavorite.value

  await updateFavorite(props.pub.id, isFavorite.value)

  if (error.value) {
    infoNotification('❌ ' + error.value)
  } else {
    if (isFavorite.value) favorites.value.push(props.pub)
    else favorites.value = favorites.value.filter((p) => p.id !== props.pub.id)
    infoNotification(isFavorite.value ? 'Публикация сохранена в избранное' : 'Публикация удалена из избранного')
  }
}

onMounted(async () => {
  const pub_modal_container = document.getElementById('pub_modal_container')
  const pub_modal_content = document.getElementById('pub_modal_content')

  if (pub_modal_container && pub_modal_content) {
    setTimeout(() => {
      pub_modal_container.style.opacity = '1'
      pub_modal_content.style.transform = 'scale(1)'
    }, 1)
  }

  isFavorite.value = favorites.value.find((p) => p.id === props.pub.id) !== undefined
})
</script>

<template>
  <div id="pub_modal_container" class="pub_modal_container" :style="{ background: pub ? pub.background_color : '#f6f6f6' }">
    <div id="pub_modal_content" class="content">
      <div class="main_content">
        <div v-if="pub" class="header-block">
          <div class="categories">
            <div
              v-if="pub.PublicationCategories.length > 0"
              class="category-item"
              v-for="el in pub.PublicationCategories"
              :style="{ background: el.background_color, color: el.text_color }"
            >
              {{ el.Category.name }}
            </div>
            <div v-else class="category-item">Категории не указаны</div>
          </div>
          <h1>{{ pub.title || 'Заголовок не указан' }}</h1>
          <p>
            {{ pub.created_at ? formatDate(pub.created_at, 'DD/MM/YYYY HH:mm') : 'Дата публикации не указана' }}
          </p>
        </div>
        <p v-if="pub" class="description">
          {{ pub.description || 'Описание не указано' }}
        </p>
        <div class="close-btn" @click="handleClose">
          <img src="/icons/close.svg" alt="close" width="24px" />
        </div>
      </div>
      <div class="footer_content" v-if="pub">
        <button class="author">{{ pub.User.name }}</button>
        <div class="actions">
          <div class="action-item" v-if="user && pub.User.id !== user.id">
            <img src="/icons/add-circle.svg" alt="add" />
          </div>
          <div class="action-item" v-if="user && !pub.is_draft" @click="changeFavorite">
            <img :src="isFavorite ? '/icons/saved-fill.svg' : '/icons/saved-outline.svg'" alt="saved" />
          </div>
          <div v-if="user && pub && user.id === pub.User.id" class="action-item" @click="pub ? editPub(pub.id) : null">
            <img src="/icons/edit-2.svg" alt="edit" />
          </div>
          <div v-if="user && pub && user.id === pub.User.id" class="action-item" @click="toggleDeleteModal">
            <img src="/icons/delete.svg" alt="delete" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <DeleteModal
    v-if="isDeleteModalOpen && pub"
    :publication_id="pub.id"
    :author_id="pub.User.id"
    :publication_title="pub.title"
    @close="handleClose"
  />
</template>

<style scoped lang="scss">
.pub_modal_container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;

  padding: 80px 120px;

  z-index: 1003;
  display: flex;
  align-items: start;
  justify-content: center;

  opacity: 0;
  transition: 100ms;

  overflow-y: scroll;

  background-color: $gray-primary;
}

.content {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 48px;

  width: 100%;
  min-height: 100%;

  padding: 48px;
  background: $white-primary;
  border-radius: 20px;

  box-shadow: 0 0 32px 0 rgba($black-primary, 0.05);

  transform: scale(0.8);
  transition: 100ms;
}

.main_content {
  position: relative;

  display: flex;
  flex-direction: column;
  gap: 24px;

  & > .header-block {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > .categories {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      & > .category-item {
        @include info-block;
      }
    }
    & > h1 {
      @include h1-text;
    }
    & > p {
      @include button-text;
      opacity: 0.3;
    }
  }
  & > .description {
    @include main-text;
    opacity: 0.7;
  }
  & > .close-btn {
    position: absolute;
    top: 0;
    right: 0;
    width: 36px;
    height: 36px;
    padding: 6px;

    border-radius: 6px;
    background-color: $gray-primary;
    cursor: pointer;

    & > img {
      opacity: 0.7;
    }
    &:hover {
      & > img {
        opacity: 1;
      }
    }
  }
}

.footer_content {
  display: flex;
  align-items: center;
  justify-content: space-between;

  & > .author {
    @include button-text;

    background: $gray-primary;
    padding: 10px 16px;
    border-radius: 6px;

    color: rgba($black-primary, 0.7);
    cursor: pointer;

    &:hover {
      color: rgba($black-primary, 0.99);
    }
  }
  & > .actions {
    display: flex;
    align-items: center;
    gap: 10px;

    & > .action-item {
      display: flex;
      align-items: center;
      justify-content: center;

      width: 36px;
      height: 36px;

      padding: 8px;
      background: $gray-primary;
      border-radius: 6px;

      cursor: pointer;

      & > img {
        width: 20px;
        height: 20px;
        opacity: 0.5;
      }

      &:hover {
        & > img {
          opacity: 0.9;
        }
      }
    }
  }
}
</style>
