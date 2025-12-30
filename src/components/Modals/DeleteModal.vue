<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import Spinner from '@/components/UI/Spinner.vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { useNotification } from '@/composables/useNotification.ts'

const { infoNotification } = useNotification()

const publicationStore = usePublicationStore()
const userStore = useUserStore()
const { user } = storeToRefs(userStore)
const { deletePublication } = publicationStore
const { error, isLoading } = storeToRefs(publicationStore)

interface Props {
  publication_id: string
  publication_title: string
  author_id: string
}
const props = defineProps<Props>()

// обращение к родителю
const emit = defineEmits<{
  close: []
  deleted: []
}>()
const handleClose = (deleted: boolean = false) => {
  const delete_pub_container = document.getElementById('delete_pub_container')
  const delete_pub_content = document.getElementById('delete_pub_content')

  if (delete_pub_container && delete_pub_content) {
    delete_pub_container.style.opacity = '0'
    delete_pub_content.style.transform = 'scale(0.8)'
  }

  setTimeout(() => {
    if (deleted) emit('deleted')
    else emit('close')
  }, 100)
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    handleClose()
  }
}

const onDeletePub = async () => {
  if (user.value && (user.value.id === props.author_id || user.value.Group.name === 'Админ')) {
    await deletePublication(props.publication_id)

    if (error.value) {
      infoNotification('❌ ' + error.value)
    } else {
      infoNotification('😟 Публикация была успешно удалена')
      handleClose(true)
    }
  } else {
    infoNotification('❌ Недостаточно прав для удаления публикации')
  }
}

onMounted(() => {
  const delete_pub_container = document.getElementById('delete_pub_container')
  const delete_pub_content = document.getElementById('delete_pub_content')
  document.addEventListener('keydown', handleKeydown)

  if (delete_pub_container && delete_pub_content) {
    setTimeout(() => {
      delete_pub_container.style.opacity = '1'
      delete_pub_content.style.transform = 'scale(1)'
    }, 1)
  }
})
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div id="delete_pub_container" class="modal-container" @click="handleClose()">
    <div id="delete_pub_content" class="modal-content" @click.stop>
      <div class="modal-header">
        <h4>Удалить публикацию</h4>
        <div class="modal-close-button" @click="handleClose()">
          <img src="/icons/close.svg" alt="close" width="24px" />
        </div>
      </div>
      <p class="main-text">
        Вы уверены, что хотите удалить публикацию <span>«{{ publication_title }}»</span>?
      </p>
      <div class="modal-actions">
        <button class="btn" @click="handleClose()">Отмена</button>
        <button class="btn dark" @click="onDeletePub" :class="{ disabled: isLoading }">
          {{ !isLoading ? 'Удалить' : '' }}
          <Spinner size="small" v-if="isLoading" />
        </button>
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

  width: 424px;
  padding: 24px;
  border-radius: 12px;

  transform: scale(0.8);
  transition: 100ms;

  & > .modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;

    & > h4 {
      @include h4-text;
    }
    & > .modal-close-button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 36px;
      height: 36px;
      background: $gray-primary;

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
}

.main-text {
  @include main-text;
  color: rgba($black-primary, 0.6);

  & > span {
    color: rgba($black-primary, 1);
  }
}

.modal-actions {
  display: flex;
  gap: 10px;

  & > button {
    @include button-icon;
    width: 100%;
    height: 36px;
  }
}
</style>