<template>
  <div>
    <vz-select
      v-model="vModel.specialization"
      fixed
      type="multiselect"
      label="PROFILE.SPECIALIZATION"
      :rules="{ required: [true] }"
      :items="listClassificationRequest.results.value || []"
      :loading="listClassificationRequest.loading.value"
      :error-messages="fieldMessage?.specialization"
      @update:model-value="onSpecializationChange"
    />

    <vz-select
      v-model="vModel.skills"
      fixed
      type="multiselect"
      label="PROFILE.SKILLS"
      :rules="{ required: [true] }"
      :items="listSkillsRequest.results.value || []"
      :loading="listSkillsRequest.loading.value"
      :error-messages="fieldMessage?.skills"
      @update:model-value="$emit('update:model-value', { ...modelValue, skills: $event })"
    />
  </div>
</template>

<script setup lang="ts">
import type { AuthUnsecuredSignUp } from '@/store/auth/models/auth-sign-up-req';
import { computed, onMounted, PropType } from 'vue';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import VzSelect from '@/shared/components/fields/vz-select/vz-select.vue';

const props = defineProps({
  modelValue: { type: Object as PropType<AuthUnsecuredSignUp>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof AuthUnsecuredSignUp, string>>, default: () => ({}) },
});
const emit = defineEmits(['update:model-value']);

const vModel = computed({
  get: (): AuthUnsecuredSignUp => ({
    skills: [],
    specialization: [],
    ...props.modelValue,
  }),
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }),
});

const { listClassificationRequest, listSkillsRequest } = useJobTypes();

const onSpecializationChange = async (specialization: Array<string>): Promise<void> => {
  emit('update:model-value', { ...props.modelValue, specialization });

  if (!specialization?.length) {
    listSkillsRequest.results.value = [];
    emit('update:model-value', { ...props.modelValue, skills: [] });

    return;
  }

  await listSkillsRequest.call({ groups: specialization });
  const skills = vModel.value.skills?.filter((key) => !!listSkillsRequest.results.value?.find(({ value }) => value === key));
  emit('update:model-value', { ...props.modelValue, skills });
};

onMounted(async (): Promise<void> => {
  await listClassificationRequest.call();

  if (vModel.value.specialization?.length) {
    await listSkillsRequest.call({ groups: vModel.value.specialization });
  }
});
</script>
