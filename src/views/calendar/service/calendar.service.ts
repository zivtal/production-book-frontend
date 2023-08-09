import type { GetCalendarEventsReq, GetCalendarEventsRes, GetUpcomingEventsRes, GetUpcomingEventsReq } from '@/views/calendar/models';
import ApiService from '@/shared/services/api-service/api.service';
import { inject, injectable } from 'tsyringe';
import { GET_CALENDAR_EVENTS, GET_UPCOMING_EVENTS } from '@/views/calendar/store/constants';

@injectable()
export default class CalendarService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private baseUrl = '/job';

  public [GET_CALENDAR_EVENTS](payload: GetCalendarEventsReq): Promise<GetCalendarEventsRes> {
    return this.apiService.post<GetCalendarEventsRes>(`${this.baseUrl}/${GET_CALENDAR_EVENTS}`, payload);
  }

  public [GET_UPCOMING_EVENTS](payload?: GetUpcomingEventsReq): Promise<GetUpcomingEventsRes> {
    return this.apiService.post<GetUpcomingEventsRes>(`${this.baseUrl}/${GET_UPCOMING_EVENTS}`, payload);
  }
}
