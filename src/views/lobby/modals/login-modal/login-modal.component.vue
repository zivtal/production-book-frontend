<template>
  <vz-overlay
    blur="5"
    size="large"
    name="login-modal"
    close-button-color="mono-200"
    :open-event="OPEN_LOGIN_MODAL"
    :close-event="CLOSE_LOGIN_MODAL"
    @open="onOpenModal"
  >
    <div class="login-modal" :class="{ 'login-modal__signup-mode': isSignUp }">
      <sign-up-component v-if="isSignUp" @close="emitter.emit(CLOSE_LOGIN_MODAL)" />

      <sign-in-component v-else @close="emitter.emit(CLOSE_LOGIN_MODAL)" />
    </div>
  </vz-overlay>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { emitter } from '@/main';
import { CLOSE_LOGIN_MODAL, OPEN_LOGIN_MODAL } from '@/views/lobby/constants/lobby-events';
import SignInComponent from '@/views/lobby/modals/login-modal/components/sign-in.vue';
import SignUpComponent from '@/views/lobby/modals/login-modal/components/sign-up.vue';

const isSignUp = ref<boolean>(false);

const onOpenModal = (payload?: { isSignUp: boolean }) => {
  if (!payload) {
    return;
  }

  isSignUp.value = payload.isSignUp;
};
</script>

<style lang="scss">
.login-modal {
  display: flex;
  overflow: hidden;

  @include min-tablet-layout {
    &:not(.login-modal__signup-mode) {
      @include rtl(background-color, var(--color-background-2), var(--color-primary-900));
    }

    .login-modal__signup-mode {
      @include rtl(background-color, var(--color-background-2), var(--color-mono-300));
    }
  }

  @include max-mobile-layout {
    height: 100vh;
    background-color: var(--color-mono-300);

    .sign-in-form {
      padding: 4rem 1rem 6rem 1rem;
    }

    > * {
      width: 100vw;
    }
  }

  > * {
    position: relative;
    z-index: 1;
  }

  &:before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    content: '';
    border-radius: var(--border-radius-1);
    background-image: url('@/assets/images/background.svg');
    background-position-y: 125%;
    background-size: 100%;
  }

  &__signup-mode {
    min-height: 600px;

    @include min-tablet-layout {
      max-height: 90vh;
    }

    &:before {
      background-color: var(--color-background-2);
    }
  }

  &.login-modal__signup-mode:before {
    background-color: var(--color-background-2);
  }

  &:not(.login-modal__signup-mode):before {
    clip-path: polygon(0 0, 55% 0, 45% 100%, 0% 100%);
    background-size: 60% 50%;
    @include rtl(background-color, var(--color-primary-900), var(--color-background-2));
  }

  .stepper__content {
    padding-inline-start: 48px;
  }
}
</style>
