import type { UserLocation } from '@/models';
import type { Position } from '@/views/jobs/model/position';
import type { BaseDate, BaseId } from '@/shared/models';

export interface UpdatePostJobReq {
  _id: BaseId;
  positions: Array<Position & { _id?: BaseId }>;
  deleted?: Array<string>;
  title?: string;
  jobType?: string;
  description?: string;
  dateFrom: BaseDate;
  dateTo: BaseDate;
  location: UserLocation | null;
  maxDistance?: number;
}
