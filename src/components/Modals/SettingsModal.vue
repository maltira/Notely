<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/stores/user.store.ts'
import type { UpdatedUser } from '@/types/user.entity.ts'
import Spinner from '@/components/UI/Spinner.vue'
import { useNotification } from '@/composables/useNotification.ts'

const { infoNotification } = useNotification()
const userStore = useUserStore()
const { user, error, isLoading } = storeToRefs(userStore)
const { updateUser } = userStore

// обращение к родителю
const emit = defineEmits<{ close: [] }>()
const handleClose = () => {
  const settings_modal = document.getElementById('settings_modal')
  const settings_modal_content = document.getElementById('settings_modal_content')

  if (settings_modal && settings_modal_content) {
    settings_modal.style.opacity = '0'
    settings_modal_content.style.transform = 'scale(0.8)'
  }
  setTimeout(() => {
    emit('close')
  }, 100)
}

const name = ref<string>('')
const description = ref<string>('')
const avatar = ref<string>('')

const isAvatarSelectOpen = ref(false)
const allowedAvatars = ref<string[]>(['burger.jpg', 'chicken.jpg', 'croissant.jpg', 'sushi.jpg'])
const selectAvatar = (newAvatar: string) => {
  const settings_avatars = document.getElementById('settings_avatars')
  if (settings_avatars) {
    settings_avatars.style.height = '316px'
    settings_avatars.style.width = '688.41px'
    settings_avatars.style.opacity = '0'
    settings_avatars.style.transform = 'translateX(80px)'
  }
  avatar.value = newAvatar

  setTimeout(() => {
    isAvatarSelectOpen.value = false

    setTimeout(() => {
      const settings_body = document.getElementById('settings_body')
      if (settings_body) {
        settings_body.style.opacity = '1'
      }
    }, 1)
  }, 100)
}
const toggleAvatar = () => {
  const settings_body = document.getElementById('settings_body')

  if (settings_body) {
    settings_body.style.opacity = '0'
    settings_body.style.transform = 'translateX(80px)'
  }

  setTimeout(() => {
    isAvatarSelectOpen.value = true

    setTimeout(() => {
      const settings_avatars = document.getElementById('settings_avatars')
      if (settings_avatars && settings_body) {
        settings_avatars.style.height = '200px'
        settings_avatars.style.width = '550px'
        settings_avatars.style.opacity = '1'
        settings_avatars.style.transform = 'translateX(0)'
      }
    }, 1)
  }, 100)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

const isUpdateAvailable = computed(() => {
  if (user.value) {
    return (
      (name.value != '' && name.value != user.value.name) ||
      (description.value != '' && description.value != user.value.description) ||
      avatar.value != user.value.avatar
    )
  } else return false
})

const UpdateUser = async () => {
  if (isUpdateAvailable && user.value) {
    const req: UpdatedUser = user.value
    if (name.value != '' && name.value != user.value.name) req.name = name.value
    if (description.value != '' && description.value != user.value.description)
      req.description = description.value
    if (avatar.value != user.value.avatar) req.avatar = avatar.value

    await updateUser(req)

    if (error.value) {
      infoNotification('❌ ' + error.value)
    } else {
      infoNotification('🎉 Ваш профиль успешно обновлён')
      handleClose()
    }
  }
}

onMounted(() => {
  const settings_modal = document.getElementById('settings_modal')
  const settings_modal_content = document.getElementById('settings_modal_content')
  const settings_body = document.getElementById('settings_body')
  document.addEventListener('keydown', handleKeydown)

  if (settings_modal && settings_modal_content && settings_body) {
    setTimeout(() => {
      settings_modal.style.opacity = '1'
      settings_modal_content.style.transform = 'scale(1)'
      settings_body.style.opacity = '1'
    }, 1)
  }

  if (user.value) {
    name.value = user.value.name || ''
    description.value = user.value.description || ''
    avatar.value = user.value.avatar || ''
  }
})

onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div id="settings_modal" class="modal-container" @click="handleClose">
    <div id="settings_modal_content" class="modal-content" @click.stop>
      <div class="modal-header">
        <h1>Настройки профиля</h1>
        <img @click="handleClose" src="/icons/close.svg" alt="close" width="24px" />
      </div>
      <div id="settings_avatars" v-if="isAvatarSelectOpen" class="select-avatar">
        <img
          v-for="(el, i) in allowedAvatars"
          :key="i"
          @click="selectAvatar(el)"
          :src="`/img/avatars/${el}`"
          alt="avatar"
          :class="{selected: avatar === el}"
        />
      </div>
      <div id="settings_body" v-else class="modal-body">
        <div class="avatar-block">
          <div class="avatar-block_preview">
            <img
              v-if="user && avatar"
              class="avatar-preview"
              :src="`/img/avatars/${avatar}`"
              alt="avatar"
            />
            <div class="avatar-preview none" v-else>
              {{ user ? name[0] : 'Ч' }}
            </div>
            <div class="close-avatar" v-if="user && avatar" @click="avatar = ''">
              <img src="/icons/close-white.svg" alt="close" />
            </div>
          </div>
          <div class="avatar-block_info">
            <p class="title">Выберите изображение</p>
            <p class="desc">Доступны 4 аватара</p>
          </div>
          <button class="file-selector" @click="toggleAvatar">Выбрать</button>
        </div>
        <div class="divider"></div>
        <div class="input-block">
          <div class="inputs">
            <div class="input-form">
              <p class="input-info">Имя автора <span class="required">*</span></p>
              <input
                v-model="name"
                required
                type="text"
                placeholder="Укажите имя"
                :class="{ active: name }"
              />
            </div>
            <div class="input-form">
              <p class="input-info">Биография</p>
              <textarea
                v-model="description"
                type="text"
                placeholder="Кратко расскажите о себе"
                :class="{ active: description }"
                maxlength="50"
              />
            </div>
          </div>
          <div class="buttons">
            <button class="cancel" @click="handleClose">Отмена</button>
            <button class="save dark" @click="UpdateUser" :class="{ disabled: !isUpdateAvailable }">
              <Spinner size="small" v-if="isLoading" />
              {{ isLoading ? '' : 'Сохранить изменения' }}
            </button>
          </div>
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

  opacity: 0;
  transition: 100ms;

  display: flex;
  align-items: center;
  justify-content: center;

  background-color: rgba($black-primary, 0.1);
}

