import type { ActionTree } from 'vuex';
import type { EmployeeState } from '@/views/employee/store/types';
import type {
  GetAlbumsReq,
  GetReviewsReq,
  UpdateProfileReq,
  AddReviewReq,
  AddAlbumReq,
  UploadAssetsReq,
  UpdateAlbumReq,
  Album,
  EmployeeRemoveAssets,
  SearchReq,
  AddAssetReq,
  SearchEmployeesRes,
  GetReviewRes,
  UpdateAssetReq,
  ProfileFullDetails,
} from '@/views/employee/models';
import type { BaseId, BaseRecords } from '@/shared/models';
import type { RootState } from '@/store';
import {
  ADD_ALBUM,
  ADD_ALBUM_ASSETS,
  ADD_REVIEW,
  CLEAR_EMPLOYEE_STATE,
  EMPLOYEE_ALBUM,
  EMPLOYEE_ALBUMS,
  EMPLOYEE_DETAILS,
  EMPLOYEE_DETAILS_CACHE,
  EMPLOYEE_REVIEWS,
  GET_ALBUM,
  GET_ALBUMS,
  GET_EMPLOYEE_DETAILS,
  GET_REVIEWS,
  REMOVE_ALBUM,
  REMOVE_ALBUM_ASSETS,
  SEARCH_EMPLOYEES,
  SET_EMPLOYEE_ALBUM,
  SET_EMPLOYEE_ALBUMS,
  SET_EMPLOYEE_DETAILS,
  SET_EMPLOYEE_DETAILS_CACHE,
  SET_EMPLOYEE_REVIEWS,
  SET_EMPLOYEES,
  UPDATE_ALBUM,
  UPDATE_ASSET,
  UPDATE_EMPLOYEE_DETAILS,
  UPDATE_EMPLOYEE_PROFILE,
  UPLOAD_PHOTO,
} from '@/views/employee/store/constants';
import { container } from 'tsyringe';
import EmployeeService from '@/views/employee/service/employee.service';
import { useRoot } from '@/store/helpers/use-root';
import { SET_LOADING } from '@/store/constants';
import StoreCache from '@/store/services/store.cache';
import { StoreNamespace } from '@/store/store-namespace';

const root = useRoot();
const employeeService = container.resolve(EmployeeService);

