import { GetterTree } from 'vuex';
import { RootState } from '@/store/index';
import { COORDINATES, LANGUAGE, LOADING } from '@/store/constants';

export const getters: GetterTree<RootState, RootState> = {
  [LANGUAGE](state: RootState): string {
    return state[LANGUAGE];
  },

  [COORDINATES](state: RootState): [number, number] | undefined {
    return state[COORDINATES] || undefined;
  },

  [LOADING](state: RootState): Array<string> {
    return state[LOADING];
  },
};
