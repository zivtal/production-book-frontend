import type { DbResponse, UserLocation } from '@/models';
import type { ConversationStatus } from '@/views/jobs/model/conversation';
import type { BaseDate } from '@/shared/models';
import type { ProfileBaseDetails } from '@/views/employee/models';
import type { Position } from '@/views/jobs/model/position';

export type CalendarEventType = 'job-offer' | 'job-manager' | 'other';
type RouteName = 'job-offer' | 'job-manager';

export interface CalendarEvent extends DbResponse {
  dateFrom: BaseDate;
  dateTo: BaseDate;
  title: string;
  jobType: string;
  status?: ConversationStatus['type'];
  location?: UserLocation;
  type: CalendarEventType;
  routeName?: RouteName;
  jobOwner?: ProfileBaseDetails;
  positions?: Array<Position & { participants: Array<ProfileBaseDetails> }>;
}

export interface GetCalendarEventsRes extends GetCalendarEventsReq {
  events: Array<CalendarEvent>;
}

export interface GetCalendarEventsReq {
  year: number;
  month: number;
}
