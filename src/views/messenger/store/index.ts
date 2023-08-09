import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { MessengerState } from '@/views/messenger/store/types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import { ACTIVE_CHAT } from '@/views/messenger/store/constants';

export const initialState = (): MessengerState => ({
  [ACTIVE_CHAT]: null,
});

const messengerStore: Module<MessengerState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default messengerStore;
