export default class NotificationRoutesMap {
  public static readonly NOTIFICATIONS_LIST: string = 'notifications';

  public static readonly PATHS: Record<string, string> = {
    [NotificationRoutesMap.NOTIFICATIONS_LIST]: '/notifications',
  };
}
