import type { MutationTree } from 'vuex';
import type { StateCache } from '@/store/services/store.cache';
import type { CalendarState } from '@/views/calendar/store/types';
import type { GetCalendarEventsRes, GetUpcomingEventsRes } from '@/views/calendar/models';
import { initialState } from '@/views/calendar/store/index';
import { SET_UPCOMING_EVENTS, UPCOMING_EVENTS, CALENDAR_EVENTS_CACHE, SET_CALENDAR_EVENTS_CACHE } from '@/views/calendar/store/constants';
import { RESET_STATE } from '@/store/constants';

const mutations: MutationTree<CalendarState> = {
  [RESET_STATE]: (state) => {
    state[CALENDAR_EVENTS_CACHE] = initialState()[CALENDAR_EVENTS_CACHE];
  },
  [SET_CALENDAR_EVENTS_CACHE]: (state, payload: StateCache<GetCalendarEventsRes>) => {
    state[CALENDAR_EVENTS_CACHE] = payload;
  },

  [SET_UPCOMING_EVENTS]: (state: CalendarState, payload?: GetUpcomingEventsRes) => {
    if (!payload?.page.index) {
      state[UPCOMING_EVENTS] = payload || initialState()[UPCOMING_EVENTS];
    } else {
      const { data, ...rest } = payload;

      state[UPCOMING_EVENTS] = { ...(state[UPCOMING_EVENTS] || {}), ...rest, data: [...(state[UPCOMING_EVENTS]?.data || []), ...data] };
    }
  },
};

export default mutations;
