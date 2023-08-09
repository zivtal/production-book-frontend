import ApiService from '@/shared/services/api-service/api.service';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class NotificationService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}
}
