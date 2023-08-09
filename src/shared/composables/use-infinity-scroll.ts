import type { BasePagination, BaseRecords } from '@/shared/models';
import { type ComputedRef, type Ref, ref, watch } from 'vue';
import ServerError from '@/shared/services/api-service/server-error';

type Options<Data, Payload> = Partial<{
  percentTrigger: number;
  payload: Ref<Payload> | ComputedRef<Payload>;
  page: BasePagination;
  data: Array<Data>;
  disablePayloadWatcher: boolean;
}>;

type InfinityScroll<T> = {
  elementRef: Ref<HTMLElement | undefined>;
  reset: () => void;
  init: () => void;
  page: Ref<BasePagination>;
  data: Ref<Array<T>>;
  loading: Ref<boolean>;
  refreshing: Ref<boolean>;
  error: Ref<ServerError | null>;
};

export const useInfinityScroll = <Data = any, Payload = any>(
  callback: (payload: Payload) => Promise<BaseRecords<Data>>,
  options: Options<Data, Payload>
): InfinityScroll<Data> => {
  const { percentTrigger = 50, payload, disablePayloadWatcher } = options;
  const debounceTimer = ref<number | undefined>();
  const data = ref<Array<any>>(options.data || []);
  const page = ref<BasePagination>({ index: 0, ...(options.page ? options.page : {}) });
  const loading = ref<boolean>(false);
  const refreshing = ref<boolean>(false);
  const error = ref<ServerError | null>(null);

  const elementRef = ref<HTMLElement | undefined>();
  const lastScrollTop = ref<number>(0);
  const touchStartY = ref<number>(0);

  const onTouchStart = (ev: TouchEvent): void => {
    touchStartY.value = ev.touches[0].clientY;
  };

  const onTouchMove = (ev: TouchEvent): void => {
    const touchDiff = ev.touches[0].clientY - touchStartY.value;

    refreshing.value = touchDiff > 0 && elementRef.value?.scrollTop === 0;
  };

  const onTouchEnd = async (): Promise<void> => {
    if (!refreshing.value) {
      return;
    }

    await init();
  };

  const onScroll = async ({ target }: Event): Promise<void> => {
    if (!target || loading.value) {
      return;
    }

    const element = target as HTMLElement;
    const scrollPercent = (element.scrollTop / (element.scrollHeight - element.offsetHeight)) * 100;

    if (scrollPercent < percentTrigger || element.scrollTop < lastScrollTop.value) {
      return;
    }

    if (page.value.index! + 1 >= page.value.total!) {
      return;
    }

    lastScrollTop.value = element.scrollTop;
    page.value.index = (page.value.index || 0) + 1;
    await execute();
  };

  const execute = async (): Promise<void> => {
    try {
      loading.value = true;
      const res = await callback({ ...(payload?.value || {}), page: page.value } as Payload);
      data.value = (res.page.index ? [...data.value, ...res.data] : res.data) as Array<any>;
      page.value = res.page;
    } catch (e: any) {
      error.value = e;
    } finally {
      loading.value = false;
      refreshing.value = false;
    }
  };

  const init = async (initIndex = 0): Promise<void> => {
    if (!elementRef.value) {
      return;
    }

    data.value = options.data || [];
    page.value = { index: initIndex, ...(options.page?.size ? { size: options.page.size } : {}) };
    await execute();

    if (page.value.index === undefined || page.value.total === undefined) {
      return;
    }

    while (elementRef.value?.scrollHeight <= elementRef.value?.offsetHeight * (1 + percentTrigger / 100) && page.value.index < page.value.total - 1) {
      page.value.index = page.value.index + 1;

      await execute();
    }
  };

  const reset = (): void => {
    elementRef.value?.removeEventListener('scroll', onScroll);

    (async () => {
      await init(0);
      elementRef.value?.addEventListener('scroll', onScroll);
    })();
  };

  watch(
    () => elementRef.value,
    async () => {
      if (!data.value.length) {
        await init();
      }

      elementRef.value?.addEventListener('scroll', onScroll);
      elementRef.value?.addEventListener('touchstart', onTouchStart);
      elementRef.value?.addEventListener('touchmove', onTouchMove);
      elementRef.value?.addEventListener('touchend', onTouchEnd);
    },
    { immediate: true }
  );

  watch(
    () => payload?.value,
    () => {
      if (disablePayloadWatcher) {
        return;
      }

      clearTimeout(debounceTimer.value);

      debounceTimer.value = setTimeout(async () => await init(), 500);
    },
    { deep: true }
  );

  return { elementRef, reset, init, loading, error, page, refreshing, data: data as Ref<Array<Data>> };
};
