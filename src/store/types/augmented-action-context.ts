import { ActionContext, CommitOptions, DispatchOptions } from 'vuex';
import { RootState } from '@/store';

type AugmentedActionContext<S, M, A> = {
  commit<K extends keyof M, F extends M[K] extends (...args: any) => any ? M[K] : never>(
    key: K,
    payload?: Parameters<F>[1],
    options?: CommitOptions
  ): ReturnType<F>;

  commit(key: string, payload: any, options: CommitOptions & { root: true }): any;

  dispatch<K extends keyof A, F extends A[K] extends (...args: any) => any ? A[K] : never>(
    key: K,
    payload?: Parameters<F>[1],
    options?: DispatchOptions
  ): ReturnType<F>;

  dispatch(key: string, payload: any, options: DispatchOptions & { root: true }): any;
} & Omit<ActionContext<S, RootState>, 'commit' | 'dispatch'>;

export default AugmentedActionContext;
