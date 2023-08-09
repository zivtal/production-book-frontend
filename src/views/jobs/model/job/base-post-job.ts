import type { UserLocation } from '@/models';
import type { BaseDate } from '@/shared/models';

export interface BasePostJob {
  title: string;
  jobType: string;
  description?: string;
  dateFrom: BaseDate;
  dateTo: BaseDate;
  location: UserLocation;
  maxDistance?: number;
}
