import type { BasePagination } from '@/shared/models';

export interface ListChatsReq {
  page: BasePagination;
  search?: string;
}
