import type { BaseId, BasePagination } from '@/shared/models';

export interface GetReviewsReq {
  userId: BaseId;
  page?: BasePagination;
}
