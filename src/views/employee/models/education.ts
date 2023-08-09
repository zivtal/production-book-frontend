import type { DbResponse } from '@/models';
import type { BaseDate } from '@/shared/models';

export interface Education extends DbResponse {
  degree: string | number;
  school: string;
  fieldOfStudy: string;
  dateFrom: BaseDate;
  dateTo: BaseDate;
}
