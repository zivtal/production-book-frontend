import { Store } from 'vuex';
import store, { type RootState } from '@/store';
import { StoreNamespace } from '@/store/store-namespace';

export type StateCache<Res> = { [key: string]: Res };

export default class StoreCache {
  public constructor(getter: string, commit: string, namespace?: StoreNamespace) {
    this.store = store;
    this.getter = `${namespace ? `${namespace}/` : ''}${getter}`;
    this.commit = `${namespace ? `${namespace}/` : ''}${commit}`;
  }

  private store: Store<RootState>;
  private readonly getter: string;
  private readonly commit: string;

  public set<Req, Res>(request: Req, response: Res, options?: { expiredIn?: number }): void {
    const { expiredIn } = options || {};
    const key = this.uniqueKey(request);
    const state = this.store.getters[this.getter] || ({} as Record<string, Response>);

    this.store.commit(this.commit, Object.freeze({ ...state, [key]: response }), { silent: true });

    if (expiredIn) {
      this.remove(key, expiredIn);
    }
  }

  public get<Req, Res>(request: Req): Res | void {
    const state = this.store.getters[this.getter] || ({} as Record<string, Response>);
    const key = this.uniqueKey(request);

    return state[key];
  }

  private remove(key: string, timeout = 0): void {
    setTimeout(() => {
      const state = this.store.getters[this.getter] || ({} as Record<string, Response>);

      this.store.commit(this.commit, Object.freeze({ ...state, [key]: undefined }), { silent: true });
    }, timeout);
  }

  private uniqueKey<Req>(rawKey: Req): string {
    const text = JSON.stringify(rawKey);
    const uniqueNumber: number = [...text].reduce(
      (sum: number, char: string, index: number): number => sum + char.charCodeAt(0) * (index + 1) ** ((index % 10) + 1),
      0
    );

    return uniqueNumber.toString(16);
  }
}
