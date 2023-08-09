import 'reflect-metadata';
import { container } from 'tsyringe';
import ApiService from '@/shared/services/api-service/api.service';
import { axiosGlobalConfig } from '@/shared/services/api-service/axios-config';

container.registerInstance<ApiService>('ApiService', new ApiService(axiosGlobalConfig));
container.register<ApiService>('ClearApiService', { useFactory: () => new ApiService(axiosGlobalConfig) });
