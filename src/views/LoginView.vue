<script setup lang="ts">
import { ref } from 'vue'

const email = ref("")
const password = ref("")
const isPasswordVisible = ref(false)

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
          <p>Email адрес</p>
          <input id="email-input" name="email" v-model="email" autocomplete="off" required type="email" placeholder="Введите почту"/>
        </div>
        <div class="input_item">
          <p>Пароль</p>
          <div class="password-input">
            <input id="password-input" name="password" v-model="password" autocomplete="off" required :type="isPasswordVisible ? 'text' : 'password'" placeholder="Введите пароль"/>
            <img :src="isPasswordVisible ? '/icons/eye.svg' : '/icons/eye-closed.svg'" alt="visible" @click="isPasswordVisible = !isPasswordVisible">
          </div>
        </div>
      </div>
      <button class="login_submit">Войти</button>
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

    & > p {
      font-size: 16px;
    }

    & > input, .password-input > input {
      height: 48px;
      border-radius: 12px;
      width: 100%;
      padding: 0 16px;
      background: $white-primary;
      border: 1px solid rgba(gray, 0.2);

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

  &:hover {
    background: rgba($blue-primary, 0.8);
  }
}
</style>