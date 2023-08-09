<template>
  <div class="calendar">
    <div class="calendar__view" :class="{ 'calendar__view--full': !dayEvents }">
      <vz-calendar
        v-model:day="day"
        v-model:month="month"
        v-model:year="year"
        :events="getCalendarEventsRequest.results.value?.events"
        :colors="{ key: 'status', map: statusColor }"
        :translate="useCustomTranslation('CALENDAR', $t)"
        :loading="getCalendarEventsRequest.loading.value"
        @update="onChange"
        @update:day="updateDay"
        @update:events="onEventsUpdate"
      />
    </div>

    <vz-card class="calendar__day">
      <div class="calendar__day-header">
        {{ dayHeader }}
      </div>

      <div class="calendar__day-events">
        <vz-badge
          v-for="({ _id, routeName, title, dateFrom, dateTo, color, location }, index) in dayEvents"
          :key="index"
          clickable
          :color="color"
          @click="onClick(_id, routeName)"
        >
          <div class="calendar__event">
            <div class="calendar__event-prefix">
              <div v-for="(time, eventIndex) in eventFormattedTime({ dateFrom, dateTo })" :key="eventIndex">{{ time }}</div>
            </div>

            <div>
              <p class="calendar__event-title">{{ title }}</p>
              <p v-if="location?.address" class="calendar__event-address">{{ location.address }}</p>
            </div>
          </div>
        </vz-badge>
      </div>

      <div class="calendar__day-control">
        <!--        <vz-button mode="rounded" icon-name="svg:add" height="32" width="32" @click="$emit('add')" />-->
      </div>
    </vz-card>
  </div>
</template>

<script setup lang="ts">
import type { BaseId } from '@/shared/models';
import type { CalendarEvent, GetCalendarEventsReq, GetCalendarEventsRes } from '@/views/calendar/models';
import type { EventMap, CalendarEventsMap } from '@/shared/services/calendar-service/types';
import { GET_CALENDAR_EVENTS } from '@/views/calendar/store/constants';
import { usePromise } from '@/shared/composables';
import { computed, ref } from 'vue';
import { statusColor } from '@/views/calendar/constants/status-color-map';
import useCustomTranslation from '@/views/calendar/composables/use-custom-translation';
import eventFormattedTime from '@/views/calendar/helpers/event-formatted-time';
import { useRouter } from 'vue-router';
import { ROUTE_KEY_MAP } from '@/views/calendar/constants/route-key-map';
import CalendarRoutesMap from '@/views/calendar/constants/calendar-routes-map';
import useRouterWatcher from '@/views/calendar/composables/use-router-watcher';
import { MONTHS, WEEKDAYS } from '@/shared/services/calendar-service/calendar.constants';
import { useI18n } from 'vue-i18n';
import useCalendarStore from '@/views/calendar/composables/use-calendar-store';

const { useActions: useCalendarActions } = useCalendarStore();
const { [GET_CALENDAR_EVENTS]: getCalendarEventsAction } = useCalendarActions([GET_CALENDAR_EVENTS]);

const getCalendarEventsRequest = usePromise(getCalendarEventsAction as (payload?: GetCalendarEventsReq) => Promise<GetCalendarEventsRes>);

const { t } = useI18n();
const router = useRouter();

const day = ref<number>(+(router.currentRoute.value.query.day || new Date().getDate()));
const year = ref<number>(+(router.currentRoute.value.query.year || new Date().getFullYear()));
const month = ref<number>(+(router.currentRoute.value.query.month || new Date().getMonth() + 1));
const dayEvents = ref<CalendarEventsMap<CalendarEvent>>([]);

const dayHeader = computed(() => {
  const currentYear = year.value || new Date().getFullYear();
  const currentMonth = month.value - 1 || new Date().getMonth();
  const currentDay = day.value || new Date().getDate();
  const currentDate = new Date(currentYear, currentMonth, currentDay);

  return `${t(`CALENDAR.DAY.${WEEKDAYS[currentDate.getDay()]}`)}, ${currentDay} ${t(`CALENDAR.FULL_MONTH.${MONTHS[currentMonth]}`)} ${currentYear}`;
});

const onClick = async (id: BaseId, routeName?: CalendarEvent['routeName']): Promise<void> => {
  if (id && routeName) {
    await router.replace({
      name: routeName,
      params: { [ROUTE_KEY_MAP[routeName]]: id },
      query: { forward: CalendarRoutesMap.CALENDAR, year: year.value, month: month.value, day: day.value },
    });
  }
};

const onChange = async (payload: GetCalendarEventsReq): Promise<void> => {
  await router.push({ query: { ...payload } });
};

const onEventsUpdate = (events: Array<EventMap<CalendarEvent>>): void => {
  dayEvents.value = events;
};

const updateDay = (value: number) => {
  if (!value) {
    return;
  }

  router.push({ query: { ...router.currentRoute.value.query, day: value } });
};

useRouterWatcher(getCalendarEventsRequest.call, { query: { year, month, day } }, { immediate: true });
</script>

<style lang="scss">
.calendar {
  display: flex;
  flex-direction: initial;

  &__day {
    display: flex;
    flex-direction: column;
    overflow-y: auto;

    @include max-tablet-layout {
      padding: 8px;
    }

    &-header {
      display: flex;
      color: var(--color-primary-900);
      font-size: var(--font-size-22);
      font-weight: var(--font-weight-bold);

      > * {
        margin-inline-end: 0.25rem;
      }

      @include min-normal-layout {
        font-size: var(--font-size-22);
      }

      @include max-normal-layout {
        font-size: var(--font-size-18);
      }
    }

    &-events {
      flex-grow: 1;

      > * {
        margin: 0.25rem 0;
      }
    }

    &-control {
      display: flex;
      justify-content: flex-end;
      align-items: center;
    }
  }

  &__event {
    display: flex;

    > * {
      padding: 0.5rem;
    }

    &-prefix {
      position: relative;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: currentColor;
        opacity: 0.15;
        content: '';
      }
    }

    &-title,
    &-address {
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }

    &-title {
      font-size: var(--font-size-14);
    }

    &-address {
      font-size: var(--font-size-10);
    }
  }

  @include mobile-layout {
    flex-direction: column;

    .vz-card {
      border-radius: initial;
      margin: 0 !important;
    }

    &__view {
      width: 100%;

      &:not(&--full) {
        height: 320px !important;
      }

      &--full {
        flex-grow: 1;
      }
    }

    &__view {
    }

    &__day {
      width: 100%;
      flex-grow: 1;
    }
  }

  @include min-mobile-layout {
    flex-direction: row;

    &__view {
      &:not(&--full) {
        flex-basis: calc(100% / 3 * 2);
      }

      &--full {
        flex-grow: 1;
      }
    }

    &__day {
      margin-inline-start: 1rem;
      flex-basis: calc(100% / 3);
    }
  }
}
</style>
