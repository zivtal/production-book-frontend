import type { BaseDate } from '@/shared/models';

export interface ExchangeRate {
  from: string;
  to: string;
  updatedAt: BaseDate;
  rate: number;
}

export interface GetExchangeRatesRes {
  exchangeRates: Array<ExchangeRate>;
  createdAt: BaseDate;
}
