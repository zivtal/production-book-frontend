<template>
  <vz-card class="my-2" :editable="editable" :callback="updateEmployeeProfileRequest" :payload="editContent" @edit="toggleEditMode">
    <template #view>
      <p class="vz-subtitle-1">{{ $t('PROFILE.SPECIALIZATION') }}</p>

      <div class="flex flex-wrap justify-start pt-1">
        <vz-badge v-for="({ title }, index) in specialization" :key="index" class="px-1 mb-1 mx-1" :text="title" />
      </div>

      <p class="vz-subtitle-1 mt-2">{{ $t('PROFILE.SKILLS') }}</p>

      <div class="flex flex-wrap justify-start pt-1">
        <vz-badge v-for="({ title }, index) in skills" :key="index" class="px-1 mb-1 mx-1" :text="title" />
      </div>
    </template>

    <template #edit="{ errors }">
      <p class="vz-subtitle-1">{{ $t('PROFILE.SPECIALIZATION') }}</p>

      <div>
        <vz-select
          v-model="editContent.specialization"
          badges
          auto-close-on-select
          type="multiselect"
          :rules="{ required: [true] }"
          :items="listClassificationRequest.results.value || []"
          :loading="listClassificationRequest.loading.value"
          :error-message="errors?.specialization"
          @update:model-value="onUpdate"
        />
      </div>

      <p class="vz-subtitle-1 mt-2">{{ $t('PROFILE.SKILLS') }}</p>

      <div>
        <vz-select
          v-model="editContent.skills"
          badges
          auto-close-on-select
          type="multiselect"
          :rules="{ required: [true] }"
          :items="listSkillsRequest.results.value || []"
          :loading="listSkillsRequest.loading.value"
          :error-message="errors?.skills"
          @update:model-value="onUpdate"
        />
      </div>
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import type { UpdateProfileReq } from '@/views/employee/models';
import type { BaseOptions } from '@/shared/models';
import { type PropType, ref } from 'vue';
import { UPDATE_EMPLOYEE_PROFILE } from '@/views/employee/store/constants';
import useEmployeeStore from '@/views/employee/composables/use-employee-store';
import { debounce } from 'lodash';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';

const props = defineProps({
  editable: { type: Boolean, default: false },
  skills: { type: Array as PropType<BaseOptions<string>>, default: () => [] },
  specialization: { type: Array as PropType<BaseOptions<string>>, default: () => [] },
});

const { [UPDATE_EMPLOYEE_PROFILE]: updateEmployeeProfileAction } = useEmployeeStore().useActions([UPDATE_EMPLOYEE_PROFILE]);
const { listClassificationRequest, listSkillsRequest } = useJobTypes();

const updateEmployeeProfileRequest = updateEmployeeProfileAction as (payload: UpdateProfileReq) => Promise<void>;

const isEditMode = ref<boolean>(false);
const editContent = ref<Partial<UpdateProfileReq>>({
  skills: props.skills?.map(({ value }) => value),
  specialization: props.specialization?.map(({ value }) => value),
});

const toggleEditMode = async (): Promise<void> => {
  if (!isEditMode.value) {
    await listClassificationRequest.call();
    await listSkillsRequest.call({ groups: props.specialization?.map(({ value }) => value) });
    editContent.value = { specialization: props.specialization?.map(({ value }) => value), skills: props.skills?.map(({ value }) => value) };
  }

  isEditMode.value = !isEditMode.value;
};

const onUpdate = debounce(async (): Promise<void> => {
  await listSkillsRequest.call({ groups: editContent.value.specialization });
  editContent.value.skills = editContent.value.skills?.filter(
    (skillValue) => !!listSkillsRequest.results.value?.find(({ value }) => skillValue === value)
  );
}, 1000);
</script>
