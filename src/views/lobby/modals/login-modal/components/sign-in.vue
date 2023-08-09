<template>
  <div class="sign-in-form">
    <vz-image class="sign-in-form__logo" height="80" :src="require('@/assets/images/logo-blue.svg')" :alt="$t('GENERAL.COMPANY')" />

    <form ref="formRef" class="flex align-center justify-center flex-column" role="form" @submit.prevent="onSubmit">
      <p class="vz-font-size-18 vz-font-weight-600 text-center">
        {{ $t(isRecoverMode ? 'AUTH.PASSWORD_RECOVERY' : 'AUTH.LOGIN_TO_YOUR_ACCOUNT') }}
      </p>

      <div class="mb-12 text-center">
        <p v-if="!isRecoverMode" class="vz-font-size-14">{{ $t('AUTH.CUSTOMER_EXPERIENCE') }}</p>
        <p v-else-if="forgotPasswordRequest.results.value">{{ $t('AUTH.VERIFICATION_MAIL_SENT') }}</p>
      </div>

      <vz-error-alert class="sign-in-form__errors" :errors="errors" />

      <template v-if="!isRecoverMode">
        <vz-input
          v-model="email"
          type="email"
          label="GENERAL.EMAIL"
          :rules="{ required: [true], regex: [RegexPattern.EMAIL_ADDRESS, ValidationMessage.INVALID_EMAIL_ADDRESS] }"
        />

        <vz-input v-model="password" type="password" label="AUTH.PASSWORD" :rules="{ required: [true] }" />

        <vz-button class="mt-8" text="AUTH.SIGN_IN" :loading="signInRequest.loading.value" @click="onSignIn" />

        <vz-button class="vz-font-size-10 vz-font-weight-600" mode="flat" text="AUTH.FORGOT_PASSWORD" @click="setRecoverMode" />
      </template>

      <template v-else>
        <template v-if="!forgotPasswordRequest.results.value">
          <vz-input
            v-model="email"
            type="email"
            label="GENERAL.EMAIL"
            :rules="{ required: [true], regex: [RegexPattern.EMAIL_ADDRESS, ValidationMessage.INVALID_EMAIL_ADDRESS] }"
          />
        </template>

        <template v-else>
          <vz-input
            v-model="newPassword"
            type="password"
            label="AUTH.NEW_PASSWORD"
            :rules="{ required: [true], regex: PasswordRegexValidator, minLength: [8] }"
          />

          <vz-input
            v-model="rePassword"
            type="password"
            label="AUTH.NEW_PASSWORD"
            :rules="{ required: [true], equal: [newPassword, ValidationMessage.MISMATCH_PASSWORDS] }"
          />

          <div class="mt-2">
            <p class="vz-font-size-14 ms-2">{{ $t('AUTH.VERIFICATION_MAIL_SENT') }}</p>
            <verification-code v-model="code" class="mb-8" hide-title />
          </div>
        </template>

        <vz-button
          class="mb-6"
          :text="forgotPasswordRequest.results.value ? 'AUTH.CHANGE_PASSWORD' : 'AUTH.SEND_MAIL'"
          :loading="forgotPasswordRequest.loading.value || changePasswordRequest.loading.value"
          v-on="{ click: forgotPasswordRequest.results.value ? onPasswordChange : onForgotPassword }"
        />
      </template>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { AuthSignInReq } from '@/store/auth/models/auth-sign-in-req';
import type { AuthRecoverPasswordReq } from '@/store/auth/models/auth-recover-password-req';
import type { AuthForgotPasswordReq } from '@/store/auth/models/auth-forgot-password-req';
import { CHANGE_PASSWORD, FORGOT_PASSWORD, SIGN_IN } from '@/store/auth/constants';
import { computed, ref } from 'vue';
import VerificationCode from '@/shared/components/fields/vz-verification-code.vue';
import { usePromise } from '@/shared/composables';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import { useFormValidator } from '@/shared/components/fields/helpers';
import RegexPattern from '@/shared/constants/regex-pattern';
import { PasswordRegexValidator } from '@/views/lobby/modals/login-modal/validators/password-regex-validator';
import { ValidationMessage } from '@/shared/services/validator/service/record-validator/constants/validation.message.enum';

const emit = defineEmits(['close']);

const { useActions } = useAuthStore();

const {
  [SIGN_IN]: signInAction,
  [FORGOT_PASSWORD]: forgotPasswordAction,
  [CHANGE_PASSWORD]: changePasswordAction,
} = useActions([SIGN_IN, FORGOT_PASSWORD, CHANGE_PASSWORD]);

const signInRequest = usePromise(signInAction as (payload: AuthSignInReq) => Promise<void>, { errorsCleanUpTime: 0 });
const forgotPasswordRequest = usePromise(forgotPasswordAction as (payload: AuthForgotPasswordReq) => Promise<number>);
const changePasswordRequest = usePromise(changePasswordAction as (payload: AuthRecoverPasswordReq) => Promise<void>);

const formRef = ref<Element | undefined>(undefined);
const email = ref<string>('');
const password = ref<string>('');
const code = ref<number>();
const newPassword = ref<string>('');
const rePassword = ref<string>('');
const isRecoverMode = ref<boolean>(false);

const errors = computed(() => signInRequest.error.value || forgotPasswordRequest.error.value || changePasswordRequest.error.value);

const reset = () => {
  signInRequest.error.value = null;
  forgotPasswordRequest.error.value = null;
  changePasswordRequest.error.value = null;
};

const isValid = () => useFormValidator(formRef)();

const onSubmit = () => {
  if (!isRecoverMode.value) {
    onSignIn();

    return;
  }

  if (!forgotPasswordRequest.results.value) {
    onForgotPassword();

    return;
  }

  return onPasswordChange();
};

const onSignIn = async (): Promise<void> => {
  if (!isValid()) {
    return;
  }

  await signInRequest.call({ password: password.value, email: email.value });

  if (!signInRequest.error.value) {
    emit('close');
  }
};

const onForgotPassword = async (): Promise<void> => {
  if (!isValid()) {
    return;
  }

  await forgotPasswordRequest.call({ email: email.value });
};

const onPasswordChange = async (): Promise<void> => {
  if (!isValid()) {
    return;
  }

  await changePasswordRequest.call({ email: email.value, password: newPassword.value, code: code.value });
};

const setRecoverMode = () => {
  reset();
  isRecoverMode.value = true;
};
</script>

<style lang="scss">
.sign-in-form {
  padding: 2rem 1rem;
  height: 100%;

  @include min-tablet-layout {
    width: 50%;
  }

  @include max-tablet-layout {
    width: calc(100% - 1rem);
  }

  &__logo {
    width: 100%;
    margin-bottom: 2rem;
  }

  &__errors {
    width: 100%;
    padding: 0 1rem;
    margin-bottom: 1.5rem;
  }

  .vz-input {
    width: 100%;

    @include min-tablet-layout {
      padding: 0 10%;
    }
  }
}
</style>
