<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import { storeToRefs } from 'pinia'
import { useNotification } from '@/composables/useNotification'
import { useRouter } from 'vue-router'
import Spinner from '@/components/UI/Spinner.vue'
import type { CreateUserRequest } from '@/types/user.entity.ts'

const router = useRouter()
const name = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)
const authStore = useAuthStore()
const { isLoading, error } = storeToRefs(authStore)
const { registration } = authStore
const { infoNotification } = useNotification()

const registrationUser = async () => {
  if (name.value && email.value && password.value && password.value == confirmPassword.value) {
    const req: CreateUserRequest = {
      name: name.value,
      email: email.value,
      password: password.value,
      group_id: '700c704d-f5c9-4a95-ad9e-c040b4429050',
    }
    await registration(req)

    if (error.value) {
      infoNotification('Ошибка: ' + error.value.toString())
    } else {
      await router.push('/')
      infoNotification('Успешная регистрация, добро пожаловать в Notely!')
    }
  } else {
    infoNotification(
      'Указаны неверные данные, возможно вы указали не все поля либо пароли не совпадают',
    )
  }
}

const goToBack = () => {
  const reg_block = document.getElementById('reg_block')
  if (reg_block) {
    reg_block.style.transition = '50ms ease-out'
    reg_block.style.opacity = '0'
    reg_block.style.transform = 'scale(0.8)'
    setTimeout(() => {
      router.back()
    }, 50)
  }
}
onMounted(() => {
  const reg_block = document.getElementById('reg_block')
  const anim = document.getElementsByClassName('anim')
  if (reg_block && anim) {
    setTimeout(() => {
      reg_block.style.transition = '100ms ease-out'
      reg_block.style.opacity = '1'
      reg_block.style.transform = 'scale(1)'
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
    <div id="reg_block" class="login_block">
      <div class="login_title anim">
        <div class="logotype">N</div>
        <div class="text">
          <h1>Создать аккаунт</h1>
          <p>Укажите ваши данные для регистрации.</p>
        </div>
      </div>
      <div class="login_inputs anim">
        <div class="input-form">
          <p class="input-info">Как к вам обращаться? <span class="required">*</span></p>
          <input
            id="name-input"
            v-model="name"
            required
            type="text"
            placeholder="Романтичный холерик"
            :class="{ active: name }"
          />
        </div>
        <div class="input-form">
          <p class="input-info">Email <span class="required">*</span></p>
          <input
            id="email-input"
            v-model="email"
            required
            type="email"
            placeholder="Укажите ваш email"
            :class="{ active: email }"
          />
        </div>
        <div class="input-form">
          <p class="input-info">Пароль <span class="required">*</span></p>
          <div class="password-input">
            <input
              id="password-input"
              name="password-in1"
              v-model="password"
              required
              :type="isPasswordVisible ? 'text' : 'password'"
              placeholder="Введите пароль"
              autocomplete="off"
              :class="{ active: password }"
            />
            <img
              :src="isPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye.svg'"
              alt="visible"
              @click="isPasswordVisible = !isPasswordVisible"
            />
          </div>
        </div>
        <div class="input-form">
          <p class="input-info">Повторите пароль <span class="required">*</span></p>
          <div class="password-input">
            <input
              id="password-input-confirm"
              name="password-in2"
              v-model="confirmPassword"
              required
              autocomplete="off"
              :type="isConfirmPasswordVisible ? 'text' : 'password'"
              placeholder="Введите пароль"
              :class="{ active: confirmPassword }"
            />
            <img
              :src="isConfirmPasswordVisible ? '/icons/eye-closed.svg' : '/icons/eye.svg'"
              alt="visible"
              @click="isConfirmPasswordVisible = !isConfirmPasswordVisible"
            />
          </div>
        </div>
      </div>
      <div class="btn-back anim" @click="goToBack">
        <img class="btn-back" src="/icons/arr-black.svg" alt="arrow" />
      </div>
      <button
        class="login_submit"
        @click="registrationUser"
        :class="{ disabled: !name || !email || !password || !confirmPassword || isLoading }"
      >
        {{ isLoading ? '' : 'Создать аккаунт' }}
        <Spinner size="small" v-if="isLoading" />
        <img v-if="!isLoading" src="/icons/arr-white.svg" alt="arrow" />
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
  position: relative;

  gap: 48px;
  width: 500px;
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

  & > .btn-back {
    padding: 10px;
    background: $white-primary;

    border: 1px solid rgba($black-primary, 0.1);
    border-radius: 10px;

    position: absolute;
    left: -56px;
    top: 0;

    cursor: pointer;

    & > img {
      width: 24px;
      height: 24px;
      opacity: 0.7;

      transform: rotate(180deg);
    }

    &:hover {
      & > img {
        opacity: 1;
      }
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

.login_submit {
  @include big-button();
}
</style>