<template>
  <div class="fill-width flex flex-column">
    <div class="flex align-center justify-center mt-6">
      <vz-image class="align-self-end" :src="require('@/assets/images/login/left.svg')" alt="GENERAL.LOGO" />
      <vz-image class="align-self-end mb-2" :src="require('@/assets/images/login/center.svg')" alt="GENERAL.LOGO" />
      <vz-image class="align-self-end" :src="require('@/assets/images/login/right.svg')" alt="GENERAL.LOGO" />
    </div>

    <vz-stepper
      v-model="signUpDetails"
      hide-errors
      class="fill-width flex-grow-1"
      :components="components"
      :cancel-callback="() => emitter.emit(CLOSE_LOGIN_MODAL)"
      :submit-callback="onSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import type { AuthUnsecuredSignUp } from '@/store/auth/models/auth-sign-up-req';
import type { StepComponent } from '@/shared/components/stepper/models/step-component';
import { computed, ref } from 'vue';
import { emitter } from '@/main';
import { CLOSE_LOGIN_MODAL } from '@/views/lobby/constants/lobby-events';
import { EMAIL_VALIDATE, SIGN_UP } from '@/store/auth/constants';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import Page1 from '@/views/lobby/modals/login-modal/components/sign-up/components/sign-up/sign-up-page-1.vue';
import Page2 from '@/views/lobby/modals/login-modal/components/sign-up/components/sign-up/sign-up-page-2.vue';
import Page3 from '@/views/lobby/modals/login-modal/components/sign-up/components/sign-up/sign-up-page-3.vue';
import Page4 from '@/views/lobby/modals/login-modal/components/sign-up/components/sign-up/sign-up-page-4.vue';

const signUpDetails = ref<AuthUnsecuredSignUp>({} as AuthUnsecuredSignUp);

const { useActions } = useAuthStore();
const { [EMAIL_VALIDATE]: emailValidateAction, [SIGN_UP]: signUpAction } = useActions([EMAIL_VALIDATE, SIGN_UP]);

const components = computed(
  (): Array<StepComponent<AuthUnsecuredSignUp>> => [
    {
      component: Page1,
      properties: ['email', 'firstName', 'lastName', 'nickName', 'company', 'location', 'gender', 'phone', 'birthday'],
    },
    {
      component: Page2,
      properties: ['password'],
    },
    {
      component: Page3,
      properties: ['skills', 'specialization'],
      callback: () =>
        emailValidateAction({
          email: signUpDetails.value.email,
          firstName: signUpDetails.value.firstName,
          lastName: signUpDetails.value.lastName,
          forceCall: false,
        }),
    },
    { component: Page4, callback: () => signUpAction(signUpDetails.value), properties: ['emailValidateCode'] },
  ]
);

const onSubmit = () => {
  emitter.emit(CLOSE_LOGIN_MODAL);
};
</script>

<style lang="scss">
.sign-up {
  &-fields {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));

    > * {
      padding: 1rem;
    }
  }
}
</style>
