import { ref, type Ref } from 'vue';
import type { ErrorResponse } from '@/shared/services/api-service/models';

export interface CallbackInfo<T, P> {
  results?: Ref<T | null>;
  loading?: Ref<boolean>;
  error?: Ref<ErrorResponse | null>;
  callback: (payload?: P) => Promise<T>;
  payload?: P;
}

export const useCallback = <T, P>(options: CallbackInfo<T, P>) => {
  const { loading = ref(false), error = ref(null), results = ref(null), callback, payload } = options;

  (async () => {
    loading.value = true;

    try {
      results.value = await callback(payload);
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
    }
  })();

  return { results, loading, error };
};
