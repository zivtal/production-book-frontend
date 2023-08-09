import type { AxiosRequestInterceptor, AxiosResponseInterceptor } from '@/shared/services/api-service/models';
import axios, { type AxiosError, type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';
import ServerError from '@/shared/services/api-service/server-error';
import { axiosGlobalConfig } from '@/shared/services/api-service/axios-config';

let abortController = new AbortController();
let signal = abortController.signal;

export default class ApiService {
  private static async makeRequest<T>(request: () => Promise<AxiosResponse>): Promise<T> {
    try {
      const { data } = await request();

      return data;
    } catch (e: any) {
      throw new ServerError(e);
    }
  }

  public constructor(config: AxiosRequestConfig = axiosGlobalConfig) {
    this.axiosInstance = axios.create({ ...config, signal });
  }

  private readonly axiosInstance: AxiosInstance;

  public async get<Response>(url: string, config?: AxiosRequestConfig): Promise<Response> {
    return await ApiService.makeRequest<Response>(() => this.axiosInstance.get<Response>(url, config));
  }

  public async put<Response, Payload = any>(url: string, data: Payload, config?: AxiosRequestConfig): Promise<Response> {
    return await ApiService.makeRequest<Response>(() => this.axiosInstance.put<Response>(url, data, config));
  }

  public async post<Response, Payload = any>(url: string, data?: Payload, config?: AxiosRequestConfig): Promise<Response> {
    return await ApiService.makeRequest<Response>(() => this.axiosInstance.post<Response>(url, data, config));
  }

  public async patch<Response, Payload = any>(url: string, data: Payload, config?: AxiosRequestConfig): Promise<Response> {
    return await ApiService.makeRequest<Response>(() => this.axiosInstance.patch<Response>(url, data, config));
  }

  public async delete<Response>(url: string, config?: AxiosRequestConfig): Promise<Response> {
    return await ApiService.makeRequest<Response>(() => this.axiosInstance.delete<Response>(url, config));
  }

  public cancel(): void {
    abortController.abort();
    abortController = new AbortController();
    signal = abortController.signal;
    this.axiosInstance.defaults.signal = signal;
  }

  public addRequestInterceptor(interceptor: AxiosRequestInterceptor | Array<AxiosRequestInterceptor>): void {
    (Array.isArray(interceptor) ? interceptor : [interceptor]).forEach((apiInterceptor) =>
      this.axiosInstance.interceptors.request.use(
        (value: AxiosRequestConfig) => apiInterceptor.onFulfilled(value),
        (error: AxiosError) => apiInterceptor.onRejected(error)
      )
    );
  }

  public addResponseInterceptor(interceptor: AxiosResponseInterceptor | Array<AxiosResponseInterceptor>): void {
    (Array.isArray(interceptor) ? interceptor : [interceptor]).forEach((apiInterceptor) =>
      this.axiosInstance.interceptors.response.use(
        (value: AxiosResponse) => apiInterceptor.onFulfilled(value),
        (error: AxiosError) => apiInterceptor.onRejected(error)
      )
    );
  }
}
