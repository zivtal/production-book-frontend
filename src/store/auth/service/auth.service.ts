import type { AuthUser } from '@/store/auth/models/auth-user';
import type { AuthSecuredSignInReq } from '@/store/auth/models/auth-sign-in-req';
import type { AuthSecuredSignUpReq } from '@/store/auth/models/auth-sign-up-req';
import type { AuthCheckRes } from '@/store/auth/models/auth-check-res';
import type { BaseResponse } from '@/shared/models';
import type { AuthForgotPasswordReq } from '@/store/auth/models/auth-forgot-password-req';
import type { AuthSecuredRecoverPasswordReq } from '@/store/auth/models/auth-recover-password-req';
import { inject, injectable } from 'tsyringe';
import { AUTH_CHECK, CHANGE_PASSWORD, EMAIL_VALIDATE, FORGOT_PASSWORD, IMPERSONATE_TO, SIGN_IN, SIGN_OUT, SIGN_UP } from '@/store/auth/constants';
import ApiService from '@/shared/services/api-service/api.service';
import { AuthEmailValidation } from '@/store/auth/models/auth-email-validation';

@injectable()
export default class AuthService {
  public constructor(@inject('ApiService') private apiService: ApiService) {}

  private baseUrl = '/auth';

  public async [AUTH_CHECK](): Promise<AuthCheckRes> {
    return this.apiService.get<AuthCheckRes>(`${this.baseUrl}/${AUTH_CHECK}`);
  }

  public async [IMPERSONATE_TO](userId?: string): Promise<Partial<AuthUser> & BaseResponse> {
    return this.apiService.post<Partial<AuthUser> & BaseResponse>(`${this.baseUrl}/${IMPERSONATE_TO}/` + (userId || ''));
  }
  public async [SIGN_IN](payload: AuthSecuredSignInReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${SIGN_IN}`, payload);
  }

  public async [SIGN_UP](payload: AuthSecuredSignUpReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${SIGN_UP}`, payload);
  }

  public async [SIGN_OUT](): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${SIGN_OUT}`);
  }

  public async [FORGOT_PASSWORD](payload: AuthForgotPasswordReq): Promise<BaseResponse & { expiredAt: number; enableIn: number }> {
    return this.apiService.post<BaseResponse & { expiredAt: number; enableIn: number }>(`${this.baseUrl}/${FORGOT_PASSWORD}`, payload);
  }

  public async [CHANGE_PASSWORD](payload: AuthSecuredRecoverPasswordReq): Promise<BaseResponse> {
    return this.apiService.post<BaseResponse>(`${this.baseUrl}/${CHANGE_PASSWORD}`, payload);
  }

  public async [EMAIL_VALIDATE](payload: AuthEmailValidation): Promise<BaseResponse & { expiredAt: number; enableIn: number }> {
    return this.apiService.post<BaseResponse & { expiredAt: number; enableIn: number }>(`${this.baseUrl}/${EMAIL_VALIDATE}`, payload);
  }
}
