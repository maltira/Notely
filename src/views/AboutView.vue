<script setup lang="ts">
import { onMounted, ref } from 'vue'
import FaqItem from '@/components/UI/FaqItem.vue'
import router from '@/router'
import { useUserStore } from '@/stores/user.store.ts'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()
const { user } = storeToRefs(userStore)

type FaqType = {
  question: string
  answer: string
  icon: string
}
const faq = ref<FaqType[]>([
  {
    question: 'Нужно ли платить за использование сервиса?',
    answer:
      'Ты можешь публиковать посты, читать контент и подписываться на авторов бесплатно и без ограничений. В будущем появятся дополнительные возможности для авторов.',
    icon: 'piggy.svg',
  },
  {
    question: 'Чем Notely отличается от обычных блог-платформ?',
    answer:
      'Notely — платформа для авторов и читателей с гибким редактором статей. Она создана для развития авторов и сообществ вокруг контента.',
    icon: 'shine.svg',
  },
  {
    question: 'Кто может быть автором?',
    answer:
      'Любой пользователь Notely. Если у тебя есть идеи, знания или опыт — ты можешь публиковать статьи и находить свою аудиторию.',
    icon: 'user.svg',
  },
  {
    question: 'Какие языки поддерживает платформа?',
    answer:
      'Notely поддерживает несколько языков и постоянно расширяет локализацию, чтобы авторам и читателям было комфортно из любой точки мира.',
    icon: 'globe.svg',
  },
  {
    question: 'Как защищён мой контент?',
    answer:
      'Твой контент хранится на защищённых серверах. Ты полностью контролируешь доступ к своим материалам и можешь управлять настройками приватности в любой момент.',
    icon: 'protect.svg',
  },
  {
    question: 'Как начать пользоваться?',
    answer:
      'Зарегистрируйся или войди в аккаунт, подпишись на интересных авторов и начни читать или публиковать свои статьи. Всё — ты в Notely.',
    icon: 'rocket.svg',
  },
])

onMounted(() => {
  const about_header = document.getElementById('about-header')
  const title_block = document.getElementById('title-block')
  const faq_block = document.getElementById('faq-block')

  setTimeout(() => {
    about_header!.style.opacity = '1'
    about_header!.style.paddingTop = '50px'

    title_block!.style.opacity = '1'
    title_block!.style.marginTop = '0'

    setTimeout(() => {
      faq_block!.style.opacity = '1'
      faq_block!.style.marginTop = '0'
    }, 150)
  }, 1)
})
</script>

<template>
  <div class="about_page">
    <div id="about-header" class="about-header">
      <h1 @click="router.push('/')">Notely!</h1>
      <p v-if="user">Добро пожаловать, {{ user.name }}!</p>
      <button v-else class="auth dark" @click="router.push('/login')">Войти в аккаунт</button>
    </div>
    <div class="about-body">
      <div id="title-block" class="title-block">
        <img src="/icons/energy.svg" alt="icon" />
        <h1>Больше информации о нас</h1>
        <p>
          Здесь авторы создают собственные пространства с контентом, а читатели находят интересные материалы и подписываются на
          любимых авторов
        </p>
      </div>
      <div id="faq-block" class="faq-block">
        <FaqItem
          v-for="(item, i) in faq"
          :id="'active-answer-' + i"
          :question="item.question"
          :answer="item.answer"
          :icon="item.icon"
        />
      </div>
      <div class="support-block">
        <p>Не получилось найти ответ на свой вопрос?</p>
        <button>
          <img src="/icons/send.svg" alt="send" />
          Связаться с нами
        </button>
      </div>
    </div>
    <img src="/img/about-bg.png" alt="bg" class="bg-img" />
  </div>
</template>

<style scoped lang="scss">
.bg-img {
  position: absolute;
  z-index: 1;

  pointer-events: none;
}

.about_page {
  display: flex;
  flex-direction: column;
  align-items: center;

  & > .about-header {
    position: fixed;

    display: flex;
    justify-content: space-between;
    width: 100%;
    z-index: 2;
    padding: 30px 110px 0 110px;

    opacity: 0;
    transition: 300ms cubic-bezier(0, 0.18, 0.3, 1);

    & > h1 {
      @include h1-text;
      cursor: pointer;

      &:hover {
        opacity: 0.85;
      }
    }
    & > p {
      @include button-text;
      opacity: 0.6;
    }
    & > .auth {
      @include button-icon;
      height: 36px;
    }
  }
}
.about-body {
  display: flex;
  flex-direction: column;
  gap: 90px;

  padding: 148px 110px 80px 110px;
  width: 1000px;
  z-index: 2;

  & > .title-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    margin-top: -50px;
    opacity: 0;
    transition: 600ms cubic-bezier(0, 0.18, 0.3, 1);

    & > img {
      width: 40px;
      height: 40px;
    }
    & > h1 {
      @include h1-text;
      text-align: center;
    }
    & > p {
      @include main-text;
      opacity: 0.6;
      text-align: center;
    }
  }
  & > .faq-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 24px;

    margin-top: 100px;
    opacity: 0;
    transition: 600ms cubic-bezier(0, 0.18, 0.3, 1);
  }
  & > .support-block {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;

    & > p {
      @include main-text;
      opacity: 0.6;
    }
    & > button {
      @include button-icon;
    }
  }
}
</style>
