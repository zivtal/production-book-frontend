<template>
  <vz-data-table
    class="job-position-table"
    :headers="tableHeaders"
    :items="jobDetailsState?.positions || []"
    id-key="_id"
    @select="$emit('select', $event)"
  >
    <template #type="{ item, itemIndex }">
      <div class="job-position-table__item">
        <span v-for="(type, index) in item.type" :key="index" :class="{ 'vz-font-weight-700': positionUpdated[itemIndex] }">
          {{ getSkill(type) }}
          <span v-if="index < item.type.length - 1">,</span>
        </span>

        <vz-badge v-if="positionUpdated[itemIndex]" text="JOB.UPDATED" font-size="10" />
      </div>
    </template>

    <template #pending="{ item }">
      {{ getSummeryOf(item.conversations, ConversationStatusType.OWNER_ACCEPT) }}
    </template>

    <template #left="{ item }">
      {{ getSummeryOf(item.conversations, ConversationStatusType.FREELANCER_LEFT) }}
    </template>
  </vz-data-table>
</template>

<script setup lang="ts">
import type { GetConversationRes } from '@/views/jobs/model/conversation';
import { computed, watch } from 'vue';
import { JOB_DETAILS } from '@/views/jobs/store/constants';
import { TableHeader } from '@/shared/components/tables/models/table-header';
import { ConversationStatusType } from '../../../../constants/conversation-status-type';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';

const { useState } = useJobStore();
const { [JOB_DETAILS]: jobDetailsState } = useState([JOB_DETAILS]);

const { listSkillsRequest, getSkill } = useJobTypes();

defineEmits(['select', 'back']);

const tableHeaders: Array<TableHeader> = [
  { title: 'JOB.POSITION_REQUIREMENTS', value: 'type' },
  { title: 'JOB_MANAGER.AMOUNT', value: 'amount', style: { textAlign: 'center' } },
  { title: 'JOB_MANAGER.PENDING', value: 'pending', style: { textAlign: 'center' } },
  { title: 'JOB_MANAGER.INTERESTING', value: 'participants' },
];

const positionUpdated = computed(
  (): Array<boolean> =>
    (jobDetailsState.value?.positions || []).map(({ conversations }) => (conversations || []).some(({ hasUpdated }) => hasUpdated))
);

const getSummeryOf = (conversations: Array<GetConversationRes>, type?: keyof typeof ConversationStatusType): number =>
  (conversations || []).reduce((sum, { status }) => (status?.type === type ? sum + 1 : sum), 0);

watch(
  () => jobDetailsState.value?.jobType,
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
.job-position-table {
  &__item {
    display: flex;

    > span > span {
      margin-inline-end: 0.25rem;
    }

    > :last-child {
      margin-inline-start: 0.25rem;
    }
  }
}
</style>
