import JobRoutesMap from '@/views/jobs/constants/job-routes-map';
import { RouteItem } from '@/router/models/route-item';
import CalendarRoutesMap from '@/views/calendar/constants/calendar-routes-map';

const topNavbarItems: Array<RouteItem> = [
  {
    label: 'MENU.JOB-MANAGER',
    name: JobRoutesMap.JOB_MANAGER,
    icon: 'svg:work',
  },
  {
    label: 'MENU.JOB-OFFER',
    name: JobRoutesMap.JOB_OFFER,
    icon: 'svg:job-offer',
  },
  {
    label: 'MENU.CALENDAR',
    name: CalendarRoutesMap.CALENDAR,
    icon: 'svg:calendar',
  },
];

export default topNavbarItems;
