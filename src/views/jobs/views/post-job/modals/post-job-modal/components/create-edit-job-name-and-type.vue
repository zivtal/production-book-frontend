<template>
  <div>
    <vz-input
      v-model="vModel.title"
      label="JOB_MANAGER.CREATE_JOB_POST_MODAL.PROJECT_NAME"
      :rules="{ required: [true], maxLength: [Length.TITLE] }"
      :disabled="isEditMode"
      :error-message="fieldMessage?.title"
    />

    <vz-select
      v-model="vModel.jobType"
      fixed
      type="select"
      label="JOB_MANAGER.JOB_CLASSIFICATION"
      :rules="{ required: [true] }"
      :items="listClassificationRequest.results.value || []"
      :loading="listClassificationRequest.loading.value"
      :disabled="isEditMode || listClassificationRequest.loading.value"
      :error-message="fieldMessage?.jobType"
    />
  </div>
</template>

<script setup lang="ts">
import type { CreatePostJobReq } from '@/views/jobs/model/job';
import { computed, onBeforeMount, PropType } from 'vue';
import { Length } from '@/shared/constants/length';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';

const props = defineProps({
  isEditMode: { type: Boolean, default: false },
  modelValue: { type: Object as PropType<CreatePostJobReq>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof CreatePostJobReq, string> | undefined>, default: undefined },
});

const emit = defineEmits(['update:model-value']);

const { listClassificationRequest } = useJobTypes();

const vModel = computed({
  get: (): CreatePostJobReq => props.modelValue,
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }),
});

onBeforeMount(async () => {
  await listClassificationRequest.call();
});
</script>
