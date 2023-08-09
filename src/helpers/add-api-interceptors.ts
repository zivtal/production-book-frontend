import { container } from 'tsyringe';
import ApiService from '@/shared/services/api-service/api.service';
import { addLanguageInterceptor } from '@/shared/services/api-service/interceptors/add-language-interceptor';
import { removeReturnCodeInterceptor } from '@/shared/services/api-service/interceptors/remove-return-code-interceptor';
import { addUserDetailsInterceptor } from '@/shared/services/api-service/interceptors/add-user-details-interceptor';
import { addDeveloperInterceptor } from '@/shared/services/api-service/interceptors/add-developer-interceptor';

const apiService = container.resolve<ApiService>('ApiService');

// Request interceptors
apiService.addRequestInterceptor([addDeveloperInterceptor, addLanguageInterceptor, addUserDetailsInterceptor]);

// Response interceptors
apiService.addResponseInterceptor(removeReturnCodeInterceptor);
