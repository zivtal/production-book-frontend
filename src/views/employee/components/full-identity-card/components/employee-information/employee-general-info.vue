<template>
  <vz-card
    class="general-info-card vz-font-size-12 my-2"
    :editable="editable"
    :callback="updateEmployeeProfileRequest"
    :payload="editContent"
    @edit="toggleEditMode"
  >
    <template #view>
      <div class="flex mt-2">
        <p class="vz-subtitle-1 width-80">{{ $t('IDENTITY_CARD.GENDER') }}</p>

        <p class="vz-value-1">{{ user.gender ? $t(`GENDER.${user.gender}`) : '-' }}</p>
      </div>

      <div class="flex mt-2">
        <p class="vz-subtitle-1 width-80">{{ $t('IDENTITY_CARD.BIRTHDAY') }}</p>

        <p class="vz-value-1">{{ birthday }}</p>
      </div>

      <div class="mt-2">
        <p class="vz-subtitle-1 width-80">{{ $t('IDENTITY_CARD.LANGUAGES') }}</p>

        <div class="flex flex-wrap justify-start pt-1">
          <vz-badge v-for="(value, index) in user?.language" :key="index" class="px-1 mb-1 mx-1" :text="getLanguage(value)" />
        </div>
      </div>
    </template>

    <template #edit="{ errors }">
      <vz-autocomplete v-model="editContent.gender" label="IDENTITY_CARD.GENDER" :items="gender" :error-message="errors?.gender" />

      <vz-datepicker v-model="editContent.birthday" nullable label="IDENTITY_CARD.BIRTHDAY" type="date" :error-message="errors?.birthday" />

      <vz-select
        v-model="editContent.language"
        badges
        auto-close-on-select
        type="multiselect"
        label="IDENTITY_CARD.LANGUAGES"
        :rules="{ required: [true] }"
        :item-title="({ titleEn }) => titleEn"
        :items="languages"
        :error-message="errors?.language"
      />
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import type { ProfileFullDetails, UpdateProfileReq } from '@/views/employee/models';
import type { BaseItem } from '@/shared/models';
import { computed, type PropType, ref } from 'vue';
import dayjs from 'dayjs';
import { GlobalVariables } from '@/shared/constants/global-variables';
import { UPDATE_EMPLOYEE_PROFILE } from '@/views/employee/store/constants';
import { Gender } from '@/constants/gender.enum';
import languages from '@/json/language.json';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { useI18n } from 'vue-i18n';

const props = defineProps({
  editable: { type: Boolean, default: false },
  user: { type: Object as PropType<ProfileFullDetails | undefined>, default: undefined },
});

const { t } = useI18n();

const { [UPDATE_EMPLOYEE_PROFILE]: updateEmployeeProfileAction } = useEmployeeStore().useActions([UPDATE_EMPLOYEE_PROFILE]);

const updateEmployeeProfileRequest = updateEmployeeProfileAction as (payload: UpdateProfileReq) => Promise<void>;

const birthday = computed(() => (props.user?.birthday ? dayjs(props.user?.birthday).format(GlobalVariables.DAY_MONTH_YEAR_FORMAT) : '-'));
const gender = computed(() => Object.values(Gender).map((type): BaseItem => ({ title: t('GENDER.' + type).toString(), value: type })));

const editContent = ref<Partial<UpdateProfileReq>>({
  gender: props.user?.gender,
  birthday: props.user?.birthday,
  language: props.user?.language,
});

const getLanguage = (value: string): string | undefined => {
  const language = languages.find((item) => item.value === value);

  return language?.title === language?.titleEn ? language?.title : `${language?.title} (${language?.titleEn})`;
};

const toggleEditMode = async (): Promise<void> => {
  editContent.value = {
    gender: props.user?.gender,
    birthday: props.user?.birthday,
    language: props.user?.language,
  };
};
</script>

<style lang="scss">
.general-info-card {
  &__value {
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--color-mono-500);
  }
}
</style>
