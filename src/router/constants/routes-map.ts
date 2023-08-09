export default class RoutesMap {
  public static readonly HOME: string = 'home';
  public static readonly EMPLOYEE_SEARCH: string = 'search';
  public static readonly JOBS: string = 'job';
  public static readonly CALENDAR: string = 'calendar';
  public static readonly NOTIFICATIONS: string = 'notifications';

  public static readonly PATHS: Record<string, string> = {
    [RoutesMap.HOME]: '/',
    [RoutesMap.EMPLOYEE_SEARCH]: '/search',
    [RoutesMap.JOBS]: '/job',
    [RoutesMap.CALENDAR]: '/calendar',
    [RoutesMap.NOTIFICATIONS]: '/notifications',
  };
}

export const DEFAULT_PAGE_TITLE = 'Production Book';
