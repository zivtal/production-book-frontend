import { StoreNamespace } from '@/store/store-namespace';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { LobbyActions, LobbyGetters, LobbyMutations, LobbyState } from '@/views/lobby/store/types';

const useLobbyStore = () => createNamespacedHelpers<LobbyState, LobbyGetters, LobbyActions, LobbyMutations>(StoreNamespace.LOBBY_MODULE);

export default useLobbyStore;
