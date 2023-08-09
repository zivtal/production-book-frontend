import type { BaseId } from '@/shared/models';
import { MutationTree } from 'vuex';
import { RootState } from '@/store/index';
import { COORDINATES, LANGUAGE, LOADING, SET_COORDINATES, SET_LANGUAGE, SET_LOADING } from '@/store/constants';
import { AvailableLanguages } from '@/plugins/i18n/available-languages.enum';
import { navigatorGeoLocation } from '@/shared/helpers';

export const mutations: MutationTree<RootState> = {
  [SET_LANGUAGE]: (state: RootState, language?: keyof typeof AvailableLanguages) => {
    const navigatorLang = (window.navigator.languages?.length ? window.navigator.languages[0] : window.navigator.language).slice(0, 2) as any;
    state[LANGUAGE] = language || navigatorLang;
  },

  [SET_COORDINATES]: (state: RootState, coordinates?: [number, number]) => {
    state[COORDINATES] = coordinates || null;

    if (!coordinates) {
      (async () => {
        const navigatorCoordinate = await navigatorGeoLocation();

        if (!state[COORDINATES]) {
          state[COORDINATES] = navigatorCoordinate || null;
        }
      })();
    }
  },

  [SET_LOADING]: (state: RootState, id: BaseId) => {
    state[LOADING] = state[LOADING].includes(id) ? state[LOADING].filter((value) => value !== id) : (state[LOADING] = [...state[LOADING], id]);
  },
};
