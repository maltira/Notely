<script setup lang="ts">
import type { PublicationEntity, PublicationRequest, PublicationUpdateRequest } from '@/types/publication.entity.ts'
import { useNotification } from '@/composables/useNotification.ts'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.store.ts'
import CategoryModal from '@/components/Modals/CategoryModal.vue'
import PublicationItem from '@/components/UI/PublicationItem.vue'
import { ChromePicker } from 'vue-color'
import SelectCategoryStyleModal from '@/components/Modals/SelectCategoryStyleModal.vue'
import type { PublicationCategoriesRequest, PublicationCategoriesUpdateRequest } from '@/types/category.entity.ts'
import { useAppInit } from '@/composables/useAppInit.ts'

interface Props {
  id?: string
}
const props = defineProps<Props>()

const { initApp } = useAppInit()

const userStore = useUserStore()
const { infoNotification } = useNotification()
const publicationStore = usePublicationStore()

const { createPublication, fetchPublication, updatePublication } = publicationStore
const { error } = storeToRefs(publicationStore)

const currentPublication = ref<PublicationEntity | null>(null)
const currentCategories = ref<PublicationCategoriesUpdateRequest[]>([])

const title = ref<string>('')
const description = ref<string>('')
const categories = ref<PublicationCategoriesRequest[]>([])
const backgroundColor = ref<string>('#f6f6f6')
const pickerPosition = ref({ x: 0, y: 0 })

const selectedCategory = ref<PublicationCategoriesRequest | null>(null)
const selectedCategoryID = ref<string>('')

const isCategoryStylePickerOpen = ref(false)
const isBackgroundPickerOpen = ref(false)
const isCategoryModalOpen = ref(false)
const toggleCategoryModal = () => {
  isCategoryModalOpen.value = !isCategoryModalOpen.value
}
const toggleBackgroundPicker = () => {
  isCategoryStylePickerOpen.value = false
  isBackgroundPickerOpen.value = false
  isBackgroundPickerOpen.value = !isBackgroundPickerOpen.value

  if (isBackgroundPickerOpen.value) {
    setTimeout(() => {
      const bg_picker = document.getElementById('bg-picker')
      if (bg_picker) {
        bg_picker.style.opacity = '1'
        bg_picker.style.transform = 'scale(1)'
      }
    }, 1)
  }
}
const toggleCategoryStylePicker = (category: PublicationCategoriesRequest, id: string) => {
  isBackgroundPickerOpen.value = false
  isCategoryStylePickerOpen.value = false
  isCategoryStylePickerOpen.value = !isCategoryStylePickerOpen.value

  if (isCategoryStylePickerOpen.value) {
    selectedCategory.value = category
    selectedCategoryID.value = id
    if (!selectedCategory.value.background_color) {
      selectedCategory.value.background_color = '#f6f6f6'
    }
    if (!selectedCategory.value.text_color) {
      selectedCategory.value.text_color = '#7d7d7d'
    }
  }
}

const addCategory = (category: string) => {
  if (props.id && currentPublication.value) {
    currentCategories.value.push({
      background_color: '#f6f6f6',
      text_color: '#7d7d7d',
      Category: {
        name: category.charAt(0).toUpperCase() + category.slice(1),
      },
    })
  } else {
    categories.value.push({
      background_color: '#f6f6f6',
      text_color: '#7d7d7d',
      Category: {
        name: category.charAt(0).toUpperCase() + category.slice(1),
      },
    })
  }
}

const removeCategory = (id: number) => {
  if (props.id && currentPublication.value) {
    currentCategories.value = currentCategories.value.filter((_, i) => i !== id)
  } else categories.value = categories.value.filter((_, i) => i !== id)
}

const CreatePublication = async (is_draft: boolean) => {
  const req: PublicationRequest = {
    title: title.value,
    description: description.value,
    user_id: userStore.user!.id,
    background_color: backgroundColor.value,
    categories: categories.value,
    is_draft: is_draft,
  }

  await createPublication(req)

  if (error.value) infoNotification('❌ ' + error.value)
  else {
    if (is_draft) infoNotification('📥 Публикация сохранена в черновики')
    else infoNotification(`✅ Создана новая публикация «${req.title}»`)
    router.back()
    await initApp()
  }
}

const SavePublication = async (is_draft: boolean) => {
  const req: PublicationUpdateRequest = {
    id: props.id!,
    title: title.value,
    description: description.value,
    background_color: backgroundColor.value,
    categories: currentCategories.value,
    is_draft: is_draft,
  }

  await updatePublication(req)

  if (error.value) {
    infoNotification('❌ ' + error.value)
  } else {
    if (is_draft) infoNotification('📥 Публикация сохранена в черновики')
    else infoNotification('✅ Публикация успешно опубликована')
    router.back()
    await initApp()
  }
}

const handleCursorPosition = (e: MouseEvent) => {
  pickerPosition.value.x = e.clientX - 220
  pickerPosition.value.y = e.clientY - 65
}

const selectedCategories = computed(() => {
  if (props.id && currentPublication.value) {
    return currentCategories.value
  } else return categories.value
})

onMounted(async () => {
  const main = document.getElementById('main')
  const footer_button = document.getElementById('footer_button')

  if (main && footer_button) {
    setTimeout(() => {
      main.style.transform = 'translateY(0)'
      main.style.opacity = '1'

      footer_button.style.opacity = '1'
      footer_button.style.transform = 'translateY(0)'
    }, 5)
  }

  document.addEventListener('click', handleCursorPosition)

  if (props.id) {
    const pub = await fetchPublication(props.id)
    if (error.value) {
      infoNotification('❌ ' + error.value)
    } else if (pub) {
      currentPublication.value = pub
      title.value = pub.title
      description.value = pub.description
      backgroundColor.value = pub.background_color
      currentCategories.value = pub.PublicationCategories
    }
  }
})
onUnmounted(() => {
  document.removeEventListener('click', handleCursorPosition)
})
</script>

