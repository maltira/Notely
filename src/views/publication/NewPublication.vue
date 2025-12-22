<script setup lang="ts">
import type { PublicationRequest } from '@/types/publication.entity.ts'
import { useNotification } from '@/composables/useNotification.ts'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import router from '@/router'
import { onMounted, ref } from 'vue'
import { useUserStore } from '@/stores/user.store.ts'

const userStore = useUserStore()
const { infoNotification } = useNotification()
const publicationStore = usePublicationStore()

const { createPublication } = publicationStore
const { error } = storeToRefs(publicationStore)

const title = ref<string>('')
const description = ref<string>('')
const categories = ref<string[]>([])

const CreatePublication = async () => {
  const req: PublicationRequest = {
    title: title.value,
    description: description.value,
    categories: categories.value,
    user_id: userStore.user!.id,
  }
  await createPublication(req)

  if (error.value) infoNotification('Ошибка: ' + error.value.toString())
  else {
    infoNotification(`Публикация «${req.title}» создана`)
    await router.push('/')
  }
}

onMounted(() => {
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
})
</script>

<template>
  <div class="new-publication">
    <div id="main" class="main-content">
      <div class="title">
        <div class="info-block">
          <h1>Новая публикация</h1>
          <p>Lorem ipsum dolor sit amet consectetur. Est amet cursus dolor nibh venenatis.</p>
        </div>
        <div class="close" @click="router.back()">
          <img src="/icons/close.svg" alt="close" />
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
            <button class="add-category">
              <img src="/icons/add.svg" alt="add" />
              Добавить
            </button>
            <button class="added-btn active">
              <img src="/icons/close-white.svg" alt="close" />
              Культура
            </button>
            <button class="added-btn active">
              <img src="/icons/close-white.svg" alt="close" />
              Новости
            </button>
          </div>
        </div>
      </div>
    </div>
    <div id="footer_button" class="action-content">
      <button class="light cancel" @click="router.back()">Отмена</button>
      <div class="other-buttons">
        <button
          class="light archive"
          :class="{ disabled: !title && !description && !categories.length }"
        >
          <img src="/icons/archive.svg" alt="archive" />
          В черновики
        </button>
        <button
          @click="CreatePublication"
          class="dark next"
          :class="{ disabled: !title || !description || !categories.length }"
        >
          Опубликовать
          <img src="/icons/arr-white.svg" alt="arr" />
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.new-publication {
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  height: 100vh;
  padding: 80px 120px;
}
.main-content {
  display: flex;
  flex-direction: column;
  gap: 48px;

  opacity: 0;
  transform: translateY(-10px);
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

      margin-top: 10px;
      opacity: 0.6;
    }
  }
  & > .close {
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
