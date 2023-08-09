import { ref, unref, onMounted, onUnmounted, type Ref } from 'vue';
export const useResizeObserver = (
  node: Ref<Element | undefined>,
  once = true
): {
  top: Ref<number>;
  left: Ref<number>;
  ratio: Ref<number>;
  width: Ref<number>;
  height: Ref<number>;
  minHeight: Ref<number>;
  minWidth: Ref<number>;
  maxHeight: Ref<number>;
  maxWidth: Ref<number>;
  resizeObserver: ResizeObserver | undefined;
} => {
  const top = ref<number>(0);
  const left = ref<number>(0);
  const width = ref<number>(0);
  const height = ref<number>(0);
  const maxWidth = ref<number>(0);
  const maxHeight = ref<number>(0);
  const minWidth = ref<number>(0);
  const minHeight = ref<number>(0);
  const ratio = ref<number>(0);

  let resizeObserver: ResizeObserver | undefined;
  const onResize = (entries: Array<ResizeObserverEntry>): void => {
    const { width: w, height: h, top: t, left: l } = entries[0].contentRect;
    top.value = t;
    left.value = l;
    width.value = Math.floor(w);
    height.value = Math.floor(h);
    ratio.value = Math.floor(w) / Math.floor(h);
    maxWidth.value = Math.max(Math.floor(w), maxWidth.value);
    maxHeight.value = Math.max(Math.floor(h), maxHeight.value);
    minWidth.value = Math.min(Math.floor(w), maxWidth.value ? maxWidth.value : Math.floor(w));
    minHeight.value = Math.min(Math.floor(h), maxHeight.value ? maxHeight.value : Math.floor(h));

    if (once && height.value) {
      resizeObserver?.disconnect();
    }
  };

  onMounted(() => {
    resizeObserver = new ResizeObserver(onResize);

    const element = unref(node) as Element;

    if (element) {
      resizeObserver?.observe(element);
    }
  });

  onUnmounted(() => resizeObserver?.disconnect());

  return { top, left, width, height, maxWidth, maxHeight, minWidth, minHeight, ratio, resizeObserver };
};
