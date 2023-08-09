import type AugmentedActionContext from '@/store/types/augmented-action-context';
import type { BaseRecords, BasePagination, BaseId } from '@/shared/models';
import type {
  SearchEmployeesRes,
  ProfileFullDetails,
  Album,
  GetReviewRes,
  AlbumAsset,
  UpdateProfileReq,
  GetAlbumsReq,
  GetReviewsReq,
  AddReviewReq,
  ProfileExtendDetails,
  AddAlbumReq,
  UploadAssetsReq,
  UpdateAlbumReq,
  EmployeeRemoveAssets,
  AddAssetReq,
  UpdateAssetReq,
  GetAlbumsRes,
  GetReviewsRes,
} from '@/views/employee/models';
import {
  ADD_ALBUM,
  ADD_ALBUM_ASSETS,
  ADD_REVIEW,
  CLEAR_EMPLOYEE_STATE,
  EMPLOYEE_ALBUM,
  EMPLOYEE_ALBUM_CACHE,
  EMPLOYEE_ALBUMS,
  EMPLOYEE_DETAILS,
  EMPLOYEE_DETAILS_CACHE,
  EMPLOYEE_REVIEWS,
  EMPLOYEES,
  EMPLOYEES_PAGINATION,
  EMPLOYEES_TOTAL,
  GET_ALBUM,
  GET_ALBUMS,
  GET_EMPLOYEE_DETAILS,
  GET_REVIEWS,
  GET_SELECTED_ALBUM,
  GET_SELECTED_ASSET,
  REMOVE_ALBUM,
  REMOVE_ALBUM_ASSETS,
  SEARCH_EMPLOYEES,
  SELECTED_ASSET,
  SET_EMPLOYEE_ALBUM,
  SET_EMPLOYEE_ALBUM_CACHE,
  SET_EMPLOYEE_ALBUMS,
  SET_EMPLOYEE_DETAILS,
  SET_EMPLOYEE_DETAILS_CACHE,
  SET_EMPLOYEE_REVIEWS,
  SET_EMPLOYEES,
  SET_SELECTED_ASSET,
  UPDATE_ALBUM,
  UPDATE_ASSET,
  UPDATE_EMPLOYEE_DETAILS,
  UPDATE_EMPLOYEE_PROFILE,
  UPLOAD_PHOTO,
} from '@/views/employee/store/constants';
import { StateCache } from '@/store/services/store.cache';

type StoreContext = AugmentedActionContext<EmployeeState, EmployeeMutations, EmployeeActions>;

// store
export type EmployeeState = {
  [EMPLOYEES]: Array<ProfileExtendDetails>;
  [EMPLOYEES_PAGINATION]: BasePagination;
  [EMPLOYEES_TOTAL]: number | null;
  [EMPLOYEE_DETAILS]: ProfileFullDetails | null;
  [EMPLOYEE_DETAILS_CACHE]: StateCache<ProfileFullDetails>;
  [EMPLOYEE_ALBUM]: Album | null;
  [EMPLOYEE_ALBUM_CACHE]: StateCache<Album>;
  [EMPLOYEE_ALBUMS]: GetAlbumsRes;
  [EMPLOYEE_REVIEWS]: GetReviewsRes;
  [SELECTED_ASSET]: string | null;
};

export interface EmployeeActions {
  [SEARCH_EMPLOYEES]({ state, commit }: StoreContext): Promise<SearchEmployeesRes>;
  [GET_EMPLOYEE_DETAILS]({ state, commit }: StoreContext, options?: { userId?: string; ignoreCache?: boolean }): Promise<void>;
  [GET_ALBUM]({ commit, state }: StoreContext, albumId?: BaseId): Promise<void>;
  [ADD_ALBUM]({ commit, dispatch }: StoreContext, payload: AddAlbumReq): Promise<void>;
  [UPLOAD_PHOTO]({ state }: StoreContext, payload: UploadAssetsReq): Promise<void>;
  [UPDATE_ALBUM]({ commit, state }: StoreContext, payload: UpdateAlbumReq): Promise<void>;
  [UPDATE_ASSET]({ commit, state }: StoreContext, payload: Omit<UpdateAssetReq, 'albumId'>): Promise<void>;
  [REMOVE_ALBUM]({ dispatch, commit, state }: StoreContext, albumId?: BaseId): Promise<void>;
  [REMOVE_ALBUM_ASSETS]({ dispatch, state }: StoreContext, payload: EmployeeRemoveAssets): Promise<void>;
  [ADD_ALBUM_ASSETS]({ dispatch, state }: StoreContext, { albumId, assets }: AddAssetReq): Promise<void>;
  [GET_ALBUMS]({ state, commit }: StoreContext, payload: GetAlbumsReq): Promise<BaseRecords<Album>>;
  [GET_REVIEWS]({ state, commit }: StoreContext, payload: GetReviewsReq): Promise<BaseRecords<GetReviewRes>>;
  [UPDATE_EMPLOYEE_PROFILE]({ state, commit }: StoreContext, payload: UpdateProfileReq): Promise<void>;
  [ADD_REVIEW]({ state, commit, dispatch }: StoreContext, payload: AddReviewReq): Promise<void>;
}

export interface EmployeeMutations<S = EmployeeState> {
  [SET_EMPLOYEES](state: S, payload?: SearchEmployeesRes): void;
  [SET_EMPLOYEE_DETAILS](state: S, payload?: ProfileFullDetails): void;
  [SET_EMPLOYEE_DETAILS_CACHE](state: S, payload: StateCache<ProfileFullDetails>): void;
  [UPDATE_EMPLOYEE_DETAILS](state: S, payload: Partial<ProfileFullDetails>): void;
  [SET_EMPLOYEE_ALBUMS](state: S, payload: GetAlbumsRes): void;
  [SET_EMPLOYEE_REVIEWS](state: S, payload: GetReviewsRes): void;
  [CLEAR_EMPLOYEE_STATE](state: S): void;
  [SET_SELECTED_ASSET](state: S, assetId?: string): void;
  [SET_EMPLOYEE_ALBUM](state: S, album?: Album): void;
  [SET_EMPLOYEE_ALBUM_CACHE](state: S, payload: StateCache<Album>): void;
}

export type EmployeeGetters<S = EmployeeState> = {
  [GET_SELECTED_ALBUM](state: S): Album | void;
  [GET_SELECTED_ASSET](state: S): AlbumAsset | void;
  [EMPLOYEE_DETAILS_CACHE](state: S): StateCache<ProfileFullDetails> | void;
  [EMPLOYEE_ALBUM_CACHE](state: S): StateCache<Album> | void;
};
