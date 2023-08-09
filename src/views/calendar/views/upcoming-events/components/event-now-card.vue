<template>
  <vz-card class="text-center">
    <div class="mb-2">
      <p class="vz-font-size-16 vz-font-weight-500 c-red-600">{{ formattedDate(item) }}</p>
    </div>

    <div class="event-card__time mb-1">
      <p class="vz-font-size-14 vz-font-weight-600">{{ formattedTime(item) }}</p>
    </div>

    <div class="mb-1">
      <p class="vz-font-size-18 vz-font-weight-600 c-mono-900">{{ item.title }}</p>
    </div>

    <div class="mb-1 flex align-center justify-center">
      <vz-badge class="fit-content" :text="getClassification(item.jobType)" font-size="10" />
    </div>

    <div class="flex align-center justify-center c-primary-900 mb-1">
      <vz-image class="event-card__icon" :src="item.location?.icon" size="12" name="svg:location" />
      <p class="ms-2 vz-font-size-12 vz-font-weight-600">{{ item.location?.title }}</p>
    </div>

    <div class="event-card__send mb-1">
      <vz-button
        width="40"
        height="40"
        mode="rounded"
        icon-color="primary"
        radius="20"
        icon-size="21"
        icon-name="svg:send"
        class="event-card__button"
      />
    </div>

    <p class="vz-font-size-14 vz-font-weight-600 c-red-600">{{ $t('CALENDAR.PRESS_TO_NAVIGATE') }}</p>
  </vz-card>
</template>

<script setup lang="ts">
import { type PropType } from 'vue';
import type { CalendarEvent } from '@/views/calendar/models';
import { formattedDate, formattedTime } from '@/views/calendar/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';

const { getClassification } = useJobTypes();

defineProps({ item: { type: Object as PropType<CalendarEvent>, required: true } });
</script>
