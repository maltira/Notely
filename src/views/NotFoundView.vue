<script setup lang="ts">
import router from '@/router'
</script>

<template>
  <div class="not-found">
    <div>
      <h1>404</h1>
      <p>Такой страницы не существует</p>
    </div>
    <button @click="router.push('/')">Главное меню</button>
  </div>
</template>

<style scoped lang="scss">
.not-found {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 40px;

  height: 100%;

  & > div {
    display: flex;
    flex-direction: column;
    gap: 15px;

    & > h1 {
      @include h1-text;
      font-size: 100px;
      text-align: center;
    }

    & > p {
      @include main-text;

      opacity: 0.7;
    }
  }

  & > button {
    @include button-icon;
    height: 36px;
  }
}
</style>