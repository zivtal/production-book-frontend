import { BasePagination } from '@/shared/models';

export interface BaseRecords<T> {
  data: Array<T>;
  page: BasePagination;
  total: number;
}
