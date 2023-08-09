import type { BaseDate } from '@/shared/models';

export interface Resume {
  workplace: string;
  position: string;
  dateFrom: BaseDate;
  dateTo: BaseDate;
  description?: string;
}
