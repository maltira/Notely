<script setup lang="ts">
import Skeleton from '@/components/UI/Skeleton.vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { computed, ref } from 'vue'
import type { Category, PublicationCategoriesRequest } from '@/types/category.entity.ts'
import router from '@/router'
import { storeToRefs } from 'pinia'
import { useCategoriesStore } from '@/stores/categories.store.ts'

const publicationStore = usePublicationStore()
const { filter } = storeToRefs(publicationStore)
const categoriesStore = useCategoriesStore()
const { categories, isLoading } = storeToRefs(categoriesStore)

const search = ref<string>('')
const isSearchOpen = ref(false)

const toggleSearch = () => {
  const searchInput = document.getElementById('search-categories')
  isSearchOpen.value = !isSearchOpen.value

  if (searchInput && isSearchOpen.value) {
    searchInput.focus()
  }
}

const handleSearch = async () => {
  const searchInput = document.getElementById('search-categories')
  isSearchOpen.value = false
  if (searchInput) {
    searchInput!.blur()
  }
}

const allCategories = computed(() => {
  if (!categories.value) return null

  if (!search.value.trim()) {
    return categories.value
  }

  const searchTerm = search.value.toLowerCase().trim()

  let filteredGroups = null
  let filteredOther = null

  if (categories.value.groups) {
    filteredGroups = categories.value.groups
      .map((group) => {
        const filteredCategories = group.categories.filter((category) => category.name.toLowerCase().includes(searchTerm))

        if (filteredCategories.length > 0) {
          return {
            ...group,
            categories: filteredCategories,
          }
        }
        return null
      })
      .filter((group) => group !== null)
  }
  if (categories.value.other) {
    filteredOther = categories.value.other.filter((other) => other.name.toLowerCase().includes(searchTerm))
  }

  return {
    groups: filteredGroups,
    other: filteredOther,
  }
})

const goToCategory = (category: Category) => {
  router.push(`/`)

  const req: PublicationCategoriesRequest = {
    background_color: '#f7f7f7',
    text_color: '7d7d7d',
    Category: category,
  }

  setTimeout(() => {
    filter.value.categories.push(req)
  }, 1)
}

const hasGroups = computed(() => {
  return allCategories.value && allCategories.value.groups && allCategories.value.groups.length > 0
})
const hasOther = computed(() => {
  return allCategories.value && allCategories.value.other && allCategories.value.other.length > 0
})
</script>

<template>
  <div class="categories_page">
    <div class="title_block">
      <h2>Категории</h2>
      <p>Здесь представлены все категории публикаций</p>
    </div>
    <form
      autocomplete="off"
      @submit.prevent="handleSearch"
      class="search-record"
      :class="{ active: search }"
      @click="toggleSearch"
    >
      <img src="/icons/search.svg" alt="add" />
      <input id="search-categories" placeholder="Поиск по категориям" type="text" @blur="isSearchOpen = false" v-model="search" />
    </form>

    <div class="categories_list skeleton" v-if="isLoading">
      <div class="category-block" v-for="i in 12" :key="i">
        <Skeleton width="25px" height="32px" border-radius="6px" />
        <div class="categories-block_items">
          <Skeleton width="150px" height="34px" border-radius="6px" v-for="j in Math.round(5 * Math.random())" :key="j" />
        </div>
      </div>
    </div>

    <div class="categories_list" v-else-if="allCategories">
      <template v-if="hasGroups || hasOther">
        <div class="category-block" v-for="el in allCategories.groups">
          {{ el.letter }}
          <div class="categories-block_items">
            <button class="btn-counter" v-for="cat in el.categories" @click="goToCategory(cat)">
              {{ cat.name }}
              <span class="counter">{{ cat.PublicationCategories.length }}</span>
            </button>
          </div>
        </div>
        <div class="category-block" v-if="hasOther">
          #
          <div class="categories-block_items">
            <button class="btn-counter" v-for="cat in allCategories.other" @click="goToCategory(cat)">
              {{ cat.name }}
              <span class="counter">{{ cat.PublicationCategories.length }}</span>
            </button>
          </div>
        </div>
      </template>
    </div>
    <p class="not-found" v-if="!isLoading && allCategories && !hasOther && !hasGroups">Ничего не найдено</p>
  </div>
</template>

<style scoped lang="scss">
.categories_page {
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > .title_block {
    display: flex;
    flex-direction: column;
    gap: 8px;

    & > h2 {
      @include h2-text;
    }
    & > p {
      @include button-text;
      opacity: 0.6;
    }
  }
}
.categories_list {
  display: flex;
  flex-direction: column;

  & > .category-block {
    @include h2-text;

    display: flex;
    flex-direction: column;
    gap: 12px;

    padding: 24px 8px;
    border-bottom: 1px solid rgba($black-primary, 0.1);

    & > .categories-block_items {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;

      & > .btn-counter {
        @include category-counter;
      }
    }

    &:first-child {
      padding-top: 8px;
    }
    &:last-child {
      border-bottom: 1px solid transparent;
    }
  }
}
form {
  @include input-form-icon;
  gap: 10px;
  width: 100%;

  cursor: text;

  & > input {
    @include button-text;

    &::placeholder {
      transition: 200ms;
      opacity: 0.5;
    }
  }
  & > img {
    width: 20px;
    transform: translateY(1px);
  }

  &:hover {
    & > input::placeholder {
      opacity: 0.85;
    }
  }
}
.not-found {
  @include button-text;
  opacity: 0.6;

  display: flex;
  align-items: center;
  justify-content: center;
  height: 120px;
}
</style>
