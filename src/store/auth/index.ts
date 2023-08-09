import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { AuthState } from '@/store/auth/types';
import { AUTH_ACTIONS, ACTIVE_USER, USER, VERIFICATION_EXPIRED_AT } from '@/store/auth/constants';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const initialState = (): AuthState => ({
  [USER]: null,
  [AUTH_ACTIONS]: null,
  [VERIFICATION_EXPIRED_AT]: null,
  [ACTIVE_USER]: null,
});

const authStore: Module<AuthState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default authStore;
