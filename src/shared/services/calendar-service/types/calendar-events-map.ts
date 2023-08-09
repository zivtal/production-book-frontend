import { EventMap } from '@/shared/services/calendar-service/types/event-type';

export type CalendarEventsMap<T> = Record<number, EventMap<T>>;
