<script setup lang="ts">
import { ref } from 'vue'
import {useAuthStore} from "@/stores/auth.store";
import type { AuthRequest } from "@/types/auth.entity";
import {storeToRefs} from "pinia";
import {useNotification} from "@/composables/useNotification";
import {useRouter} from "vue-router";
import Spinner from '@/components/UI/Spinner.vue'

const router = useRouter()
const email = ref("")
const password = ref("")
const isPasswordVisible = ref(false)
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)
const { login } = authStore
const { success, err } = useNotification()

const auth = async () => {
  if (email.value && password.value) {
    const req: AuthRequest = {
      email: email.value,
      password: password.value
    }
    await login(req)

    if (error.value) {
      err("Ошибка авторизациии", error.value.toString())
    }
    else {
      await router.push('/')
      success("Успешная авторизация", "Добро пожаловать")
    }
  } else {
    err("Неверные данные", "Введите корректные данные")
  }
}
</script>

<template>
  <div class="login-container">
    <div class="login_block">
      <div class="login_title">
        <h1>Войдите в аккаунт</h1>
        <p>Получите данные у админа</p>
      </div>
      <div class="login_inputs">
        <div class="input_item">
          <input id="email-input" name="email" v-model="email" autocomplete="off" required type="email" placeholder="example@gmail.com"/>
        </div>
        <div class="input_item">
          <div class="password-input">
            <input id="password-input" name="password" v-model="password" autocomplete="off" required :type="isPasswordVisible ? 'text' : 'password'" placeholder="Введите пароль"/>
            <img :src="isPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye.svg'" alt="visible" @click="isPasswordVisible = !isPasswordVisible">
          </div>
        </div>
      </div>
      <button class="login_submit" @click="auth" :class="{'disabled': !email || !password || isLoading}">
        {{isLoading ? "" : "Войти"}}
        <Spinner size="small" v-if="isLoading"/>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.login-container {
  display: flex;
  width: 100%;
  height: 100vh;
  justify-content: center;
  align-items: center;
}

.login_block {
  display: flex;
  flex-direction: column;
  gap: 50px;
  width: 500px;
  padding: 25px;

  & > .login_title{
    display: flex;
    flex-direction: column;
    gap: 15px;

    & > h1 {
      font-size: 32px;
    }
    & > p {
      opacity: 0.7;
    }
  }
}

.login_inputs {
  display: flex;
  flex-direction: column;
  gap: 25px;
  & > .input_item{
    display: flex;
    flex-direction: column;
    gap: 10px;

    & > input, .password-input > input {
      height: 48px;
      border-radius: 12px;
      width: 100%;
      padding: 0 16px;
      background: $white-primary;
      border: 1px solid rgba(gray, 0.2);
      color: $black-primary;

      &:focus{
        box-shadow: 0 0 8px 0 rgba(0, 95, 248, 0.2);
      }
    }
  }
}
.password-input {
  position: relative;
  & > img {
    position: absolute;
    right: 15px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    z-index: 2;
    opacity: 0.5;

    &:hover{
      opacity: 0.7;
    }
  }
}
.login_submit {
  height: 48px;
  background: $blue-primary;
  font-weight: 500;
  border-radius: 12px;
  color: $white-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
  &:hover {
    background: rgba($blue-primary, 0.8);
  }
  &.disabled{
    opacity: 0.2;
    pointer-events: none;
  }
}
</style>