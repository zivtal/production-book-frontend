<template>
  <vz-card class="position-card">
    <div class="position-card__skills">
      <vz-badge v-for="(type, index) in item.type" :key="index" :text="getSkill(type)" />
    </div>

    <div v-if="item.conversations.length" class="position-card__participants">
      <vz-avatar v-for="(avatar, index) in participants" :key="index" :src="avatar" :size="32" />

      <span>({{ totalParticipants }})</span>
    </div>

    <vz-divider />

    <div class="position-card__summarize">
      <div>
        <div class="vz-font-size-12">{{ $t('JOB_MANAGER.AMOUNT') }}</div>
        <div>{{ item.amount }}</div>
      </div>

      <div v-for="(value, name, index) in summery" :key="index">
        <div class="vz-font-size-12">{{ $t(`JOB_MANAGER.STATUS.${name}`) }}</div>
        <div>{{ value }}</div>
      </div>

      <div>
        <div class="vz-font-size-12">{{ $t('JOB_MANAGER.UNFILLED') }}</div>
        <div>{{ item.amount - summery.FREELANCER_ACCEPT }}</div>
      </div>
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import type { JobPosition } from '@/views/jobs/model/job';
import { computed, type PropType } from 'vue';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { JOB_DETAILS } from '@/views/jobs/store/constants';
import { useConversationSummery } from '@/views/jobs/views/post-job/composables/use-conversation-summery';
import { getParticipantsFromPosition } from '@/views/jobs/views/post-job/helpers';

const props = defineProps({ item: { type: Object as PropType<JobPosition>, required: true } });

const { useState } = useJobStore();
const { [JOB_DETAILS]: jobDetailsState } = useState([JOB_DETAILS]);

const { getSkill } = useJobTypes({ specialization: computed(() => (jobDetailsState.value?.jobType ? [jobDetailsState.value.jobType] : [])) });

const getSummery = useConversationSummery(computed(() => props.item?.conversations || []));

const summery = computed(() => {
  const { FREELANCER_ACCEPT, FREELANCER_INTERESTING } = getSummery.value;

  return { FREELANCER_ACCEPT, FREELANCER_INTERESTING };
});

const participants = getParticipantsFromPosition(props.item.conversations);

const totalParticipants = computed(() => (props.item.conversations || []).length - getSummery.value.FREELANCER_LEFT);
</script>

<style scoped lang="scss">
.position-card {
  @include rtl(margin, 1rem 1rem 1rem 0.5rem, 1rem 0.5rem 1rem 1rem);
  padding: 1rem;

  &__skills {
    display: flex;
    flex-wrap: wrap;
    justify-content: start;
    margin-bottom: 0.25rem;

    > * {
      margin: 0.25rem;
    }
  }

  &__participants {
    display: flex;
    align-items: center;
    margin-bottom: 0.5rem;

    > *:not(:last-child) {
      margin-inline-end: -0.5rem;
    }

    > span {
      margin-inline-start: 0.5rem;
    }
  }

  &__summarize {
    margin-top: 0.5rem;
    display: flex;

    > * {
      display: flex;
      flex-direction: column;
      align-items: center;
      flex: 1 0 0;
    }
  }
}
</style>
