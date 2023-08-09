import store from '@/store';
import { StoreNamespace } from '@/store/store-namespace';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import calendarStore from '@/views/calendar/store';
import { CalendarActions, CalendarGetters, CalendarMutations, CalendarState } from '@/views/calendar/store/types';

const useCalendarStore = () => {
  if (!store.hasModule(StoreNamespace.CALENDAR_MODULE)) {
    store.registerModule(StoreNamespace.CALENDAR_MODULE, calendarStore);
  }

  return createNamespacedHelpers<CalendarState, CalendarGetters, CalendarActions, CalendarMutations>(StoreNamespace.CALENDAR_MODULE);
};

export default useCalendarStore;
