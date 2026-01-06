<script setup lang="ts">
import type { UserEntity } from '@/types/user.entity.ts'
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import { onMounted, onUnmounted, ref } from 'vue'
import type { PublicationCategories, PublicationCategoriesRequest } from '@/types/category.entity.ts'
import DeleteModal from '@/components/Modals/DeleteModal.vue'
import router from '@/router'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

// ? Параметры
interface Props {
  id?: string
  title: string
  description: string
  background_color?: string
  author: UserEntity
  created_at: Date | string
  categories: Array<PublicationCategories | PublicationCategoriesRequest>

  isWide?: boolean

  isViewMode?: boolean // true - процесс создания/обновления, false - обычный режим
}
const props = withDefaults(defineProps<Props>(), {
  isWide: false,
  isViewMode: false,
  background_color: '#F6F6F6',
})
const emit = defineEmits<{
  closeBgPicker: []
  toggleBgPicker: []
  toggleCategoryPicker: [category: PublicationCategoriesRequest, id: string]

  openModal: [id: string]
}>()

const handleHover = (e: MouseEvent) => {
  const publication_container = document.getElementById('publication_container')
  const publication_content = document.getElementById('publication_content')
  if (publication_container?.contains(e.target as Node) && !publication_content?.contains(e.target as Node) && props.isViewMode) {
    publication_container?.classList.add('view-mode-background')
  } else {
    publication_container?.classList.remove('view-mode-background')
  }
}
const handleBackgroundClick = (e: MouseEvent) => {
  const publication_container = document.getElementById('publication_container')
  const publication_content = document.getElementById('publication_content')
  if (publication_container?.contains(e.target as Node) && !publication_content?.contains(e.target as Node) && props.isViewMode) {
    emit('toggleBgPicker')
  } else {
    emit('closeBgPicker')
  }
}

const isDeleteModalOpen = ref<boolean>(false)
const toggleDeleteModal = () => {
  isDeleteModalOpen.value = !isDeleteModalOpen.value
}

const editPub = (id: string) => {
  router.push('/publication/edit/' + id)
}

onMounted(() => {
  if (props.isViewMode) {
    document.addEventListener('mousemove', handleHover)
    document.addEventListener('click', handleBackgroundClick)
  }
})
onUnmounted(() => {
  if (props.isViewMode) {
    document.removeEventListener('mousemove', handleHover)
    document.removeEventListener('click', handleBackgroundClick)
  }
})
</script>

<template>
  <div
    id="publication_container"
    class="publication-container"
    :style="{ background: background_color, width: isWide ? '100%' : '341px' }"
  >
    <div
      class="content"
      id="publication_content"
      :class="{ 'view-mode-content': isViewMode }"
      @click="id ? emit('openModal', id) : null"
    >
      <div class="content_categoies">
        <div
          v-if="categories.length > 0"
          :id="`category-${i}`"
          class="category-item"
          v-for="(el, i) in categories"
          :style="{ background: el.background_color, color: el.text_color }"
          :class="{ 'view-mode-category': isViewMode }"
          @click="isViewMode ? emit('toggleCategoryPicker', el, `category-${i}`) : null"
        >
          {{ el.Category.name }}
        </div>
        <div v-else class="category-item">Публикация 📗</div>
      </div>
      <div class="content_text">
        <div class="text_title">
          <h4 class="title">{{ title || 'Здесь будет название публикации' }}</h4>
          <p class="created_ad">{{ created_at }}</p>
        </div>
        <p class="description">
          {{
            description ||
            'Aliquet nec vitae tortor amet at auctor justo quis neque. Sit quis lobortis faucibus tempus auctor adipiscing nam tellus consequat. Vestibulum pretium etiam in vulputate dictumst sit. Sagittis adipiscing accumsan viverra egestas.'
          }}
        </p>
      </div>
    </div>
    <div class="footer">
      <p class="author-name">{{ author.name }}</p>
      <div class="actions" v-if="!isViewMode">
        <img v-if="user && author.id != user.id" src="/icons/add-circle.svg" alt="subscribe" />
        <img v-if="user && author.id === user.id" @click="id ? editPub(id) : null" src="/icons/edit-2.svg" alt="edit" />
        <img v-if="user && author.id === user.id" @click="id ? toggleDeleteModal() : null" src="/icons/delete.svg" alt="edit" />
      </div>
    </div>
  </div>

  <DeleteModal
    v-if="isDeleteModalOpen && id"
    :publication_id="id"
    :author_id="author.id"
    :publication_title="title"
    @close="isDeleteModalOpen = false"
  />
</template>

<style scoped lang="scss">
.publication-container {
  display: flex;
  flex-direction: column;
  gap: 10px;

  width: 341px;
  flex-shrink: 0;

  padding: 16px 16px 20px 16px;
  border: 1px solid rgba($black-primary, 0.1);
  border-radius: 20px;

  background: $gray-primary;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  padding: 28px;
  border-radius: 20px;
  background: $white-primary;

  height: 100%;

  cursor: pointer;
  transition: 200ms ease-in-out;

  & > .content_categoies {
    display: flex;
    flex-wrap: nowrap;
    overflow: hidden;
    gap: 6px;

    & > .category-item {
      @include info-block;

      border: 1px solid transparent;
      &.view-mode-category:hover {
        cursor: pointer;
        background: rgba($blue-color, 0.1) !important;
        border: 1px dashed rgba($blue-color, 0.4) !important;
      }
    }
  }

  & > .content_text {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > .text_title {
      display: flex;
      flex-direction: column;
      gap: 2px;

      & > h4 {
        @include h4-text;

        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
        text-overflow: ellipsis;
        overflow: hidden;
      }

      & > p {
        @include tag-text;
        opacity: 0.4;
      }
    }
    & > .description {
      @include main-text;

      display: -webkit-box;
      -webkit-line-clamp: 6;
      line-clamp: 6;
      -webkit-box-orient: vertical;
      text-overflow: ellipsis;
      overflow: hidden;

      opacity: 0.8;
    }
  }

  &:hover {
    border-radius: 28px;
    transform: translateY(1px);
    box-shadow: 0 8px 24px 0 rgba($black-primary, 0.04);
  }

  &.view-mode-content {
    cursor: default;
    &:hover {
      transform: none;
      box-shadow: none;
    }
  }
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 6px;

  & > .author-name {
    @include button-text;
    opacity: 0.7;
    cursor: pointer;

    &:hover {
      opacity: 0.99;
    }
  }
  & > .actions {
    display: flex;
    align-items: center;
    gap: 10px;

    & > img {
      cursor: pointer;
      opacity: 0.5;

      width: 16px;
      height: 16px;

      &:hover {
        opacity: 0.8;
      }
    }
  }
}

.view-mode-background {
  cursor: pointer;
  background: rgba($blue-color, 0.1) !important;
  border: 1px dashed rgba($blue-color, 0.4) !important;
}
</style>
