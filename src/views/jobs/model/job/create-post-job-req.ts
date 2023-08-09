import type { UserLocation } from '@/models';
import type { Position } from '@/views/jobs/model/position';
import type { BaseDate } from '@/shared/models';

export interface CreatePostJobReq {
  positions: Array<Position>;
  title: string;
  jobType?: string;
  description?: string;
  dateFrom: BaseDate;
  dateTo: BaseDate;
  location: UserLocation | null;
  maxDistance?: number;
}
