import type AugmentedActionContext from '@/store/types/augmented-action-context';

type StoreContext = AugmentedActionContext<LobbyState, LobbyMutations, LobbyActions>;

// store
export type LobbyState = {};

export interface LobbyActions {}

export interface LobbyMutations<S = LobbyState> {}

export type LobbyGetters<S = LobbyState> = {};
