import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { GeneralActions, GeneralGetters, GeneralMutations, GeneralState } from '@/store/client/types';
import { StoreNamespace } from '@/store/store-namespace';

const useGeneralStore = () => createNamespacedHelpers<GeneralState, GeneralGetters, GeneralActions, GeneralMutations>(StoreNamespace.GENERAL_MODULE);

export default useGeneralStore;
