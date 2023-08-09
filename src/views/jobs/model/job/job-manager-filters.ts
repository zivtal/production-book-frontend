import type { BasePagination } from '@/shared/models';

export interface JobManagerFilters {
  value?: string;
  dateFrom?: number;
  dateTo?: number;
  jobType?: Array<string>;
  page?: BasePagination;
}
