export default class CalendarRoutesMap {
  public static readonly CALENDAR: string = 'calendar';
  public static readonly UPCOMING_EVENT: string = 'upcoming-events';

  public static readonly PATHS: Record<string, string> = {
    [CalendarRoutesMap.CALENDAR]: '/calendar',
    [CalendarRoutesMap.UPCOMING_EVENT]: '/calendar/upcoming',
  };
}
