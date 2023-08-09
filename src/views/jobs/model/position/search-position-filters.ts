import { GetJobDetailsRes } from '@/views/jobs/model/job';

export interface SearchPositionFilters {
  positions: Array<string>;
  maxDistance?: number;
  dateFrom?: GetJobDetailsRes['dateFrom'];
  dateTo?: GetJobDetailsRes['dateTo'];
}
