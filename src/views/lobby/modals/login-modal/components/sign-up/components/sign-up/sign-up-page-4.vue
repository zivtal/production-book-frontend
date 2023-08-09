<template>
  <div class="flex flex-column align-center">
    <verification-code
      :model-value="modelValue.emailValidateCode"
      @update:model-value="$emit('update:model-value', { ...modelValue, emailValidateCode: $event })"
    />

    <vz-button
      class="mt-10"
      :text="isDisabled ? `Retry in ${secCounter}` : 'AUTH.RESEND_VALIDATION_CODE'"
      :loading="emailValidationRequest.loading.value"
      :disabled="isDisabled"
      @click="onResend"
    />
  </div>
</template>

<script setup lang="ts">
import type { AuthUnsecuredSignUp } from '@/store/auth/models/auth-sign-up-req';
import { computed, onMounted, type PropType } from 'vue';
import { EMAIL_VALIDATE, VERIFICATION_EXPIRED_AT } from '@/store/auth/constants';
import useAuthStore from '@/views/lobby/modals/login-modal/composables/use-auth-store';
import { usePromise } from '@/shared/composables';
import VerificationCode from '@/shared/components/fields/vz-verification-code.vue';

defineEmits(['update:model-value']);
const props = defineProps({ modelValue: { type: Object as PropType<AuthUnsecuredSignUp>, required: true } });

const { useActions, useState } = useAuthStore();
const { [EMAIL_VALIDATE]: emailValidateAction } = useActions([EMAIL_VALIDATE]);
const { [VERIFICATION_EXPIRED_AT]: verificationExpiredAtState } = useState([VERIFICATION_EXPIRED_AT]);

const emailValidationRequest = usePromise(emailValidateAction as (payload: { email: string; forceCall?: boolean }) => Promise<number | void>);
const isDisabled = computed((): boolean => !!emailValidationRequest.results.value);
const secCounter = computed((): number => (emailValidationRequest.results.value ? emailValidationRequest.results.value / 1000 : 0));

onMounted(() => {
  emailValidationRequest.results.value = verificationExpiredAtState.value ? Math.round(verificationExpiredAtState.value - Date.now()) : null;

  if (emailValidationRequest.results.value) {
    setTimer();
  }
});

const setTimer = () => {
  const timer: ReturnType<typeof setInterval> = setInterval(() => {
    if (!emailValidationRequest.results.value) {
      clearInterval(timer);

      return;
    }

    emailValidationRequest.results.value = Math.max(emailValidationRequest.results.value - 1000, 0);
  }, 1000);
};

const onResend = async (): Promise<void> => {
  await emailValidationRequest.call({
    email: props.modelValue?.email,
    firstName: props.modelValue?.firstName,
    lastName: props.modelValue?.lastName,
    forceCall: true,
  });

  setTimer();
};
</script>
