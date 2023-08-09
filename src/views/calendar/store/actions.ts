import type { ActionTree } from 'vuex';
import type { RootState } from '@/store';
import type { GetUpcomingEventsRes, GetUpcomingEventsReq, GetCalendarEventsReq, GetCalendarEventsRes } from '@/views/calendar/models';
import type { CalendarState } from '@/views/calendar/store/types';
import { container } from 'tsyringe';
import StoreCache from '@/store/services/store.cache';
import { StoreNamespace } from '@/store/store-namespace';
import CalendarService from '@/views/calendar/service/calendar.service';
import {
  CALENDAR_EVENTS_CACHE,
  GET_CALENDAR_EVENTS,
  GET_UPCOMING_EVENTS,
  SET_CALENDAR_EVENTS_CACHE,
  SET_UPCOMING_EVENTS,
} from '@/views/calendar/store/constants';

const calendarService = container.resolve(CalendarService);

const actions: ActionTree<CalendarState, RootState> = {
  [GET_UPCOMING_EVENTS]: async ({ commit }, payload?: GetUpcomingEventsReq): Promise<GetUpcomingEventsRes> => {
    const res = await calendarService[GET_UPCOMING_EVENTS](payload);
    commit(SET_UPCOMING_EVENTS, res);

    return res;
  },
  [GET_CALENDAR_EVENTS]: async (_, payload?: GetCalendarEventsReq): Promise<GetCalendarEventsRes> => {
    const { year = new Date().getFullYear(), month = new Date().getMonth() + 1 } = payload || {};
    const getCalendarEventsPayload = { year: +year, month: +month };

    const cacheService = new StoreCache(CALENDAR_EVENTS_CACHE, SET_CALENDAR_EVENTS_CACHE, StoreNamespace.CALENDAR_MODULE);
    const cache = cacheService.get<GetCalendarEventsReq, GetCalendarEventsRes>(getCalendarEventsPayload);

    if (cache) {
      return cache;
    }

    const res = await calendarService[GET_CALENDAR_EVENTS](getCalendarEventsPayload);
    cacheService.set<GetCalendarEventsReq, GetCalendarEventsRes>(getCalendarEventsPayload, res, { expiredIn: 3 * 60 * 1000 });

    return res;
  },
};

export default actions;
