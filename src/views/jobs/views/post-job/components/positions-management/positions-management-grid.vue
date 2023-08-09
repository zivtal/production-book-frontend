<template>
  <div class="job-positions-grid">
    <div v-if="jobDetailsState" class="job-positions-grid__job-details">
      <div>
        <span class="vz-font-size-16 vz-font-weight-600">{{ jobDetailsState.title }}</span>
        <vz-badge :text="getClassification(jobDetailsState.jobType)" font-size="8" />
      </div>

      <div>
        <p>
          <span class="vz-font-size-12 vz-font-weight-600">{{ formattedDate(jobDetailsState) }}</span>
          <span class="vz-font-size-12 ms-1">{{ formattedTime(jobDetailsState) }}</span>
        </p>

        <vz-badge v-if="hasUpdate(jobDetailsState?.positions)" text="JOB.UPDATED" font-size="10" color="red-700" />
      </div>

      <div>
        <p class="job-manager-table__item-location vz-font-size-14 vz-font-weight-600">
          <vz-image v-if="jobDetailsState.location?.icon" class="me-1" :src="jobDetailsState.location?.icon" height="16" width="16" />
          <span>{{ jobDetailsState.location?.title }}</span>
        </p>

        <p class="vz-font-size-12">{{ jobDetailsState.location?.address }}</p>
      </div>
    </div>

    <div class="job-positions-grid__items">
      <position-card
        v-for="(position, index) in jobDetailsState?.positions || []"
        :key="index"
        :item="position"
        @click="$emit('select', position._id)"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { JOB_DETAILS } from '@/views/jobs/store/constants';
import useJobStore from '@/views/jobs/composables/use-job-store';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { hasUpdate } from '@/views/jobs/views/post-job/helpers';
import { formattedDate, formattedTime } from '@/views/calendar/helpers';
import PositionCard from '@/views/jobs/views/post-job/components/positions-management/positions-management-card.vue';

const { useState } = useJobStore();
const { [JOB_DETAILS]: jobDetailsState } = useState([JOB_DETAILS]);

const { getClassification } = useJobTypes();

defineEmits(['select', 'back']);
</script>

<style lang="scss">
.job-positions-grid {
  display: flex;
  flex-direction: column;
  max-height: calc(100vh - var(--header-height) - var(--footer-height) - 3rem);
  overflow-y: auto;

  &__job-details {
    top: 0;
    position: sticky;
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: var(--color-background-1);
    z-index: 1;

    > * {
      text-align: center;
      width: fit-content;
    }
  }

  &__items {
    flex-grow: 1;
  }
}
</style>
