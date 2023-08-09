<template>
  <div>
    <vz-textarea
      v-model="vModel.description"
      label="JOB_MANAGER.CREATE_JOB_POST_MODAL.DESCRIPTION"
      :rules="{ maxLength: [Length.DESCRIPTION] }"
      :error-message="fieldMessage?.description"
    />
  </div>
</template>

<script setup lang="ts">
import type { CreatePostJobReq } from '@/views/jobs/model/job';
import { computed, type PropType } from 'vue';
import { Length } from '@/shared/constants/length';

const props = defineProps({
  modelValue: { type: Object as PropType<CreatePostJobReq>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof CreatePostJobReq, string> | undefined>, default: undefined },
});

const emit = defineEmits(['update:model-value']);

const vModel = computed({
  get: (): CreatePostJobReq => props.modelValue,
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }),
});
</script>
