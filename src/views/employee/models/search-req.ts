import type { UserLocation } from '@/models';
import type { BasePagination } from '@/shared/models';

export interface SearchReq {
  search?: string;
  page?: BasePagination;
  skills?: Array<string>;
  specialization?: Array<string>;
  coordinates?: UserLocation['coordinates'];
}
