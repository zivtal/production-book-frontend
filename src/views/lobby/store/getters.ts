import { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { LobbyState } from '@/views/lobby/store/types';

const getters: GetterTree<LobbyState, RootState> = {};

export default getters;
