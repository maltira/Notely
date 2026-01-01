<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import CategoryModal from '@/components/Modals/CategoryModal.vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'

const publicationStore = usePublicationStore()
const { filter } = storeToRefs(publicationStore)

const emit = defineEmits<{
  close: []
}>()

const isCategoryModalOpen = ref(false)
const toggleCategoryModal = () => {
  isCategoryModalOpen.value = !isCategoryModalOpen.value
}

const removeCategory = (id: number) => {
  filter.value.categories = filter.value.categories.filter((_, i) => i !== id)
}
const addCategory = (category: string) => {
  filter.value.categories.push({
    background_color: '#f6f6f6',
    text_color: '#7d7d7d',
    Category: {
      name: category.charAt(0).toUpperCase() + category.slice(1),
    },
  })
}

const setDate = (date: 'month' | 'six months' | null) => {
  if (filter.value.date === date) {
    filter.value.date = null
    return
  }
  filter.value.date = date
}

const resetFilters = () => {
  filter.value.categories = []
  filter.value.date = null
}

const handleClose = () => {
  const filters_modal = document.getElementById('filters_modal')

  filters_modal!.style.opacity = '0'
  filters_modal!.style.transform = 'scale(0.8)'
  filters_modal!.style.top = '125px'

  setTimeout(() => {
    emit('close')
  }, 100)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

const outsideClick = (e: MouseEvent) => {
  const filters_modal = document.getElementById('filters_modal')
  const category_modal = document.getElementById('category_modal')

  if (!filters_modal!.contains(e.target as Node) && !category_modal) {
    handleClose()
  }
}

onMounted(() => {
  const filters_modal = document.getElementById('filters_modal')

  document.addEventListener('keydown', handleKeydown)

  setTimeout(() => {
    filters_modal!.style.opacity = '1'
    filters_modal!.style.transform = 'scale(1)'
    filters_modal!.style.top = '135px'

    document.addEventListener('click', outsideClick)
  }, 1)
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
  document.removeEventListener('click', outsideClick)
})
</script>

<template>
  <div id="filters_modal" class="filters_modal">
    <div class="header-block">
      <h4>Фильтры</h4>
      <div class="close-button" @click="handleClose">
        <img src="/icons/close.svg" alt="close" />
      </div>
    </div>
    <div class="filters-block">
      <div class="filter date-filter">
        <p>Фильтр по дате</p>
        <div class="variants">
          <button
            class="btn-variant"
            @click="setDate('month')"
            :class="{ active: filter.date === 'month' }"
          >
            Последний месяц
          </button>
          <button
            class="btn-variant"
            @click="setDate('six months')"
            :class="{ active: filter.date === 'six months' }"
          >
            Последние 6 месяцев
          </button>
        </div>
      </div>
      <div class="filter category-filter">
        <p>Фильтр по категориям</p>
        <div class="categories">
          <button @click="toggleCategoryModal" class="btn-variant add-category">
            <img src="/icons/add.svg" alt="add" />
            Добавить
          </button>
          <div class="variants" v-if="filter.categories.length > 0">
            <button
              class="btn-variant active"
              v-for="(el, i) in filter.categories"
              @click.stop="removeCategory(i)"
            >
              <img src="/icons/close-white.svg" alt="close" />
              {{ el.Category.name }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="reset-block">
      <button
        class="btn-reset"
        @click="resetFilters"
        :class="{ disabled: filter.categories.length === 0 && !filter.date }"
      >
        <img src="/icons/restart.svg" alt="reset" />
        Сбросить фильтры
      </button>
    </div>
  </div>

  <CategoryModal
    v-if="isCategoryModalOpen"
    :categories="filter.categories"
    @close="isCategoryModalOpen = false"
    @select-category="addCategory"
  />
</template>

<style scoped lang="scss">
.filters_modal {
  display: flex;
  flex-direction: column;
  gap: 24px;

  border-radius: 12px;
  border: 1px solid rgba($black-primary, 0.1);
  box-shadow: 0 0 32px 0 rgba($black-primary, 0.07);
  padding: 24px;
  background: $white-primary;

  opacity: 0;
  transform: scale(0.8);
  transform-origin: right top;
  transition: 50ms;

  position: absolute;
  right: 90px;
  top: 125px;
  z-index: 1001;
}
.header-block {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 0 6px;

  & > h4 {
    @include h4-text;
  }
  & > .close-button {
    display: flex;
    align-items: center;
    justify-content: center;

    background: $gray-primary;
    padding: 6px;
    border-radius: 6px;

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
.filters-block {
  display: flex;
  flex-direction: column;
  gap: 24px;

  padding: 16px;
  border-radius: 12px;
  border: 1px solid rgba($black-primary, 0.1);

  & > .filter {
    display: flex;
    flex-direction: column;
    gap: 10px;

    & > p {
      @include tag-text;
      opacity: 0.4;
    }
  }
}
.variants {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}
.btn-variant {
  @include category-button;
}
.categories {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.reset-block {
  display: flex;
  justify-content: end;

  & > .btn-reset {
    @include category-button;
  }
}
</style>
