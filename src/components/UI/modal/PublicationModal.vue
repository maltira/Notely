<script setup lang="ts">
import { watch } from 'vue'
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'
import { useThemeStore } from '@/stores/theme.store.ts'
import type { PublicationEntity } from '@/types/publication.entity.ts'
import { formatDate } from '@/utils/date_format.ts'

const themeStore = useThemeStore()
const { theme } = storeToRefs(themeStore)

const userStore = useUserStore()
const { isLoading } = storeToRefs(userStore)
const { user } = storeToRefs(userStore)

interface Props {
  isOpen: boolean,
  publication: PublicationEntity | null,
  onDelete: (id: string) => Promise<void>,
}
const props = defineProps<Props>()

// обращение к родителю
const emit = defineEmits<{ close: [] }>()
const handleClose = () => {
  emit('close')
}

const handleKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.isOpen) {
    handleClose()
  }
}

// слежка за isOpen
watch(() => props.isOpen, (newValue) => {
  if (newValue) {
    document.addEventListener('keydown', handleKeydown)
  } else {
    document.removeEventListener('keydown', handleKeydown)
  }
})
</script>

<template>
  <div class="modal-container" :class="{active: isOpen, 'dark-theme': theme === 'dark'}" @click="handleClose">
    <div class="modal-content" @click.stop>
      <div class="modal-close-button">
        <img src="/icons/close.svg" @click="handleClose"  alt="close" width="30px">
      </div>
      <div class="modal-header">
        <h1>Публикация</h1>
      </div>
      <div class="modal-body">
        <h2>{{props.publication ? props.publication.title : "Unknown"}}</h2>
        <p>{{props.publication ? props.publication.description : "Unknown"}}</p>
        <div>
          <p>{{props.publication ? props.publication.User.name : "Unknown"}}</p>
          <p>{{props.publication ? formatDate(props.publication.created_at, 'DD/MM/YYYY HH:mm') : "Unknown"}}</p>
        </div>
      </div>
      <img v-if="user && user.Group.name === 'Админ'" @click="props.publication && user && user.Group.name === 'Админ' ? onDelete(props.publication.id) : null" class="delete-publication" :src="theme === 'dark' ? '/icons/delete-white.svg' : '/icons/delete.svg'" alt="del">
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
  visibility: hidden;
  opacity: 0;
  z-index: 1003;

  display: flex;
  align-items: center;
  justify-content: center;

  &.active {
    background: rgba(black, 0.1);
    backdrop-filter: blur(4px);
    visibility: visible;
    opacity: 1;

    &.dark-theme {
      background: rgba(white, 0.1);
    }
  }
}
.modal-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  background: $background-color;
  width: 500px;
  position: relative;
  padding: 40px;

  border-radius: 16px;

  & > .modal-header{
    display: flex;
    & > h1 {
      font-size: 24px;
      text-align: center;
    }
  }
}
.modal-body{
  display: flex;
  flex-direction: column;
  gap: 25px;

  padding: 20px;
  border-radius: 16px;

  background-color: rgba(gray, 0.1);

  & > p, & > div > p {
    font-size: 16px;
    opacity: 0.7;
  }
  & > div {
    display: flex;
    justify-content: space-between;
  }
}
.modal-close-button{
  cursor: pointer;
  padding: 4px;
  border-radius: 32px;
  background: $white-primary;
  position: absolute;
  top: 0;
  right: calc(-36px - 12px);

  opacity: 0.6;
  &:hover{
    opacity: 0.8;
  }
  & > img {
    width: 28px;
    height: 28px;
  }
}
.delete-publication{
  position: absolute;
  top: 40px;
  right: 40px;
  opacity: 0.5;
  cursor: pointer;
  &:hover{
    opacity: 0.8;
  }
}
</style>