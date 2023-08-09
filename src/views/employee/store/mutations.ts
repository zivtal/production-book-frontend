import type { EmployeeState } from '@/views/employee/store/types';
import type { BaseRecords } from '@/shared/models';
import type { ProfileFullDetails, Album, ProfileExtendDetails, GetAlbumsRes, GetReviewsRes } from '@/views/employee/models';
import { MutationTree } from 'vuex';
import {
  EMPLOYEES,
  SET_EMPLOYEES,
  SET_EMPLOYEE_DETAILS,
  EMPLOYEE_DETAILS,
  SET_EMPLOYEE_ALBUMS,
  EMPLOYEE_ALBUMS,
  EMPLOYEE_REVIEWS,
  SET_EMPLOYEE_REVIEWS,
  SET_SELECTED_ASSET,
  SELECTED_ASSET,
  UPDATE_EMPLOYEE_DETAILS,
  EMPLOYEES_PAGINATION,
  EMPLOYEES_TOTAL,
  SET_EMPLOYEE_ALBUM,
  EMPLOYEE_ALBUM,
  SET_EMPLOYEE_ALBUM_CACHE,
  EMPLOYEE_ALBUM_CACHE,
  SET_EMPLOYEE_DETAILS_CACHE,
  EMPLOYEE_DETAILS_CACHE,
  CLEAR_EMPLOYEE_STATE,
} from '@/views/employee/store/constants';
import { initialState } from '@/views/employee/store/index';
import store from '@/store';
import { UPDATE_USER } from '@/store/auth/constants';
import { StoreNamespace } from '@/store/store-namespace';
import { type StateCache } from '@/store/services/store.cache';

const mutations: MutationTree<EmployeeState> = {
  [SET_EMPLOYEES]: (state: EmployeeState, payload?: BaseRecords<ProfileExtendDetails>) => {
    if (!payload?.page.index) {
      state[EMPLOYEES] = payload?.data || initialState()[EMPLOYEES];
    } else {
      state[EMPLOYEES] = [...state[EMPLOYEES], ...(payload?.data || [])];
    }

    state[EMPLOYEES_TOTAL] = payload?.total || initialState()[EMPLOYEES_TOTAL];
    state[EMPLOYEES_PAGINATION] = payload?.page || initialState()[EMPLOYEES_PAGINATION];
  },

  [SET_SELECTED_ASSET]: (state: EmployeeState, assetId?: string) => {
    state[SELECTED_ASSET] = assetId || null;
  },

  [SET_EMPLOYEE_DETAILS]: (state: EmployeeState, employee?: ProfileFullDetails) => {
    state[EMPLOYEE_DETAILS] = employee || initialState()[EMPLOYEE_DETAILS];

    if (!employee) {
      state[EMPLOYEE_ALBUM] = initialState()[EMPLOYEE_ALBUM];
      state[EMPLOYEE_REVIEWS] = initialState()[EMPLOYEE_REVIEWS];
    }
  },

  [SET_EMPLOYEE_DETAILS_CACHE]: (state: EmployeeState, bulk: StateCache<ProfileFullDetails>) => {
    state[EMPLOYEE_DETAILS_CACHE] = bulk;
  },

  [UPDATE_EMPLOYEE_DETAILS]: (state: EmployeeState, updated: Partial<ProfileFullDetails>) => {
    state[EMPLOYEE_DETAILS] = { ...state[EMPLOYEE_DETAILS]!, ...updated };
    state[EMPLOYEES] = (state[EMPLOYEES] || []).map((employee) =>
      employee._id === state[EMPLOYEE_DETAILS]?._id ? { ...employee, ...updated } : employee
    );

    store.commit(`${StoreNamespace.AUTH_MODULE}/${UPDATE_USER}`, updated);
  },

  [SET_EMPLOYEE_ALBUMS]: (state: EmployeeState, albums: GetAlbumsRes) => {
    const { data = [] } = state[EMPLOYEE_ALBUMS];

    state[EMPLOYEE_ALBUMS] = !albums.page.index ? albums : { ...albums, data: [...data, ...albums.data] };
  },

  [SET_EMPLOYEE_REVIEWS]: (state: EmployeeState, reviews: GetReviewsRes) => {
    const { data = [] } = state[EMPLOYEE_REVIEWS];

    state[EMPLOYEE_REVIEWS] = !reviews.page.index ? reviews : { ...reviews, data: [...data, ...reviews.data] };
  },

  [CLEAR_EMPLOYEE_STATE]: (state: EmployeeState) => {
    state[EMPLOYEE_ALBUMS] = initialState()[EMPLOYEE_ALBUMS];
    state[EMPLOYEE_REVIEWS] = initialState()[EMPLOYEE_REVIEWS];
  },

  [SET_EMPLOYEE_ALBUM]: (state: EmployeeState, album?: Album) => {
    state[EMPLOYEE_ALBUM] = album || null;
  },

  [SET_EMPLOYEE_ALBUM_CACHE]: (state, payload: StateCache<Album>) => {
    state[EMPLOYEE_ALBUM_CACHE] = payload;
  },
};

export default mutations;
