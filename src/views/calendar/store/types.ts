import type AugmentedActionContext from '@/store/types/augmented-action-context';
import type { StateCache } from '@/store/services/store.cache';
import type { GetCalendarEventsReq, GetCalendarEventsRes, GetUpcomingEventsRes } from '@/views/calendar/models';
import {
  UPCOMING_EVENTS,
  GET_UPCOMING_EVENTS,
  SET_UPCOMING_EVENTS,
  CALENDAR_EVENTS_CACHE,
  GET_CALENDAR_EVENTS,
  SET_CALENDAR_EVENTS_CACHE,
} from '@/views/calendar/store/constants';

type StoreContext = AugmentedActionContext<CalendarState, CalendarMutations, CalendarActions>;

// store
export type CalendarState = {
  [CALENDAR_EVENTS_CACHE]: StateCache<GetCalendarEventsRes>;
  [UPCOMING_EVENTS]: GetUpcomingEventsRes | null;
};

export interface CalendarActions {
  [GET_CALENDAR_EVENTS](_: StoreContext, payload?: GetCalendarEventsReq): Promise<GetCalendarEventsRes>;
  [GET_UPCOMING_EVENTS]({ state, commit }: StoreContext): Promise<GetUpcomingEventsRes>;
}

export interface CalendarMutations<S = CalendarState> {
  [SET_CALENDAR_EVENTS_CACHE](state: S, payload: StateCache<GetCalendarEventsRes>): void;
  [SET_UPCOMING_EVENTS](state: S, payload?: GetUpcomingEventsRes): void;
}

export type CalendarGetters<S = CalendarState> = {
  [CALENDAR_EVENTS_CACHE](state: S): StateCache<GetCalendarEventsRes>;
  [UPCOMING_EVENTS](state: S): GetUpcomingEventsRes | null;
};
