import type { ActionTree } from 'vuex';
import type { AuthState } from '@/store/auth/types';
import type { AuthUnsecuredSignIn } from '@/store/auth/models/auth-sign-in-req';
import type { AuthUnsecuredSignUp } from '@/store/auth/models/auth-sign-up-req';
import type { AuthForgotPasswordReq } from '@/store/auth/models/auth-forgot-password-req';
import type { AuthRecoverPasswordReq } from '@/store/auth/models/auth-recover-password-req';
import {
  SIGN_IN,
  SET_USER,
  AUTH_CHECK,
  SET_AUTH_ACTIONS,
  SIGN_OUT,
  AUTH_ACTIONS,
  USER,
  SIGN_UP,
  FORGOT_PASSWORD,
  CHANGE_PASSWORD,
  EMAIL_VALIDATE,
  VERIFICATION_EXPIRED_AT,
  SET_VERIFICATION_EXPIRED_AT,
  IMPERSONATE_TO,
  SET_ACTIVE_USER,
  ACTIVE_USER,
} from '@/store/auth/constants';
import CryptService from '@/shared/services/crypt.service';
import { container } from 'tsyringe';
import AuthService from '@/store/auth/service/auth.service';
import { type RootState } from '@/store';
import { RESET_STATE, SET_COORDINATES, SET_LANGUAGE } from '@/store/constants';
import { AuthEmailValidation } from '@/store/auth/models/auth-email-validation';
import LocalStorageService from '@/shared/services/local-storage.service';
import { useRoot } from '@/store/helpers/use-root';
const root = useRoot();

const authService = container.resolve(AuthService);

const actions: ActionTree<AuthState, RootState> = {
  [AUTH_CHECK]: async ({ commit, state }): Promise<void> => {
    if (state[AUTH_ACTIONS] && state[USER]) {
      return;
    }

    const { user, impersonate, actions: authActions, language } = await authService[AUTH_CHECK]();
    const key = (impersonate || user)?._id.slice(-5);

    commit(SET_AUTH_ACTIONS, authActions || []);
    commit(SET_USER, user || null);
    commit(SET_ACTIVE_USER, impersonate || null);
    LocalStorageService.save('_key', key);
    LocalStorageService.save('_auth', authActions, key);
    LocalStorageService.save('user', impersonate || user, key);
    root[SET_LANGUAGE](language);
    root[SET_COORDINATES](user?.location?.coordinates);
  },

  [IMPERSONATE_TO]: async ({ commit, dispatch, state }, userId?: string): Promise<void> => {
    const user = await authService[IMPERSONATE_TO](!state[ACTIVE_USER] || state[ACTIVE_USER]?._id !== userId ? userId : undefined);
    commit(SET_ACTIVE_USER, user);
    root[RESET_STATE]();

    const { actions: authActions } = await authService[AUTH_CHECK]();
    commit(SET_AUTH_ACTIONS, authActions || []);
  },

  [SIGN_UP]: async ({ dispatch }, payload: AuthUnsecuredSignUp): Promise<void> => {
    const { email, password, ...restForm } = payload;

    await authService[SIGN_UP]({ hash: CryptService.encrypt(password, email), email, ...restForm });
    await dispatch(AUTH_CHECK);
  },

  [SIGN_IN]: async ({ dispatch }, payload: AuthUnsecuredSignIn): Promise<void> => {
    const { password, email } = payload;

    await authService[SIGN_IN]({ hash: CryptService.encrypt(password, email), email });
    await dispatch(AUTH_CHECK);
  },

  [SIGN_OUT]: async ({ dispatch, commit }): Promise<void> => {
    await authService[SIGN_OUT]();
    commit(SET_USER);
    commit(SET_ACTIVE_USER);
    await dispatch(AUTH_CHECK);
  },

  [FORGOT_PASSWORD]: async (_, payload: AuthForgotPasswordReq): Promise<number> => {
    const { enableIn } = await authService[FORGOT_PASSWORD](payload);

    return enableIn;
  },

  [CHANGE_PASSWORD]: async ({ dispatch }, payload: AuthRecoverPasswordReq): Promise<void> => {
    const { password, email, code } = payload;

    await authService[CHANGE_PASSWORD]({ hash: CryptService.encrypt(password, email), email, code: +code });
    await dispatch(SIGN_IN, { email, password });
  },

  [EMAIL_VALIDATE]: async ({ state, commit }, { forceCall, ...content }: AuthEmailValidation & { forceCall?: boolean }): Promise<number | void> => {
    if (forceCall || !state[VERIFICATION_EXPIRED_AT] || state[VERIFICATION_EXPIRED_AT] < Date.now()) {
      const { expiredAt, enableIn } = await authService[EMAIL_VALIDATE](content);
      commit(SET_VERIFICATION_EXPIRED_AT, expiredAt);

      return enableIn;
    }
  },
};

export default actions;
