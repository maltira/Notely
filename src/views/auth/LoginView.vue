<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store.ts'
import type { AuthRequest } from '@/types/auth.entity.ts'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/useNotification.ts'
import { useRouter } from 'vue-router'
import Spinner from '@/components/UI/Spinner.vue'
import { useUserStore } from '@/stores/user.store.ts'

const authStore = useAuthStore()
const userStore = useUserStore()
const { isLoading, error } = storeToRefs(authStore)
const { user } = storeToRefs(userStore)
const { login } = authStore
const { infoNotification } = useNotification()

const router = useRouter()
const email = ref('')
const password = ref('')
const isPasswordVisible = ref(false)

const auth = async () => {
  if (email.value && password.value) {
    const req: AuthRequest = {
      email: email.value,
      password: password.value,
    }
    await login(req)

    if (error.value) {
      infoNotification('Ошибка: ' + error.value.toString())
    } else {
      await router.push('/')
      infoNotification(`👋 ${user.value!.name}, рады приветствовать тебя в Notely!`)
    }
  } else {
    infoNotification('Введите корректные данные, возможно вы указали не все поля')
  }
}

const goToReg = () => {
  const login_block = document.getElementById('login_block')
  if (login_block) {
    login_block.style.transition = '50ms ease-out'
    login_block.style.opacity = '0'
    login_block.style.transform = 'scale(0.8)'
    setTimeout(() => {
      router.push('/registration')
    }, 50)
  }
}
onMounted(() => {
  const login_block = document.getElementById('login_block')
  const anim = document.getElementsByClassName('anim')
  if (login_block && anim) {
    setTimeout(() => {
      login_block.style.transition = '100ms ease-out'
      login_block.style.opacity = '1'
      login_block.style.transform = 'scale(1)'
    }, 1)

    setTimeout(() => {
      for (let i = 0; i < anim.length; i++) {
        const element = anim[i]
        if (element instanceof HTMLElement) {
          element.style.transition = '200ms ease-out'
          element.style.opacity = '1'
        }
      }
    }, 100)
  }
})
</script>

<template>
  <div class="login-container">
    <div id="login_block" class="login_block">
      <div class="login_title anim">
        <div class="logotype">N</div>
        <div class="text">
          <h1>Вход в аккаунт</h1>
          <p>Введите ваш email и пароль ниже для входа.</p>
        </div>
      </div>
      <div class="login_inputs anim">
        <div class="input-form">
          <p class="input-info">Email <span class="required">*</span></p>
          <input
            id="email-input"
            name="email"
            v-model="email"
            autocomplete="off"
            required
            type="email"
            placeholder="Введите email"
            :class="{ active: email }"
          />
        </div>
        <div class="input-form">
          <p class="input-info">Пароль <span class="required">*</span></p>
          <div class="password-input">
            <input
              id="password-input"
              name="password"
              v-model="password"
              autocomplete="off"
              required
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Введите пароль"
              :class="{ active: password }"
            />
            <img
              :src="isPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye.svg'"
              alt="visible"
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </div>
        </div>
      </div>
      <div class="buttons anim">
        <div class="action-buttons">
          <button
            class="login_submit"
            @click="auth"
            :class="{ disabled: !email || !password || isLoading }"
          >
            {{ isLoading ? '' : 'Войти' }}
            <Spinner size="small" v-if="isLoading" />
            <img v-if="!isLoading" src="/icons/arr-white.svg" alt="arrow" />
          </button>
          <button class="continue" @click="router.push('/')" :class="{ disabled: isLoading }">
            Продолжить как читатель
          </button>
        </div>

        <div class="registration">
          <p>Нет аккаунта?</p>
          <p class="link" @click="goToReg">Создать новый</p>
        </div>
      </div>
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
  overflow: hidden;
  position: relative;

  background-color: $gray-primary;
}

.anim {
  opacity: 0;
}

.login_block {
  display: flex;
  flex-direction: column;

  gap: 48px;
  width: 437px;
  padding: 32px 36px;
  border-radius: 12px;

  background: $white-primary;

  border: 1px solid rgba($black-primary, 0.1);

  opacity: 0;
  transform: scale(0.8);

  & > .login_title {
    display: flex;
    flex-direction: column;
    gap: 24px;
    align-items: center;

    & > .text {
      & > h1 {
        @include h4-text;
        text-align: center;
        margin-bottom: 10px;
      }
      & > p {
        @include button-text();

        font-weight: 400;
        text-align: center;
        opacity: 0.5;
      }
    }

    & > .logotype {
      width: 44px;
      height: 44px;
      background: $black-primary;

      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 8px;

      font-size: 28px;
      font-weight: 700;
      color: $white-primary;
    }
  }
}

.login_inputs {
  display: flex;
  flex-direction: column;
  gap: 20px;

  & > .input-form {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > .input-info {
      @include button-text;
    }

    & > input,
    & .password-input > input {
      @include input-form-icon;

      &:-webkit-autofill,
      &:-webkit-autofill:hover,
      &:-webkit-autofill:focus {
        -webkit-text-fill-color: $black-primary;
        transition: all 5000s ease-in-out;
        font-size: 16px !important;
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
    opacity: 0.3;

    &:hover {
      opacity: 0.5;
    }
  }
}

.buttons {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;

  & > .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;

    & > button {
      &.login_submit {
        @include big-button();
      }

      &.continue {
        @include button-icon();
      }

      &.disabled {
        opacity: 0.2;
        pointer-events: none;
      }
    }
  }
}

.registration {
  @include button-text;

  display: flex;
  gap: 6px;
  justify-content: center;
  font-weight: 400;

  & > p {
    opacity: 0.5;
  }
  & > .link {
    opacity: 0.7;
    cursor: pointer;

    &:hover {
      opacity: 0.9;
    }
  }
}
</style>