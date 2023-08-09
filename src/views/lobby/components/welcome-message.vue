<template>
  <div class="welcome-message">
    <div class="welcome-message__content text-center py-4">
      <p class="vz-font-size-18">{{ $t('LOBBY.DONT_HAVE_AN_ACCOUNT_YET') }}</p>
      <p class="vz-font-size-14">{{ $t('LOBBY.REGISTER_IN_FEW_EASY_STEPS') }}</p>

      <div class="welcome-message__controls mt-4 flex justify-center align-center">
        <vz-button text="AUTH.SIGN_UP" @click="openSignUpModal" />
        <span class="mx-4">{{ $t('AUTH.OR') }}</span>
        <vz-button text="AUTH.SIGN_IN" @click="openSignInModal" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { emitter } from '@/main';
import { OPEN_LOGIN_MODAL } from '@/views/lobby/constants/lobby-events';

const openSignUpModal = () => emitter.emit(OPEN_LOGIN_MODAL, { isSignUp: true });
const openSignInModal = () => emitter.emit(OPEN_LOGIN_MODAL, { isSignUp: false });
</script>

<style lang="scss">
.welcome-message {
  padding: 0.25rem;

  &__content {
    color: var(--color-mono-300);
    background-color: var(--color-primary-900);
    border-radius: var(--border-radius-1);
  }
}
</style>
