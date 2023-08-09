<template>
  <vz-card class="job-details-card">
    <div class="job-details-card__time">
      <p>
        <span class="vz-font-size-14 vz-font-weight-600">{{ formattedDate(item) }}</span>
        <span class="vz-font-size-14">{{ formattedTime(item) }}</span>
      </p>

      <vz-badge v-if="hasUpdate(item.positions || [])" text="JOB.UPDATED" font-size="10" color="red-700" />
    </div>

    <div class="job-details-card__title">
      <p>
        <span class="vz-font-size-16 vz-font-weight-600">{{ item.title }}</span>
        <vz-badge :text="getClassification(item.jobType)" font-size="8" />
      </p>
    </div>

    <vz-divider class="my-2" />

    <div class="job-details-card__address">
      <p class="job-manager-table__item-location vz-font-size-14 vz-font-weight-600">
        <vz-image v-if="item.location?.icon" class="me-1" :src="item.location.icon" height="16" width="16" />
        <span>{{ item.location.title }}</span>
      </p>

      <p class="vz-font-size-12">{{ item.location.address }}</p>
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import type { GetJobDetailsRes } from '@/views/jobs/model/job';
import { type PropType } from 'vue';
import { formattedDate, formattedTime } from '@/views/calendar/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { hasUpdate } from '../../helpers';

defineProps({ item: { type: Object as PropType<GetJobDetailsRes>, required: true } });

const { getClassification } = useJobTypes();
</script>

<style scoped lang="scss">
.job-details-card {
  @include rtl(margin, 1rem 1rem 1rem 0.5rem, 1rem 0.5rem 1rem 1rem);
  padding: 1rem;

  &__time,
  &__title {
    display: flex;
    justify-content: space-between;
    margin-bottom: 0.25rem;

    p {
      display: flex;
      align-items: center;

      > span:not(:last-child) {
        margin-inline-end: 0.25rem;
      }
    }
  }

  &___address {
    margin-bottom: 0.25rem;
  }

  &__summarized {
    display: flex;
    flex-direction: column;
    margin-top: 1rem;

    > div {
      display: flex;
      text-align: center;

      > * {
        flex-basis: calc(100% / 3);
      }
    }
  }
}
</style>
