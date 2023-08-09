<template>
  <div class="post-job-positions">
    <div class="post-job-positions__header">
      <p class="vz-title-h2">{{ $t('JOB_MANAGER.CREATE_JOB_POST_MODAL.POSITIONS') }}</p>
      <vz-button text="GENERAL.ADD" icon-name="svg:add" height="24" @click="addSkill" />
    </div>

    <vz-card v-for="(position, index) in vModel.positions" :key="index" class="mb-2">
      <div class="post-job-positions__position">
        <vz-select
          v-model="position.type"
          class="post-job-positions__position-skills"
          badges
          auto-close-on-select
          type="multiselect"
          label="JOB.POSITION_REQUIREMENTS"
          :rules="{ required: [true] }"
          :items="listSkillsRequest.results.value || []"
          :loading="listSkillsRequest.loading.value"
        />

        <vz-input
          v-model="position.amount"
          class="post-job-positions__position-amount"
          type="number"
          label="JOB_MANAGER.CREATE_JOB_POST_MODAL.POSITION_AMOUNT"
          :disabled="listSkillsRequest.loading.value"
          :rules="{ required: [true], min: [1] }"
        />
      </div>

      <vz-input
        v-model="position.comment"
        type="text"
        label="JOB_MANAGER.CREATE_JOB_POST_MODAL.POSITION_COMMENT"
        :rules="{ maxLength: [Length.COMMENT] }"
      />

      <div class="flex justify-end">
        <vz-button
          v-if="vModel.positions.length > 1"
          icon-name="svg:trash"
          text="GENERAL.REMOVE"
          background-color="red-700"
          class="ms-2 height-30"
          @click.stop="removeSkill(index)"
        />
      </div>
    </vz-card>
  </div>
</template>

<script setup lang="ts">
import type { Position } from '@/views/jobs/model/position';
import type { CreatePostJobReq } from '@/views/jobs/model/job';
import { computed, PropType, watch } from 'vue';
import { Length } from '@/shared/constants/length';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import VzSelect from '@/shared/components/fields/vz-select/vz-select.vue';

const props = defineProps({
  modelValue: { type: Object as PropType<CreatePostJobReq>, required: true },
  fieldMessage: { type: Object as PropType<Record<keyof CreatePostJobReq, string> | undefined>, default: undefined },
});
const emit = defineEmits(['update:model-value']);

const { listSkillsRequest } = useJobTypes();

const addSkill = (): void =>
  emit('update:model-value', { ...props.modelValue, positions: [...props.modelValue.positions, { amount: 1 } as Position] });

const removeSkill = (removeIndex: number): void =>
  emit('update:model-value', {
    ...props.modelValue,
    positions: props.modelValue.positions.filter((_, index) => index !== removeIndex),
  });

const vModel = computed({
  get: (): CreatePostJobReq => props.modelValue,
  set: (value) => emit('update:model-value', { ...props.modelValue, ...value }),
});

watch(
  () => vModel.value.jobType,
  async (jobType) => {
    if (!jobType) {
      return;
    }

    await listSkillsRequest.call({ groups: [jobType] });
  },
  { immediate: true }
);
</script>

<style lang="scss">
.post-job-positions {
  &__header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 1rem;

    > * {
      margin-inline-start: 0.25rem;
    }
  }

  &__position {
    width: 100%;
    display: flex;

    &-skills {
      width: calc(100% - 96px);
    }

    &-amount {
      padding-inline-start: 1rem;
      width: 96px;
    }
  }
}
</style>
