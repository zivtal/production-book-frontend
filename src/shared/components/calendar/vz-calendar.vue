<template>
  <div class="vz-calendar" :class="{ 'vz-calendar--loading': loading }">
    <div class="vz-calendar__header">
      <vz-icon
        clickable
        name="svg:previous"
        size="18"
        :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'CALENDAR.PREVIOUS_MONTH' })"
        @click="onBack"
      />

      <div class="vz-calendar__header-title">
        <span>{{ displayMonth }}</span>
        <span>{{ localYear }}</span>
      </div>

      <vz-icon
        clickable
        role="button"
        name="svg:next"
        size="18"
        :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'CALENDAR.NEXT_MONTH' })"
        @click="onNext"
      />
    </div>

    <div class="vz-calendar__weekdays">
      <div v-for="calendarDay in calendar.weekdays" :key="calendarDay">{{ translate(calendarDay, 'SHORT_DAY') }}</div>
    </div>

    <div class="vz-calendar__container">
      <day
        v-for="(date, index) in matrixDays"
        :key="index"
        :class="{
          'vz-calendar__day': !!date,
          'vz-calendar__day--today': date?.date.valueOf() === calendar.today(),
          'vz-calendar__day--active': date && vActiveDate === date?.date.valueOf(),
          'vz-calendar__day--mark': date?.date && !!eventsMap[date?.date.valueOf()]?.length,
          'vz-calendar__day--disabled': (date && minDate && date.valueOf() < minDate) || (maxDate && date.valueOf() > maxDate),
        }"
        role="button"
        :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'CALENDAR.SELECT_DAY' })"
        :extendable="extendable"
        :day="date?.day || 0"
        @click="onSelect(date)"
      >
        <template v-if="date">
          <template v-for="(event, eventIndex) in eventsMap[date?.date.valueOf() || 0]" :key="eventIndex">
            <vz-badge font-size="10" :prefix="event.time" :text="event.title" :color="event.color" />
          </template>
        </template>
      </day>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CalendarDay } from '@/shared/services/calendar-service/types/calendar-day';
import { computed, PropType, ref, watch } from 'vue';
import Calendar from '@/shared/services/calendar-service/calendar.service';
import Day from '@/shared/components/calendar/components/vz-calendar-day.vue';
import { useTranslator } from '@/plugins/i18n/helpers';

const t = useTranslator();

const props = defineProps({
  day: { type: Number, default: new Date().getDate() }, // day
  year: { type: Number, default: new Date().getFullYear() }, // year
  month: { type: Number, default: new Date().getMonth() + 1 }, // month
  minDate: { type: Number, default: undefined }, // timestamp
  maxDate: { type: Number, default: undefined }, // timestamp
  events: { type: Array as PropType<Array<Record<string, any>>>, default: () => [] }, // events
  idKey: { type: String, default: '_id' }, // event id key name
  titleKey: { type: String, default: 'title' }, // event title key name
  dateFromKey: { type: String, default: 'dateFrom' }, // event start date key name
  dateToKey: { type: String, default: 'dateTo' }, // event end date key name
  // event status key name + maps according status value
  colors: { type: Object as PropType<{ key: string; map: Record<string, string> } | undefined>, default: undefined },
  translate: { type: Function as PropType<(value: string, subPath?: string) => string>, default: (value: string) => value },
  loading: { type: Boolean, default: false },
  extendable: { type: Boolean, default: false },
});

const emit = defineEmits(['select', 'update', 'update:events', 'update:year', 'update:month', 'update:day']);

const calendar = new Calendar({
  idKey: props.idKey,
  titleKey: props.titleKey,
  fromKey: props.dateFromKey,
  toKey: props.dateToKey,
  colors: props.colors,
});

const vYear = computed({
  get: (): number => props.year || calendar.today('year'),
  set: (value) => emit('update:year', value),
});

const vMonth = computed({
  get: (): number => props.month || calendar.today('month'),
  set: (value) => emit('update:month', value),
});

const localYear = ref<number>(+vYear.value);
const localMonth = ref<number>(+vMonth.value);

const vActiveDate = computed({
  get: (): number => new Date(vYear.value, vMonth.value - 1, props.day).valueOf() || calendar.today(),
  set: (value) => emit('update:day', value),
});

