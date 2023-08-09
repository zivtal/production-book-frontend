import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { StateCache } from '@/store/services/store.cache';
import type { CalendarState } from '@/views/calendar/store/types';
import type { GetUpcomingEventsRes, GetCalendarEventsRes } from '@/views/calendar/models';
import { CALENDAR_EVENTS_CACHE, UPCOMING_EVENTS } from '@/views/calendar/store/constants';

const getters: GetterTree<CalendarState, RootState> = {
  [UPCOMING_EVENTS](state): GetUpcomingEventsRes | null {
    return state[UPCOMING_EVENTS];
  },
  [CALENDAR_EVENTS_CACHE](state): StateCache<GetCalendarEventsRes> {
    return state[CALENDAR_EVENTS_CACHE] || ({} as StateCache<GetCalendarEventsRes>);
  },
};

export default getters;
