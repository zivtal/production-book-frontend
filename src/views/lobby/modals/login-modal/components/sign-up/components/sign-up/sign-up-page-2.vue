<template>
  <div class="flex flex-column">
    <vz-input
      v-model="vModel.password"
      type="password"
      label="PROFILE.PASSWORD"
      :rules="{ required: [true], regex: ValidatorRegex.PASSWORD }"
      :error-messages="fieldMessage?.password"
      @update:model-value="$emit('update:model-value', { ...props.modelValue, password: $event })"
    />

    <vz-input v-model="reEnterPassword" type="password" label="PROFILE.RE_ENTER_PASSWORD" :rules="{ required: [true], equal: [vModel.password] }" />
  </div>
</template>

<script setup lang="ts">
import type { AuthUnsecuredSignUp } from '@/store/auth/models/auth-sign-up-req';
import { computed, PropType, ref } from 'vue';
import ValidatorRegex from '@/shared/services/validator/service/record-validator/constants/validation-regex-pattern';

const props = defineProps({
  modelValue: { type: Object as PropType<AuthUnsecuredSignUp>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof AuthUnsecuredSignUp, string>>, default: () => ({}) },
});
const emit = defineEmits(['update:model-value']);

const vModel = computed({
  get: (): AuthUnsecuredSignUp => props.modelValue,
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }),
});

const reEnterPassword = ref<string>(props.modelValue?.password);
</script>
