import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { LobbyState } from '@/views/lobby/store/types';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';

export const initialState = (): LobbyState => ({});

const lobbyStore: Module<LobbyState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default lobbyStore;
