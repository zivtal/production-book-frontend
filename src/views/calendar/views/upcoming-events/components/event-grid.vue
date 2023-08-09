<template>
  <vz-infinity-scroll ref="infinityScrollRef" hide-first-load :callback="getUpcomingEventsRequest">
    <template #content="{ data }">
      <div v-for="(events, date, dateIndex) in getData(data)" :key="dateIndex" class="event-grid">
        <div v-if="dateIndex === isUpcomingIndex" class="text-center vz-font-size-18 vz-font-weight-700 c-primary-700 mt-4">
          {{ $t('CALENDAR.UPCOMING_EVENTS') }}
        </div>

        <div v-if="!isToday(+date)" class="vz-font-size-14 vz-font-weight-700 mt-3 c-primary-900">{{ formattedDate({ dateFrom: +date }) }}</div>

        <div class="event-grid__container">
          <event-card v-for="(event, eventIndex) in events" :key="eventIndex" class="clickable my-2" :item="event" @click="onClick(event)" />
        </div>
      </div>
    </template>
  </vz-infinity-scroll>
</template>

<script setup lang="ts">
import type { GetUpcomingEventsRes, GetUpcomingEventsReq } from '@/views/calendar/models';
import type { CalendarEvent } from '@/views/calendar/models';
import { defineAsyncComponent, ref, watch } from 'vue';
import { GET_UPCOMING_EVENTS } from '@/views/calendar/store/constants';
import { useAuthUser } from '@/views/employee/composables/use-auth-user';
import useCalendarStore from '@/views/calendar/composables/use-calendar-store';
import VzInfinityScroll from '@/shared/components/infinity-scroll/vz-infinity-scroll.vue';
import { eventsMapper } from '@/views/calendar/helpers/events-mapper';
import { formattedDate } from '../../../helpers';
import { isToday } from '@/views/calendar/helpers/is-today';
import { useRouter } from 'vue-router';
import CalendarRoutesMap from '@/views/calendar/constants/calendar-routes-map';

const EventCard = defineAsyncComponent(
  () => import(/* webpackChunkName: "calendar" */ '@/views/calendar/views/upcoming-events/components/event-card.vue')
);

const { useActions: useEmployeeActions } = useCalendarStore();
const { [GET_UPCOMING_EVENTS]: getUpcomingEventsAction } = useEmployeeActions([GET_UPCOMING_EVENTS]);

const getUpcomingEventsRequest = getUpcomingEventsAction as (payload?: GetUpcomingEventsReq) => Promise<GetUpcomingEventsRes>;

const router = useRouter();
const { activeUser } = useAuthUser();
const infinityScrollRef = ref<typeof VzInfinityScroll | undefined>(undefined);

const isUpcomingIndex = ref<number | undefined>(undefined);

const getData = (data: Array<CalendarEvent>): Record<string, Array<CalendarEvent>> => {
  const map = eventsMapper(data);
  isUpcomingIndex.value = Object.keys(map).findIndex((date) => +date > Date.now());

  return map;
};

const onClick = async (item: CalendarEvent): Promise<void> => {
  const { _id, routeName } = item;
  const route = { name: routeName, query: { forward: CalendarRoutesMap.UPCOMING_EVENT } };

  switch (routeName) {
    case 'job-manager':
      await router.replace({ ...route, params: { jobId: _id } });
      break;
    case 'job-offer':
      await router.replace({ ...route, params: { positionId: _id } });
      break;
    default:
      break;
  }
};

watch(
  () => [activeUser.value?._id],
  () => {
    if (!activeUser.value?._id) {
      return;
    }

    infinityScrollRef.value?.init();
  }
);
</script>

<style lang="scss">
.event-grid {
  padding: 0 0.5rem 1rem 1rem;

  &__container {
    margin-top: 0.5rem;
    display: flex;
    flex-direction: column;
  }
}
</style>
