import type { ErrorResponse } from '@/shared/services/api-service/models';
import { ref, type Ref } from 'vue';

export interface PromiseInfo<T> {
  results: Ref<T | null>;
  loading: Ref<boolean>;
  error: Ref<ErrorResponse | null>;
  call: (...args: Array<any>) => Promise<T | void>;
}

export interface PromiseOptions {
  pendingTime?: number;
  errorsCleanUpTime?: number;
  initState?: Partial<{ loading: boolean; error: ErrorResponse | null; results: any | null }>;
}

export const usePromise = <T>(fn: (...args: Array<any>) => Promise<T>, options?: PromiseOptions): PromiseInfo<T | null> => {
  const { errorsCleanUpTime = 10000, pendingTime } = options || {};

  const results = ref<any | null>(options?.initState?.results || null);
  const loading = ref<boolean>(!!options?.initState?.loading);
  const error = ref<ErrorResponse | null>(options?.initState?.error || null);
  const clear = ref<ReturnType<typeof setTimeout> | undefined>(undefined);

  const call = async (...args: Array<any>): Promise<T | void> => {
    loading.value = true;
    error.value = null;
    results.value = null;

    if (clear.value) {
      clearTimeout(clear.value);
    }

    try {
      results.value = await (pendingTime ? new Promise((resolve) => setTimeout(async () => resolve(await fn(...args)), pendingTime)) : fn(...args));
      loading.value = false;

      return results.value;
    } catch (e: any) {
      error.value = e;
      clear.value = errorsCleanUpTime ? setTimeout(() => (error.value = null), errorsCleanUpTime) : undefined;
    } finally {
      loading.value = false;
    }
  };

  return { results, loading, error, call };
};
