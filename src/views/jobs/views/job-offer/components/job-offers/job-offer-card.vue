<template>
  <vz-card class="job-offer-card">
    <div class="job-offer-card__time">
      <p>
        <span class="vz-font-size-16 vz-font-weight-600">{{ formattedDate(item) }}</span>
        <span class="vz-font-size-14">{{ formattedTime(item) }}</span>
      </p>

      <vz-badge v-if="item.hasUpdated" text="JOB.UPDATED" font-size="10" color="red-700" />
    </div>

    <div class="job-offer-card__title">
      <p>
        <span class="vz-font-size-16" :class="{ 'vz-font-weight-600': item.title }">
          <vz-badge :text="item.title || getClassification(item.jobType)" />
        </span>
        <span v-if="item.title" class="vz-font-size-12">({{ getClassification(item.jobType) }})</span>
      </p>
    </div>

    <div v-if="item.location" class="job-offer-card__address">
      <p class="job-manager-table__item-location vz-font-size-14 vz-font-weight-600">
        <vz-image v-if="item.location.icon" class="me-1" :src="item.location.icon" height="16" width="16" alt="" role="presentation" />

        <span v-if="item.location.title">{{ item.location.title }}</span>
      </p>

      <p v-if="item.location.address" class="vz-font-size-12">{{ item.location.address }}</p>
    </div>

    <vz-divider v-if="item.status" class="job-offer-card__divider" />

    <div class="job-offer-card__status">
      <conversation-status-badge v-if="item.status" :status="item.status" />
    </div>
  </vz-card>
</template>

<script setup lang="ts">
import { defineAsyncComponent, type PropType } from 'vue';
import { formattedDate, formattedTime } from '@/views/calendar/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';
import { PositionSearchRes } from '@/views/jobs/model/position';

const ConversationStatusBadge = defineAsyncComponent(
  () => import(/* webpackChunkName: "job-offer" */ '@/views/jobs/components/conversation-status-badge.vue')
);

defineProps({ item: { type: Object as PropType<PositionSearchRes>, required: true } });

const { getClassification } = useJobTypes();
</script>

<style scoped lang="scss">
.job-offer-card {
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

  &__address {
    margin: 0.25rem 0;
  }

  &__divider {
    margin: 0.5rem 0;
  }

  &__status {
    display: flex;
    justify-content: flex-end;
  }
}
</style>
