import { computed, watch, type Ref } from 'vue';
import { useRouter } from 'vue-router';

type RouteWatcher = {
  params?: Record<string, Ref>;
  query?: Record<string, Ref>;
};

export default (callback: (payload: any) => Promise<void>, watchers: RouteWatcher, options?: { immediate?: boolean }): void => {
  const router = useRouter();
  const unRefQuery = computed(() => Object.entries(watchers.query || {}).reduce((req, [key, value]) => ({ ...req, [key]: value.value }), {}));

  watch(
    () => Object.values(watchers.query || {}).map((data) => data.value),
    async () => await router.push({ query: unRefQuery.value })
  );

  watch(
    () => [
      router.currentRoute.value.name,
      Object.keys({ ...(watchers.query || {}), ...(watchers.params || {}) }).map((key) => router.currentRoute.value.query[key]),
    ],
    async () => {
      // query watchers
      Object.keys(watchers.query || {}).forEach((key) => {
        const routeValue = router.currentRoute.value.query[key];

        return ((watchers.query || {})[key].value = typeof (watchers.query || {})[key].value === 'number' && routeValue ? +routeValue : routeValue);
      });

      // query watchers
      Object.keys(watchers.params || {}).forEach((key) => {
        const routeValue = router.currentRoute.value.query[key];

        return ((watchers.params || {})[key].value = typeof (watchers.params || {})[key].value === 'number' && routeValue ? +routeValue : routeValue);
      });

      await callback(unRefQuery.value);
    },
    { immediate: !!options?.immediate }
  );
};
