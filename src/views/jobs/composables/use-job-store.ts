import { StoreNamespace } from '@/store/store-namespace';
import { createNamespacedHelpers } from 'vuex-composition-helpers';
import { JobActions, JobGetters, JobMutations, JobState } from '@/views/jobs/store/types';
import store from '@/store';
import jobStore from '@/views/jobs/store';

const useJobStore = () => {
  if (!store.hasModule(StoreNamespace.JOBS_MODULE)) {
    store.registerModule(StoreNamespace.JOBS_MODULE, jobStore);
  }

  return createNamespacedHelpers<JobState, JobGetters, JobActions, JobMutations>(StoreNamespace.JOBS_MODULE);
};

export default useJobStore;