.modal-content {
  display: flex;
  flex-direction: column;
  background: $white-primary;
  position: relative;

  border-radius: 16px;
  border: 1px solid rgba($black-primary, 0.1);

  transform: scale(0.8);
  transition: 100ms;

  overflow: hidden;

  & > .modal-header {
    display: flex;
    justify-content: space-between;
    padding: 20px 32px;

    border-bottom: 1px solid rgba($black-primary, 0.1);

    & > h1 {
      @include h4-text;
    }

    & > img {
      opacity: 0.7;
      cursor: pointer;

      &:hover {
        opacity: 1;
      }
    }
  }
}

.modal-body {
  display: flex;
  padding: 24px 0;

  opacity: 0;
  transition: 100ms;

  & > .avatar-block {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 20px;

    padding: 0 32px;

    & > .avatar-block_preview {
      position: relative;
      width: fit-content;

      & > .avatar-preview {
        @include h5-text;

        display: flex;
        align-items: center;
        justify-content: center;

        width: 64px;
        height: 64px;

        border: 1px solid rgba($black-primary, 0.1);
        border-radius: 100%;

        cursor: default;

        &.none {
          color: $blue-color;
          background: rgba($blue-color, 0.1);
        }
      }

      & > .close-avatar {
        display: flex;
        justify-content: center;
        align-items: center;

        position: absolute;
        top: 0;
        right: 0;

        padding: 2px;
        border: 2.5px solid $white-primary;

        cursor: pointer;

        background: #8e8e8e;
        border-radius: 100%;

        opacity: 0;
        pointer-events: none;
        transition: 100ms;

        & > img {
          width: 16px;
          height: 16px;
        }

        &:hover {
          background: #7e7e7e;
        }
      }

      &:hover {
        & > .close-avatar {
          opacity: 1;
          pointer-events: auto;
        }
      }
    }
    & > .avatar-block_info {
      display: flex;
      flex-direction: column;
      justify-content: center;
      gap: 6px;

      & > p {
        @include button-text;
        text-align: center;

        &.desc {
          opacity: 0.4;
        }
      }
    }
    & > .file-selector {
      @include button-icon;
      height: 36px;
    }
  }
  & > .divider {
    width: 1px;
    border-left: 1px solid rgba($black-primary, 0.1);
  }
  & > .input-block {
    display: flex;
    flex-direction: column;
    gap: 24px;

    padding: 0 32px;

    & > .inputs {
      display: flex;
      flex-direction: column;
      gap: 16px;

      & > .input-form {
        display: flex;
        flex-direction: column;
        gap: 12px;

        width: 390px;

        & > p {
          @include button-text;
        }
        & > input,
        textarea {
          @include input-form;
        }
        & > textarea {
          height: 82px;
          min-height: 82px;
          max-height: 82px;
          max-width: 100%;
          min-width: 100%;

          outline: none;
        }
      }
    }
    & > .buttons {
      display: flex;
      justify-content: end;
      gap: 10px;

      & > button {
        @include button-icon;
        height: 36px;
      }
    }
  }
}

.select-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 20px;

  height: 316px;
  width: 688.41px;
  padding: 24px 32px;

  opacity: 0;
  transform: translateX(-80px);
  transition: 100ms;

  & > img {
    width: 96px;
    height: 96px;
    border-radius: 100%;
    border: 1px solid rgba($black-primary, 0.1);
    cursor: pointer;

    &:hover {
      transform: scale(1.1);
    }

    &.selected {
      pointer-events: none;
      opacity: 0.5;
    }
  }
}
</style>