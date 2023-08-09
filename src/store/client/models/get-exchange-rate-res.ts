import type { BaseDate } from '@/shared/models';

export interface GetExchangeRateRes {
  from: string;
  to: string;
  updatedAt: BaseDate;
  value: number;
}
