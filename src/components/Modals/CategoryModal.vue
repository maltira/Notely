<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { useNotification } from '@/composables/useNotification.ts'
import type { PublicationCategoriesRequest } from '@/types/category.entity.ts'

const { infoNotification } = useNotification()

interface Props {
  categories: Array<PublicationCategoriesRequest>
}
const props = defineProps<Props>()

// обращение к родителю
const emit = defineEmits<{
  close: []
  selectCategory: [name: string]
}>()

const handleClose = () => {
  const category_modal = document.getElementById('category_modal')
  const category_modal_content = document.getElementById('category_modal_content')
  if (category_modal && category_modal_content) {
    category_modal.style.opacity = '0'
    category_modal_content.style.transform = 'scale(0.8)'
  }
  setTimeout(() => {
    emit('close')
  }, 100)
}

const category = ref<string>('')
const examples = ref<string[]>(['Психология', 'IT', 'Новости', 'Музыка', 'Научные открытия'])
const inputRef = ref<HTMLInputElement | null>(null)

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

const addCategory = (el?: string) => {
  if (el) {
    if (props.categories.filter((e) => e.Category.name === el).length > 0)
      infoNotification('Вы уже выбрали данную категорию')
    else emit('selectCategory', el)
  } else {
    if (props.categories.filter((e) => e.Category.name === category.value).length > 0)
      infoNotification('Вы уже выбрали данную категорию')
    else if (category.value) emit('selectCategory', category.value)
  }
  handleClose()
}

onMounted(() => {
  const category_modal = document.getElementById('category_modal')
  const category_modal_content = document.getElementById('category_modal_content')

  document.addEventListener('keydown', handleKeydown)

  if (category_modal && category_modal_content) {
    setTimeout(() => {
      category_modal.style.opacity = '1'
      category_modal_content.style.transform = 'scale(1)'
    }, 1)
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div id="category_modal" class="modal-container" @click="handleClose">
    <div id="category_modal_content" class="modal-content" @click.stop>
      <div class="modal-close-button" @click="handleClose">
        <img src="/icons/arr-black.svg" alt="close" width="24px" />
      </div>
      <div class="modal-header">
        <h1>Укажите категорию</h1>
      </div>
      <form
        class="modal-body"
        @click="inputRef!.focus()"
        :class="{ active: category }"
        @submit.prevent="addCategory()"
      >
        <input
          class="form-input"
          v-model="category"
          type="text"
          placeholder="Название категории"
          ref="inputRef"
        />
        <div class="form-add" @click="addCategory()" :class="{ disabled: !category }">
          <img src="/icons/add.svg" alt="add" />
        </div>
      </form>
      <div class="examples">
        <p>Популярные категории</p>
        <div>
          <button
            @click="addCategory(el)"
            class="example-item"
            v-for="(el, i) in examples"
            :key="i"
          >
            {{ el }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.modal-container {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100vh;

  z-index: 1003;
  display: flex;
  align-items: center;
  justify-content: center;

  opacity: 0;
  transition: 100ms;

  background-color: rgba($black-primary, 0.1);
}

.modal-content {
  display: flex;
  flex-direction: column;
  gap: 24px;

  background: $white-primary;
  border: 1px solid rgba($black-primary, 0.1);
  width: 410px;
  position: relative;
  padding: 24px;

  border-radius: 12px;

  transform: scale(0.8);
  transition: 100ms;

  & > .modal-header {
    padding: 0 6px;

    & > h1 {
      @include h4-text;
    }
  }
}

.modal-body {
  @include input-form-button;
}

.examples {
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > p {
    @include tag-text;
    opacity: 0.4;
  }

  & > div {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;

    & > .example-item {
      @include category-button;
    }
  }
}

.modal-close-button {
  position: absolute;
  top: 0;
  left: -48px;

  padding: 6px;
  background: $gray-primary;
  border: 1px solid rgba($black-primary, 0.1);
  border-radius: 10px;

  cursor: pointer;

  & > img {
    opacity: 0.7;
    transform: rotate(180deg);
  }

  &:hover {
    & > img {
      opacity: 1;
    }
  }
}
</style>
