import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { MessengerState } from '@/views/messenger/store/types';

const getters: GetterTree<MessengerState, RootState> = {};

export default getters;
