<template>
  <event-now-card v-if="isNow" :item="item" />

  <event-upcoming-card v-else :item="item" />
</template>

<script setup lang="ts">
import type { CalendarEvent } from '@/views/calendar/models';
import { computed, defineAsyncComponent, type PropType } from 'vue';

const EventNowCard = defineAsyncComponent(
  () => import(/* webpackChunkName: "calendar" */ '@/views/calendar/views/upcoming-events/components/event-now-card.vue')
);

const EventUpcomingCard = defineAsyncComponent(
  () => import(/* webpackChunkName: "calendar" */ '@/views/calendar/views/upcoming-events/components/event-upcoming-card.vue')
);

const props = defineProps({
  loading: { type: Boolean, default: false },
  clickable: { type: Boolean, default: true },
  item: { type: Object as PropType<CalendarEvent>, required: true },
});

const isNow = computed((): boolean => {
  const now = Date.now().valueOf();

  return props.item.dateFrom <= now && now <= props.item.dateTo;
});
</script>

<style lang="scss">
.event-card {
  text-align: center;
  transition: color 0.3s, background-color 0.3s;

  &__icon {
    width: 17px;
  }

  &__button {
    background: var(--color-background-2);
    box-shadow: var(--shadow-level-1);
  }
}
</style>