const matrixDays = computed((): Array<CalendarDay | null> => calendar.days(localYear.value, localMonth.value - 1));
const eventsMap = computed(() => calendar.events(props.events));
const dayEvents = computed(() => (vActiveDate.value ? eventsMap.value[vActiveDate.value] : null));
const displayMonth = computed(() => props.translate(calendar.months[localMonth.value - 1], 'FULL_MONTH'));

const onSelect = (date: CalendarDay | null) => {
  if (!date) {
    return;
  }

  if ((props.minDate && date.date.valueOf() < props.minDate) || (props.maxDate && date.date.valueOf() > props.maxDate)) {
    return;
  }

  emit('select', date.date.valueOf());
  emit('update:day', date.date.getDate());
};

const onNext = () => {
  console.log(localMonth.value);
  if (localMonth.value === 12) {
    localYear.value = +localYear.value + 1;
    localMonth.value = 1;
  } else {
    localMonth.value = +localMonth.value + 1;
  }

  emit('update', { year: +localYear.value, month: +localMonth.value });
};

const onBack = () => {
  if (localMonth.value <= 1) {
    localYear.value = +localYear.value - 1;
    localMonth.value = 12;
  } else {
    localMonth.value = +localMonth.value - 1;
  }

  emit('update', { year: +localYear.value, month: +localMonth.value });
};

watch(
  () => [dayEvents.value],
  () => emit('update:events', dayEvents.value),
  { immediate: true }
);
</script>

<style lang="scss">
.vz-calendar {
  display: flex;
  flex-direction: column;
  height: 100%;

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem;
    user-select: none;

    svg {
      @include rtl(transform, scale(-1));
    }

    &-title {
      display: flex;

      > * {
        color: var(--color-primary-900);
        font-weight: bold;
        margin: 0 0.5rem;
      }
    }

    @include min-tablet-layout {
      svg {
        height: 24px;
        width: 24px;
      }

      > div > span {
        font-size: 24px;
      }
    }

    @include max-tablet-layout {
      svg {
        height: 14px;
        width: 14px;
      }

      > div > span {
        font-size: 18px;
      }
    }
  }

  &__weekdays {
    position: relative;
    display: flex;
    font-size: var(--font-size-14);
    font-weight: var(--font-weight-medium);
    margin: 0.5rem 0;

    .vz-calendar--loading & {
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 0.25rem;
        background-image: linear-gradient(100deg, transparent 5%, var(--color-primary-900) 42.5%, transparent 95%);
        background-repeat: no-repeat;
        background-size: 35% 100%;
        background-position: 0 0;
        animation: skeletonOverlay 2s linear infinite;
      }

      @keyframes skeletonOverlay {
        0% {
          background-position: -100% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    }

    > * {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-grow: 1;
    }
  }

  &__container {
    display: grid;
    grid-template-columns: repeat(7, calc(100% / 7));
    grid-template-rows: repeat(6, calc(100% / 6));
    flex-grow: 1;

    > * {
      margin: 1px;
    }
  }

  &__day {
    position: relative;
    transition: background-color 0.3s;
    overflow: hidden;
    border: 1px solid var(--color-mono-300);

    @include max-tablet-layout {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;

      > *:not(:first-child) {
        display: none;
      }

      &--mark {
        > div {
          position: relative;
          width: 100%;

          &:before {
            content: '';
            position: absolute;
            left: 50%;
            bottom: -0.25rem;
            width: 60%;
            height: 25%;
            max-width: 0.5rem;
            max-height: 0.5rem;
            background-color: var(--color-primary-900) !important;
            border-radius: var(--border-radius-1);
            transform: translateX(-50%);
          }
        }
      }
    }

    @include min-tablet-layout {
      > div:first-child {
        font-size: var(--font-size-12);
        font-weight: var(--font-weight-medium);
      }
    }

    &-events {
      @include max-tablet-layout {
        display: none;
      }
    }

    &--today {
      color: var(--color-primary-500);

      &:before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        content: '';
        background-color: currentColor;
        opacity: 0.05;
      }
    }

    &--active {
      background-color: var(--color-background-2);
      outline: 2px solid var(--color-primary-900);
    }

    &--disabled {
      color: var(--color-mono-500);
    }

    > * {
      margin: 2px;
    }
  }
}
</style>
