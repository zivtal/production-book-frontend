import type { BasePagination } from '@/shared/models';
import type { ProfileFullDetails, Album, GetAlbumsRes, GetReviewsRes } from '@/views/employee/models';
import actions from './actions';
import mutations from './mutations';
import getters from './getters';
import {
  EMPLOYEE_ALBUM,
  EMPLOYEE_ALBUM_CACHE,
  EMPLOYEE_ALBUMS,
  EMPLOYEE_DETAILS,
  EMPLOYEE_DETAILS_CACHE,
  EMPLOYEE_REVIEWS,
  EMPLOYEES,
  EMPLOYEES_PAGINATION,
  EMPLOYEES_TOTAL,
  SELECTED_ASSET,
} from '@/views/employee/store/constants';
import type { Module } from 'vuex';
import type { RootState } from '@/store';
import type { EmployeeState } from '@/views/employee/store/types';
import type { StateCache } from '@/store/services/store.cache';

export const initialState = (): EmployeeState => ({
  [EMPLOYEES]: [],
  [EMPLOYEES_PAGINATION]: {} as BasePagination,
  [EMPLOYEES_TOTAL]: null,
  [EMPLOYEE_DETAILS]: null,
  [EMPLOYEE_DETAILS_CACHE]: {} as StateCache<ProfileFullDetails>,
  [EMPLOYEE_ALBUM]: null,
  [EMPLOYEE_ALBUM_CACHE]: {} as StateCache<Album>,
  [EMPLOYEE_ALBUMS]: {} as GetAlbumsRes,
  [EMPLOYEE_REVIEWS]: {} as GetReviewsRes,
  [SELECTED_ASSET]: null,
});

const employeeStore: Module<EmployeeState, RootState> = {
  namespaced: true,
  state: initialState(),
  mutations,
  actions,
  getters,
};

export default employeeStore;
