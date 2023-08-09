import type { IconName } from '@shared/components/icon/icon.type';
import type { RouteItem } from '@/router/models/route-item';
import JobRoutesMap from '@/views/jobs/constants/job-routes-map';
import NotificationRoutesMap from '@/views/notifications/constants/notification-routes-map';
import MessengerRoutesMap from '@/views/messenger/constants/messenger-routes-map';
import CalendarRoutesMap from '@/views/calendar/constants/calendar-routes-map';
import RoutesMap from '@/router/constants/routes-map';

const center: Array<Omit<RouteItem, 'icon'> & { icon: IconName }> = [
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

const side: Array<RouteItem> = [
  {
    label: 'MENU.MESSENGER',
    name: MessengerRoutesMap.MESSENGER,
    icon: 'svg:messenger',
  },
  {
    label: 'MENU.NOTIFICATIONS',
    name: NotificationRoutesMap.NOTIFICATIONS_LIST,
    icon: 'svg:notification',
  },
  {
    label: 'MENU.SEARCH',
    name: RoutesMap.EMPLOYEE_SEARCH,
    icon: 'svg:find-user',
  },
];

export const topItems = { center, side };
