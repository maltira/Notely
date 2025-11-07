<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { usePublicationStore } from '@/stores/publication.store.ts'
import { storeToRefs } from 'pinia'
import { formatDate } from '@/utils/date_format.ts'
import type { PublicationEntity } from '@/types/publication.entity.ts'
import PublicationModal from '@/components/UI/modal/PublicationModal.vue'
import { useNotification } from '@/composables/useNotification.ts'

const {success, err} = useNotification()

const publicationStore = usePublicationStore()
const { publications, isLoading, error } = storeToRefs(publicationStore)
const { fetchAllPublications, createPublication, deletePublication  } = publicationStore

const isPublicationModalOpen = ref(false)
const publicationOpen = ref<PublicationEntity | null>(null)

const togglePublicationModal = (id: number) => {
  isPublicationModalOpen.value = !isPublicationModalOpen.value

  if (isPublicationModalOpen.value && publications.value[id]) {
    publicationOpen.value = publications.value[id]
  } else {
    publicationOpen.value = null
  }
}
const DeletePublication = async (id: string) => {
  await deletePublication(id)
  if (error.value) {
    err("Неудачно", error.value)
  }
  else {
    success("Публикация удалена", `Вы успешно удалили публикацию с ID: ${id}`)
    await fetchAllPublications()
    isPublicationModalOpen.value = false
  }
}

onMounted(async () => {
  await fetchAllPublications()
  console.log(publications.value[0]!.User.name)
})
</script>

<template>
  <div class="publications_page">
    <div
      v-if="publications.length > 0"
      v-for="(p, i) in publications"
      :key="i"
      class="publication-item"
      @click="togglePublicationModal(i)"
    >
      <div class="p-header">
        <h2>{{p.title}}</h2>
        <p>{{p.description}}</p>
      </div>
      <div class="p-footer">
        <p>{{p.User.name || 'Unknown'}}</p>
        <p>{{formatDate(p.created_at, 'DD/MM/YYYY HH:mm')}}</p>
      </div>
    </div>
  </div>

  <PublicationModal :is-open="isPublicationModalOpen" :on-delete="DeletePublication" :publication="publicationOpen" @close="isPublicationModalOpen = false"/>
</template>

<style scoped lang="scss">
.publications_page {
  margin-top: 80px;
  padding: 50px 20px;
  display: flex;
  gap: 15px;
  flex-wrap: wrap;
}
.publication-item{
  display: flex;
  flex-direction: column;
  gap: 30px;
  padding: 20px;
  background: $background-color;
  border: 1px solid rgba(gray, 0.5);
  width: calc( (100%) / 4  - 15px);
  border-radius: 16px;
  cursor: pointer;
  &:hover {
    border: 1px solid rgba(gray, 0.8);
  }
}
.p-header{
  display: flex;
  flex-direction: column;
  gap: 10px;

  & > h2 {
    font-size: 20px;
  }

  & > p {
    opacity: 0.7;
    font-size: 16px;
    overflow: hidden;
    display: -webkit-box;
    -webkit-line-clamp: 4; /* number of lines to show */
    line-clamp: 4;
    -webkit-box-orient: vertical;
  }
}

.p-footer {
  display: flex;
  justify-content: space-between;

  & > p {
    opacity: 0.7;
    font-size: 16px;
  }
}
</style>