import type { GetterTree } from 'vuex';
import type { RootState } from '@/store';
import type { EmployeeState } from '@/views/employee/store/types';
import type { Album, AlbumAsset, ProfileFullDetails } from '@/views/employee/models';
import {
  EMPLOYEE_ALBUM,
  EMPLOYEE_ALBUM_CACHE,
  EMPLOYEE_DETAILS_CACHE,
  GET_SELECTED_ALBUM,
  GET_SELECTED_ASSET,
  SELECTED_ASSET,
} from '@/views/employee/store/constants';
import { StateCache } from '@/store/services/store.cache';

const getters: GetterTree<EmployeeState, RootState> = {
  [GET_SELECTED_ALBUM](state): Album | null {
    return state[EMPLOYEE_ALBUM];
  },

  [GET_SELECTED_ASSET](state): AlbumAsset | null {
    return state[EMPLOYEE_ALBUM]?.assets.find(({ url }) => url === state[SELECTED_ASSET]) || null;
  },

  [EMPLOYEE_DETAILS_CACHE](state): StateCache<ProfileFullDetails> {
    return state[EMPLOYEE_DETAILS_CACHE] || ({} as StateCache<ProfileFullDetails>);
  },

  [EMPLOYEE_ALBUM_CACHE](state): StateCache<Album> {
    return state[EMPLOYEE_ALBUM_CACHE] || ({} as StateCache<Album>);
  },
};

export default getters;
