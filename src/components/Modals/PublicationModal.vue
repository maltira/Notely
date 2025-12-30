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

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

interface Props {
  pub_id: string
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

const publicationStore = usePublicationStore()
const { error } = storeToRefs(publicationStore)
const { fetchPublication } = publicationStore

const publication = ref<PublicationEntity | null>(null)

const isDeleteModalOpen = ref<boolean>(false)
const toggleDeleteModal = () => {
  isDeleteModalOpen.value = !isDeleteModalOpen.value
}
const editPub = (id: string) => {
  handleClose()
  router.push('/publication/edit/' + id)
}

onMounted(async () => {
  const pub_modal_container = document.getElementById('pub_modal_container')
  const pub_modal_content = document.getElementById('pub_modal_content')

  publication.value = await fetchPublication(props.pub_id)
  if (error.value) {
    infoNotification('❌ ' + error.value)
  }

  if (pub_modal_container && pub_modal_content) {
    setTimeout(() => {
      pub_modal_container.style.opacity = '1'
      pub_modal_content.style.transform = 'scale(1)'
    }, 1)
  }
})
</script>

<template>
  <div
    id="pub_modal_container"
    class="pub_modal_container"
    :style="{ background: publication ? publication.background_color : '#f6f6f6' }"
  >
    <div id="pub_modal_content" class="content">
      <div class="main_content">
        <div v-if="publication" class="header-block">
          <div class="categories">
            <div
              v-if="publication.PublicationCategories.length > 0"
              class="category-item"
              v-for="el in publication.PublicationCategories"
              :style="{ background: el.background_color, color: el.text_color }"
            >
              {{ el.Category.name }}
            </div>
            <div v-else class="category-item">Категории не указаны</div>
          </div>
          <h1>{{ publication.title || 'Заголовок не указан' }}</h1>
        </div>
        <p v-if="publication" class="description">
          {{ publication.description || 'Описание не указано' }}
        </p>
        <div class="close-btn" @click="handleClose">
          <img src="/icons/close.svg" alt="close" width="24px" />
        </div>
      </div>
      <div class="footer_content" v-if="publication">
        <button class="author">{{ publication.User.name }}</button>
        <div class="actions">
          <div class="action-item" v-if="user && publication.User.id !== user.id">
            <img src="/icons/add-circle.svg" alt="add" />
          </div>
          <div
            v-if="user && publication && user.id === publication.User.id"
            class="action-item"
            @click="publication ? editPub(publication.id) : null"
          >
            <img src="/icons/edit-2.svg" alt="edit" />
          </div>
          <div
            v-if="user && publication && user.id === publication.User.id"
            class="action-item"
            @click="toggleDeleteModal"
          >
            <img src="/icons/delete.svg" alt="delete" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <DeleteModal
    v-if="isDeleteModalOpen && publication"
    :publication_id="publication.id"
    :author_id="publication.User.id"
    :publication_title="publication.title"
    @close="handleClose"
    @deleted="handleClose"
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
