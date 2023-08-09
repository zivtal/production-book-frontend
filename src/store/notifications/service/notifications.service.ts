import type { GetNotificationRes } from '../models/notification-res';
import { inject, injectable } from 'tsyringe';
import {GET_NOTIFICATIONS, SAVE_TOKEN} from '@/store/notifications/constants';
import ApiService from '@/shared/services/api-service/api.service';
import {GetNotificationReq, SaveTokenReq} from '@/store/notifications/models/get-notifications-req';

@injectable()
export default class NotificationService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private baseUrl = '/notification';

  public async [GET_NOTIFICATIONS](params: GetNotificationReq): Promise<GetNotificationRes> {
    return this.apiService.post<GetNotificationRes>(`${this.baseUrl}/${GET_NOTIFICATIONS}`, params);
  }

  public async [SAVE_TOKEN](params: SaveTokenReq): Promise<void> {
    return this.apiService.post<void>(`${this.baseUrl}/${SAVE_TOKEN}`, params);
  }
}