<template>
  <div class="new-publication">
    <div id="main" class="publication_content">
      <div class="main_content">
        <div class="title">
          <div class="info-block">
            <h1>{{ id ? 'Редактировать публикацию' : 'Новая публикация' }}</h1>
            <p>Нажмите на нужный элемент публикации справа, чтоб изменить его стилевое оформление</p>
          </div>
        </div>
        <div class="inputs-block">
          <div class="input-form">
            <p class="input-info">Заголовок <span class="required">*</span></p>
            <input
              v-model="title"
              autocomplete="off"
              required
              type="text"
              placeholder="Введите название"
              :class="{ active: title }"
            />
          </div>
          <div class="input-form">
            <p class="input-info">Содержимое <span class="required">*</span></p>
            <textarea
              v-model="description"
              autocomplete="off"
              required
              type="text"
              placeholder="Введите содержимое публикации"
              :class="{ active: description }"
            />
          </div>
          <div class="input-form">
            <p class="input-info">Укажите категории (не более 4) <span class="required">*</span></p>
            <div class="categories">
              <button class="add-category" @click="toggleCategoryModal" :class="{ disabled: categories.length >= 4 }">
                <img src="/icons/add.svg" alt="add" />
                Добавить
              </button>
              <button class="added-btn active" v-for="(el, i) in selectedCategories" :key="i" @click="removeCategory(i)">
                <img src="/icons/close-white.svg" alt="close" />
                {{ el.Category.name }}
              </button>
            </div>
          </div>
        </div>
      </div>
      <PublicationItem
        :title="title"
        :description="description"
        :background_color="backgroundColor"
        :author="userStore.user!"
        created_at="Сегодня"
        :categories="selectedCategories"
        :is-view-mode="true"
        @toggle-bg-picker="toggleBackgroundPicker"
        @close-bg-picker="isBackgroundPickerOpen = false"
        @toggle-category-picker="toggleCategoryStylePicker"
      />
      <ChromePicker
        @click.stop
        id="bg-picker"
        v-if="isBackgroundPickerOpen"
        v-model="backgroundColor"
        :style="{
          position: 'absolute',
          left: pickerPosition.x + 'px',
          top: pickerPosition.y + 'px',
          borderRadius: '12px',
          overflow: 'hidden',
          boxShadow: '0 0 20px 0 rgba(0, 0, 0, 0.1)',
          opacity: isBackgroundPickerOpen ? 1 : 0,
          transform: isBackgroundPickerOpen ? 'scale(1)' : 'scale(0.8)',
          transition: '50ms',
        }"
      />
      <SelectCategoryStyleModal
        v-if="isCategoryStylePickerOpen"
        :category_id="selectedCategoryID"
        :pos_x="pickerPosition.x"
        :pos_y="pickerPosition.y"
        :category="selectedCategory!"
        @close="isCategoryStylePickerOpen = false"
      />
      <div class="close" @click="router.back()">
        <img src="/icons/close.svg" alt="close" />
      </div>
    </div>

    <div id="footer_button" class="action-content">
      <button class="light cancel" @click="router.back()">Отмена</button>
      <div class="other-buttons">
        <button
          @click="id ? SavePublication(true) : CreatePublication(true)"
          class="light archive"
          :class="{
            disabled: !title && !description && !selectedCategories.length,
          }"
        >
          <img src="/icons/archive.svg" alt="archive" />
          В черновики
        </button>
        <button
          @click="id ? SavePublication(false) : CreatePublication(false)"
          class="dark next"
          :class="{ disabled: !title || !description || !selectedCategories.length }"
        >
          Опубликовать
          <img src="/icons/arr-white.svg" alt="arr" />
        </button>
      </div>
    </div>
  </div>

  <CategoryModal
    v-if="isCategoryModalOpen"
    :categories="categories"
    @close="
      () => {
        isCategoryModalOpen = false
      }
    "
    @select-category="addCategory"
  />
</template>

<style scoped lang="scss">
.new-publication {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100vh;
  padding: 80px 120px;
  overflow: hidden;
  overflow-y: scroll;
}
.publication_content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;

  position: relative;

  opacity: 0;
  transform: translateY(-10px);

  & > .main_content {
    display: flex;
    flex-direction: column;
    gap: 48px;

    width: 100%;
  }
  & > .close {
    position: absolute;
    top: 0;
    right: 0;

    padding: 6px;
    border-radius: 6px;
    background: $gray-primary;
    cursor: pointer;
    & > img {
      opacity: 0.7;
    }

    &:hover {
      & > img {
        opacity: 0.99;
      }
    }
  }
}

.title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > .info-block {
    & > h1 {
      @include h1-text;
    }
    & > p {
      @include main-text;

      margin-top: 16px;
      opacity: 0.6;
    }
  }
}

.inputs-block {
  display: flex;
  flex-direction: column;
  gap: 32px;

  & > .input-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > .input-info {
      @include button-text;
    }

    & > input,
    textarea {
      @include input-form;
    }

    & > textarea {
      min-height: 250px;
      max-height: 800px;
      outline: none;
      max-width: 100%;
      min-width: 100%;
    }
  }
}

.categories {
  display: flex;
  gap: 6px;

  & button {
    @include category-button;
  }
}

.action-content {
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-top: 30px;

  opacity: 0;
  transform: translateY(10px);

  & button {
    &.light {
      @include button-icon;
    }
    &.dark {
      @include big-button;
    }
  }

  & > .other-buttons {
    display: flex;
    gap: 10px;

    & > .next {
      width: 250px;
    }
  }
}
</style>