const actions: ActionTree<EmployeeState, RootState> = {
  [SEARCH_EMPLOYEES]: async ({ commit }, payload?: SearchReq): Promise<SearchEmployeesRes> => {
    const res = await employeeService[SEARCH_EMPLOYEES](payload);
    commit(SET_EMPLOYEES, res);

    return res;
  },

  [GET_EMPLOYEE_DETAILS]: async ({ commit, state }, options?: { userId?: string; ignoreCache?: boolean }): Promise<void> => {
    const id = options?.userId || state[EMPLOYEE_DETAILS]!._id;

    if (!id) {
      return;
    }

    commit(SET_EMPLOYEE_DETAILS);
    commit(CLEAR_EMPLOYEE_STATE);

    try {
      const cacheService = new StoreCache(EMPLOYEE_DETAILS_CACHE, SET_EMPLOYEE_DETAILS_CACHE, StoreNamespace.EMPLOYEES_MODULE);
      root[SET_LOADING](id);

      const res = await (async (): Promise<ProfileFullDetails> => {
        if (options?.ignoreCache) {
          return await employeeService[GET_EMPLOYEE_DETAILS](id);
        }

        return cacheService.get<string, ProfileFullDetails>(id) || (await employeeService[GET_EMPLOYEE_DETAILS](id));
      })();

      commit(SET_EMPLOYEE_DETAILS, res);
      cacheService.set<string, ProfileFullDetails>(id, res, { expiredIn: 3 * 60 * 1000 });
    } finally {
      root[SET_LOADING](id);
    }
  },

  [GET_ALBUMS]: async ({ commit, state }, payload: GetAlbumsReq): Promise<BaseRecords<Album>> => {
    const res = await employeeService[GET_ALBUMS](payload || { userId: state[EMPLOYEE_DETAILS]!._id });
    commit(SET_EMPLOYEE_ALBUMS, res);

    return res;
  },

  [GET_ALBUM]: async ({ commit, state }, albumId?: BaseId): Promise<void> => {
    const id = albumId || state[EMPLOYEE_ALBUM]?._id;

    if (!id) {
      return;
    }

    const cacheService = new StoreCache(EMPLOYEE_DETAILS_CACHE, SET_EMPLOYEE_DETAILS_CACHE, StoreNamespace.EMPLOYEES_MODULE);
    const cache = cacheService.get<string, Album>(id);
    const updatedAt = albumId ? cache?.updatedAt : undefined;

    const album = await employeeService[GET_ALBUM]({ albumId: id, updatedAt });
    commit(SET_EMPLOYEE_ALBUM, album?._id ? album : cache);

    if (album._id) {
      cacheService.set<string, Album>(album._id, album);
    }
  },

  [ADD_ALBUM]: async ({ commit, dispatch }, payload: AddAlbumReq): Promise<void> => {
    const res = await employeeService[ADD_ALBUM](payload);

    commit(SET_EMPLOYEE_ALBUM, res);
    await dispatch(GET_ALBUMS);
  },

  [UPLOAD_PHOTO]: async ({ state }, payload: UploadAssetsReq): Promise<void> => {
    const albumId = state[EMPLOYEE_ALBUM]?._id;

    if (!payload.length || !albumId) {
      return;
    }

    await employeeService[UPLOAD_PHOTO](payload, albumId);
  },

  [UPDATE_ALBUM]: async ({ commit, state }, payload: UpdateAlbumReq): Promise<void> => {
    const { albumId, ...updated } = payload;
    const { returnCode } = await employeeService[UPDATE_ALBUM](payload);

    if (!returnCode) {
      commit(SET_EMPLOYEE_ALBUM, { ...state[EMPLOYEE_ALBUM], ...updated });
      commit(SET_EMPLOYEE_ALBUMS, {
        ...state[EMPLOYEE_ALBUMS],
        data: state[EMPLOYEE_ALBUMS].data.map((album) => (album._id !== albumId ? album : { ...album, ...updated })),
      });
    }
  },

  [UPDATE_ASSET]: async ({ commit, state }, payload: Omit<UpdateAssetReq, 'albumId'>): Promise<void> => {
    const albumId = state[EMPLOYEE_ALBUM]?._id;

    if (!albumId) {
      return;
    }

    const { returnCode } = await employeeService[UPDATE_ASSET]({ ...payload, albumId });

    if (!returnCode && state[EMPLOYEE_ALBUM]) {
      commit(SET_EMPLOYEE_ALBUM, {
        ...state[EMPLOYEE_ALBUM],
        assets: state[EMPLOYEE_ALBUM].assets.map((asset) => (asset.key === payload.key ? { ...asset, ...payload } : asset)),
      });
    }
  },

  [REMOVE_ALBUM]: async ({ dispatch, commit, state }, albumId?: BaseId): Promise<void> => {
    const id = albumId || state[EMPLOYEE_ALBUM]?._id;

    if (!id) {
      return;
    }

    await employeeService[REMOVE_ALBUM](id);
    await dispatch(GET_ALBUMS);
    commit(SET_EMPLOYEE_ALBUM);
  },

  [REMOVE_ALBUM_ASSETS]: async ({ dispatch, state }, { albumId, assets }: EmployeeRemoveAssets): Promise<void> => {
    const id = albumId || state[EMPLOYEE_ALBUM]?._id;

    if (!id) {
      return;
    }

    await employeeService[REMOVE_ALBUM_ASSETS]({ albumId: id, assets });

    await dispatch(GET_ALBUM);
    await dispatch(GET_ALBUMS);
  },

  [ADD_ALBUM_ASSETS]: async ({ dispatch, state }, { albumId, assets }: Omit<AddAssetReq, 'albumId'> & { albumId?: BaseId }): Promise<void> => {
    const id = albumId || state[EMPLOYEE_ALBUM]?._id;

    if (!id) {
      return;
    }

    await employeeService[ADD_ALBUM_ASSETS]({ albumId: id, assets });
    await dispatch(GET_ALBUM);
    await dispatch(GET_ALBUMS);
  },

  [GET_REVIEWS]: async ({ commit, state }, payload: GetReviewsReq): Promise<BaseRecords<GetReviewRes>> => {
    const res = await employeeService[GET_REVIEWS](payload || { userId: state[EMPLOYEE_DETAILS]!._id });
    commit(SET_EMPLOYEE_REVIEWS, res);

    return res;
  },

  [UPDATE_EMPLOYEE_PROFILE]: async ({ state, commit }, payload: UpdateProfileReq): Promise<void> => {
    if (!state[EMPLOYEE_DETAILS]?._id) {
      return;
    }

    await employeeService[UPDATE_EMPLOYEE_PROFILE](payload);

    const res = await employeeService[GET_EMPLOYEE_DETAILS](state[EMPLOYEE_DETAILS]._id);
    const update = Object.entries(payload).reduce((updated: Record<string, any>, [key]) => ({ ...updated, [key]: res[key as keyof typeof res] }), {});
    commit(UPDATE_EMPLOYEE_DETAILS, update);
  },

  [ADD_REVIEW]: async ({ state, commit, dispatch }, payload: AddReviewReq): Promise<void> => {
    const { userId = state[EMPLOYEE_DETAILS]?._id, ...rest } = payload;

    if (!userId) {
      return;
    }

    await employeeService[ADD_REVIEW]({ userId, ...rest });

    const { rating } = await employeeService[GET_EMPLOYEE_DETAILS](userId);
    commit(UPDATE_EMPLOYEE_DETAILS, { rating });
    await dispatch(GET_REVIEWS, { userId, page: state[EMPLOYEE_REVIEWS].page });
  },
};

export default actions;
