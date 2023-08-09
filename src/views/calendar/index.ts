import CalendarRoutesMap from '@/views/calendar/constants/calendar-routes-map';
import type { RouteRecordRaw } from 'vue-router';

const Calendar = () => import(/* webpackChunkName: "calendar" */ '@/views/calendar/views/calendar/calendar.view.vue');
const UpcomingEvents = () => import(/* webpackChunkName: "upcoming-events" */ '@/views/calendar/views/upcoming-events/upcoming-events.view.vue');

const calendarRoutes: Readonly<Array<RouteRecordRaw>> = [
  {
    path: CalendarRoutesMap.PATHS[CalendarRoutesMap.CALENDAR],
    name: CalendarRoutesMap.CALENDAR,
    meta: {
      signed: true,
    },
    component: Calendar,
  },
  {
    path: CalendarRoutesMap.PATHS[CalendarRoutesMap.UPCOMING_EVENT],
    name: CalendarRoutesMap.UPCOMING_EVENT,
    meta: {
      signed: true,
    },
    component: UpcomingEvents,
  },
];

export default calendarRoutes;
