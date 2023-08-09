import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { AuthState } from '@/store/auth/types';
import type { ActiveUser, AuthUser } from '@/store/auth/models/auth-user';
import {
  AUTH_ACTIONS,
  GET_AUTH_ACTIONS,
  GET_AUTH_KEY,
  GET_USER,
  ACTIVE_USER,
  IS_IMPERSONATED_MODE,
  IS_LOGGED_IN,
  USER,
  GET_CURRENCY,
} from '@/store/auth/constants';
import LocalStorageService from '@/shared/services/local-storage.service';

const getters: GetterTree<AuthState, RootState> = {
  [GET_AUTH_ACTIONS](state): Array<string> {
    const key = LocalStorageService.load<string>('_key');

    return state[AUTH_ACTIONS] || LocalStorageService.load<Array<string>>('_auth', key) || [];
  },

  [IS_LOGGED_IN](state): boolean {
    return !!(state[ACTIVE_USER] || state[USER]) || !!LocalStorageService.load<string>('_key');
  },

  [GET_USER](state): ActiveUser | null {
    if (state[ACTIVE_USER]) {
      return { ...state[ACTIVE_USER], impersonate: true };
    }

    const key = LocalStorageService.load<string>('_key');

    return state[USER] || LocalStorageService.load<AuthUser>('user', key) || null;
  },

  [IS_IMPERSONATED_MODE](state): boolean {
    return !!state[ACTIVE_USER];
  },

  [GET_AUTH_KEY](state): string | void {
    return (state[ACTIVE_USER] || state[USER])?._id.slice(-5) || LocalStorageService.load<string>('_key');
  },

  [GET_CURRENCY](state): string {
    return (state[ACTIVE_USER] || state[USER])?.wage?.currencyType || '';
  },
};

export default getters;
