import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { StateCache } from '@/store/services/store.cache';
import type { CalendarState } from '@/views/calendar/store/types';
import type { GetCalendarEventsRes } from '@/views/calendar/models';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { UPCOMING_EVENTS, CALENDAR_EVENTS_CACHE } from '@/views/calendar/store/constants';

export const initialState = (): CalendarState => ({
  [CALENDAR_EVENTS_CACHE]: {} as StateCache<GetCalendarEventsRes>,
  [UPCOMING_EVENTS]: null,
});

const calendarStore: Module<CalendarState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default calendarStore;
