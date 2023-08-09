import { BasePagination } from '@/shared/models';

export interface GetNotificationReq {
  page?: BasePagination;
}

export interface SaveTokenReq {
  token: string;
}
