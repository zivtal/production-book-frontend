import type AugmentedActionContext from '@/store/types/augmented-action-context';
import type { AuthUser } from '@/store/auth/models/auth-user';
import type { AuthSignInReq } from '@/store/auth/models/auth-sign-in-req';
import type { AuthSignUpReq } from '@/store/auth/models/auth-sign-up-req';
import type { AuthForgotPasswordReq } from '@/store/auth/models/auth-forgot-password-req';
import type { AuthRecoverPasswordReq } from '@/store/auth/models/auth-recover-password-req';
import type { ProfileFullDetails } from '@/views/employee/models';
import {
  AUTH_ACTIONS,
  AUTH_CHECK,
  CHANGE_PASSWORD,
  EMAIL_VALIDATE,
  FORGOT_PASSWORD,
  GET_AUTH_ACTIONS,
  GET_AUTH_KEY,
  GET_USER,
  IMPERSONATE_TO,
  ACTIVE_USER,
  IS_IMPERSONATED_MODE,
  IS_LOGGED_IN,
  SET_AUTH_ACTIONS,
  SET_ACTIVE_USER,
  SET_USER,
  SET_VERIFICATION_EXPIRED_AT,
  SIGN_IN,
  SIGN_OUT,
  SIGN_UP,
  USER,
  VERIFICATION_EXPIRED_AT,
  UPDATE_USER,
} from '@/store/auth/constants';
import { AuthEmailValidation } from '@/store/auth/models/auth-email-validation';

type StoreContext = AugmentedActionContext<AuthState, AuthMutations, AuthActions>;

// store
export type AuthState = {
  [USER]: AuthUser | null;
  [ACTIVE_USER]: AuthUser | null;
  [AUTH_ACTIONS]: Array<string> | null;
  [VERIFICATION_EXPIRED_AT]: number | null;
};

export interface AuthActions {
  [SIGN_UP]({ dispatch }: StoreContext, payload: AuthSignUpReq): Promise<void>;
  [SIGN_IN]({ state, commit }: StoreContext, payload: AuthSignInReq): Promise<void>;
  [SIGN_OUT]({ state, commit }: StoreContext): Promise<void>;
  [AUTH_CHECK]({ state, commit }: StoreContext, forceRun?: boolean): Promise<void>;
  [FORGOT_PASSWORD](_: StoreContext, payload: AuthForgotPasswordReq): Promise<number>;
  [CHANGE_PASSWORD](_: StoreContext, payload: AuthRecoverPasswordReq): Promise<void>;
  [EMAIL_VALIDATE]({ state, commit }: StoreContext, payload: AuthEmailValidation & { forceCall?: boolean }): Promise<number | void>;
  [IMPERSONATE_TO]({ commit, state }: StoreContext, userId?: string): Promise<void>;
}

export interface AuthMutations<S = AuthState> {
  [SET_USER](state: S, payload?: AuthUser): void;
  [UPDATE_USER](state: S, update: Partial<ProfileFullDetails>): void;
  [SET_ACTIVE_USER](state: S, user?: AuthUser): void;
  [SET_AUTH_ACTIONS](state: S, payload?: Array<string>): void;
  [SET_VERIFICATION_EXPIRED_AT](state: S, expiredAt?: number): void;
}

export type AuthGetters<S = AuthState> = {
  [GET_USER](state: S): (AuthUser & { impersonate?: boolean }) | undefined;
  [GET_AUTH_ACTIONS](state: S): Array<string>;
  [GET_AUTH_KEY](state: S): string;
  [IS_LOGGED_IN](state: S): boolean;
  [IS_IMPERSONATED_MODE](state: S): boolean;
};
