<template>
  <div class="sign-up-fields">
    <vz-input
      v-model="vModel.firstName"
      capitalized
      label="GENERAL.FIRST_NAME"
      :rules="{ required: [true], maxLength: [Length.NAME] }"
      :error-message="fieldMessage?.firstName"
    />

    <vz-input
      v-model="vModel.lastName"
      capitalized
      label="GENERAL.LAST_NAME"
      :rules="{ required: [true], maxLength: [Length.NAME] }"
      :error-message="fieldMessage?.lastName"
    />

    <vz-input v-model="vModel.nickName" capitalized label="GENERAL.NICK_NAME" :error-message="fieldMessage?.nickName" />

    <vz-input v-model="vModel.company" label="GENERAL.COMPANY" :error-message="fieldMessage?.company" />

    <!--      TODO: Add dropdown company suggest -->
    <!--    <vz-select-->
    <!--      v-model="vModel.company"-->
    <!--      label="GENERAL.COMPANY"-->
    <!--      debounce="500"-->
    <!--      type="suggest"-->
    <!--      :loading="listCompaniesRequest.loading.value"-->
    <!--      :items="listCompaniesRequest.results.value || []"-->
    <!--      :error-message="fieldMessage?.company"-->
    <!--      @input="onCompanyUpdate"-->
    <!--    />-->

    <vz-select
      v-model="vModel.location"
      fixed
      type="select"
      label="GENERAL.ADDRESS"
      debounce="500"
      :items="listPlacesRequest.results.value || []"
      :loading="listPlacesRequest.loading.value"
      :rules="{ required: [true] }"
      :error-message="fieldMessage?.location"
      @search="listPlacesRequest.call"
    />

    <vz-input
      v-model="vModel.email"
      type="email"
      label="GENERAL.EMAIL"
      :rules="{ required: [true], regex: ValidatorRegex.EMAIL_ADDRESS, maxLength: [Length.EMAIL] }"
      :error-message="fieldMessage?.email"
    />

    <vz-input
      v-model="vModel.phone"
      type="phone"
      label="GENERAL.PHONE"
      :rules="{ required: [true], regex: ValidatorRegex.PHONE.HE }"
      :error-message="fieldMessage?.phone"
    />

    <vz-datepicker v-model="vModel.birthday" type="date" label="GENERAL.BIRTHDAY" :error-message="fieldMessage?.birthday" />

    <vz-select
      v-model="vModel.gender"
      fixed
      type="select"
      label="GENERAL.GENDER"
      :items="gender"
      :rules="{ required: [true] }"
      :error-message="fieldMessage?.gender"
    />

    <!--    <vz-autocomplete v-model="vModel.gender" :items="gender" label="GENERAL.GENDER" :error-message="fieldMessage?.gender" />-->
  </div>
</template>

<script setup lang="ts">
import type { BaseOptions, BaseItem } from '@/shared/models';
import type { AuthUnsecuredSignUp } from '@/store/auth/models/auth-sign-up-req';
import type { UserLocation } from '@/models';
import { Gender } from '@/constants/gender.enum';
import { computed, PropType } from 'vue';
import { LIST_ADDRESSES, LIST_COMPANIES } from '@/store/client/constants';
import { useI18n } from 'vue-i18n';
import useGeneralStore from '@/store/client/composables/use-general-store';
import { usePromise } from '@/shared/composables';
import { Length } from '@/shared/constants/length';
import ValidatorRegex from '@/shared/services/validator/service/record-validator/constants/validation-regex-pattern';
import { ListCompaniesRes } from '@/views/employee/models';

const props = defineProps({
  modelValue: { type: Object as PropType<AuthUnsecuredSignUp>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof AuthUnsecuredSignUp, string> | undefined>, default: undefined },
});

const emit = defineEmits(['update:model-value']);

const { t } = useI18n();

const vModel = computed({
  get: (): AuthUnsecuredSignUp => props.modelValue,
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }, value),
});

const gender = computed(() => Object.values(Gender).map((type): BaseItem => ({ title: t('GENDER.' + type).toString(), value: type })));

const { useActions } = useGeneralStore();
const { [LIST_COMPANIES]: listCompaniesAction, [LIST_ADDRESSES]: listPlacesAction } = useActions([LIST_COMPANIES, LIST_ADDRESSES]);

const listCompaniesRequest = usePromise(listCompaniesAction as (query: string) => Promise<ListCompaniesRes['companies']>);
const listPlacesRequest = usePromise<BaseOptions<UserLocation>>(listPlacesAction as (query: string) => Promise<BaseOptions<UserLocation>>);

const onCompanyUpdate = async (value: string): Promise<void> => {
  await listCompaniesRequest.call(value);
};
</script>
