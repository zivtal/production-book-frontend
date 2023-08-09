<template>
  <vz-card>
    <template v-if="item.jobOwner">
      <div class="flex">
        <vz-avatar :src="item.jobOwner.avatar" :size="64" />

        <div class="ms-2 mt-2">
          <div class="vz-font-size-16 vz-font-weight-700 flex-grow-1 text-ellipsis">
            <span class="me-1">{{ item.jobOwner.firstName }}</span>
            <span class="me-1">{{ item.jobOwner.lastName }}</span>
          </div>

          <p class="vz-font-size-12 vz-font-weight-600 text-ellipsis">{{ item.jobOwner.company }}</p>
        </div>
      </div>

      <vz-divider class="my-2" />
    </template>

    <div class="flex mb-2">
      <p class="vz-font-size-14 c-primary-900 vz-font-weight-500 me-2 text-ellipsis">{{ item.title }}</p>

      <vz-badge :text="getClassification(item.jobType)" font-size="12" />
    </div>

    <div class="mb-1">
      <p class="vz-font-size-14 vz-font-weight-600 c-mono-900">{{ formattedTime(item) }}</p>
    </div>

    <div class="flex align-center mb-1">
      <vz-image class="event-card__icon" :src="item.location?.icon" size="12" name="svg:location" />

      <p class="ms-2 vz-font-size-12 vz-font-weight-600 c-primary-800">{{ item.location?.title }}</p>
    </div>

    <template v-if="(participants || []).length">
      <vz-divider class="my-2" />

      <p class="ms-1 vz-font-size-14 vz-font-weight-600 c-primary-900 mb-1">{{ $t('JOB_MANAGER.PARTICIPANTS') }}:</p>

      <div class="flex flex-wrap">
        <div v-for="(participant, index) in participants" :key="index" class="flex flex-column">
          <vz-avatar :src="participant.avatar" :size="48" :title="`${participant.firstName} ${participant.lastName}`" />
          <div class="text-center vz-font-size-10 vz-font-weight-600 max-line-2 width-48">{{ participant.firstName }} {{ participant.lastName }}</div>
        </div>
      </div>
    </template>
  </vz-card>
</template>

<script setup lang="ts">
import { computed, type PropType } from 'vue';
import type { CalendarEvent } from '@/views/calendar/models';
import { formattedTime } from '@/views/calendar/helpers';
import { useJobTypes } from '@/views/jobs/composables/use-job-types';

const { getClassification } = useJobTypes();

const props = defineProps({ item: { type: Object as PropType<CalendarEvent>, required: true } });

const participants = computed(() => props.item?.positions?.map(({ participants }) => participants).flat());
</script>
