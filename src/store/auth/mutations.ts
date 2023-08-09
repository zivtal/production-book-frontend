import type { MutationTree } from 'vuex';
import type { AuthState } from '@/store/auth/types';
import type { AuthUser } from '@/store/auth/models/auth-user';
import type { ProfileFullDetails } from '@/views/employee/models';
import {
  AUTH_ACTIONS,
  ACTIVE_USER,
  SET_AUTH_ACTIONS,
  SET_ACTIVE_USER,
  SET_USER,
  SET_VERIFICATION_EXPIRED_AT,
  UPDATE_USER,
  USER,
  VERIFICATION_EXPIRED_AT,
} from '@/store/auth/constants';
import { initialState } from '@/store/auth/index';

const mutations: MutationTree<AuthState> = {
  [SET_USER]: (state, payload?: AuthUser): void => {
    state[USER] = payload || initialState()[USER];
  },

  [SET_ACTIVE_USER]: (state, user?: AuthUser): void => {
    state[ACTIVE_USER] = user && Object.entries(user).length ? user : initialState()[ACTIVE_USER];
  },

  [UPDATE_USER]: (state, update: Partial<ProfileFullDetails>): void => {
    const { skills, specialization, ...rest } = update;
    const inject: Partial<AuthUser> = {
      ...(skills ? { skills: skills?.map(({ value }) => value) } : {}),
      ...(specialization ? { specialization: specialization?.map(({ value }) => value) } : {}),
      ...rest,
    };

    if (state[ACTIVE_USER]) {
      state[ACTIVE_USER] = { ...state[ACTIVE_USER], ...inject };
    } else if (state[USER]) {
      state[USER] = { ...state[USER], ...inject };
    }
  },

  [SET_AUTH_ACTIONS]: (state, payload?: Array<string>): void => {
    state[AUTH_ACTIONS] = payload || initialState()[AUTH_ACTIONS];
  },

  [SET_VERIFICATION_EXPIRED_AT]: (state, expiredAt?: number): void => {
    state[VERIFICATION_EXPIRED_AT] = expiredAt || initialState()[VERIFICATION_EXPIRED_AT];
  },
};

export default mutations;
