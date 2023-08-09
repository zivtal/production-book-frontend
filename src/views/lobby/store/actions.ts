import type { ActionTree } from 'vuex';
import type { RootState } from '@/store';
import type { LobbyState } from '@/views/lobby/store/types';
import { container } from 'tsyringe';
import LobbyService from '@/views/lobby/service/lobby.service';

const lobbyService = container.resolve(LobbyService);

const actions: ActionTree<LobbyState, RootState> = {};

export default actions;
