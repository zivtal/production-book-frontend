<template>
  <vz-card
    class="about-card my-2"
    :editable="editable"
    :callback="updateEmployeeProfileRequest"
    :payload="{ about: editContent }"
    @edit="editContent = about"
  >
    <template #view>
      <p class="about-card__content">
        {{ about || $t('PROFILE.ABOUT') }}
      </p>
    </template>

    <template #edit="{ errors }">
      <vz-textarea
        v-model="editContent"
        class="about-card__content vz-font-size-12"
        rows="24"
        :rules="{ maxLength: [Length.RICH_TEXT] }"
        :error-messages="errors?.about"
      />
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import type { UpdateProfileReq } from '@/views/employee/models';
import { ref } from 'vue';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { UPDATE_EMPLOYEE_PROFILE } from '@/views/employee/store/constants';
import { Length } from '@/shared/constants/length';

defineProps({ editable: { type: Boolean, default: false }, about: { type: String, default: '' } });

const { useActions } = useEmployeeStore();
const { [UPDATE_EMPLOYEE_PROFILE]: updateEmployeeProfileAction } = useActions([UPDATE_EMPLOYEE_PROFILE]);

const updateEmployeeProfileRequest = updateEmployeeProfileAction as (payload: UpdateProfileReq) => Promise<void>;

const editContent = ref<string>('');
</script>

<style lang="scss">
.about-card {
  position: relative;

  &__edit-button {
    z-index: 1;
  }

  &__content {
    font-size: var(--font-size-12) !important;
    color: var(--color-mono-500);
    white-space: pre-wrap;

    textarea {
      font-size: var(--font-size-14);
    }
  }
}
</style>
