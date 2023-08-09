import type { ListCompaniesRes } from '@/views/employee/models';
import type { BaseOptionsResponse } from '@/shared/models';
import type { GetVideoDetailsRes, GetExchangeRatesRes, GetExchangeRateRes } from '@/store/client/models';
import type { UserLocation } from '@/models';
import { GET_EXCHANGE_RATE, GET_EXCHANGE_RATES, GET_VIDEO_DETAILS, LIST_ADDRESSES, LIST_COMPANIES } from '@/store/client/constants';
import ApiService from '@/shared/services/api-service/api.service';
import { inject, injectable } from 'tsyringe';

@injectable()
export default class GeneralServices {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private currencyUrl = '/currency';
  private locationUrl = '/location';
  private employeeUrl = '/employee';
  private mediaUrl = '/media';

  public async [GET_EXCHANGE_RATE](fromCurrency: string, amount: number, toCurrency?: string): Promise<GetExchangeRateRes> {
    return this.apiService.post<GetExchangeRateRes>(`${this.currencyUrl}/${GET_EXCHANGE_RATE}`, { fromCurrency, toCurrency, amount });
  }

  public async [GET_EXCHANGE_RATES](): Promise<GetExchangeRatesRes> {
    return this.apiService.get<GetExchangeRatesRes>(`${this.currencyUrl}/${GET_EXCHANGE_RATES}`);
  }

  public async [LIST_COMPANIES](query: string): Promise<ListCompaniesRes> {
    return this.apiService.get<ListCompaniesRes>(`${this.employeeUrl}/${LIST_COMPANIES}?search=${query}`);
  }

  public async [LIST_ADDRESSES](query: string): Promise<BaseOptionsResponse<UserLocation>> {
    return this.apiService.get<BaseOptionsResponse<UserLocation>>(`${this.locationUrl}/${LIST_ADDRESSES}?search=${query}`);
  }

  public async [GET_VIDEO_DETAILS](url: string): Promise<GetVideoDetailsRes> {
    return this.apiService.post<GetVideoDetailsRes>(`${this.mediaUrl}/${GET_VIDEO_DETAILS}`, { url });
  }
}
