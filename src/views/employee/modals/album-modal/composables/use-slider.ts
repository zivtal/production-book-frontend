import { ref, watch, type Ref, type ComputedRef, nextTick } from 'vue';

type UseSlider = {
  divRef: Ref<HTMLDivElement | undefined>;
  isScrolling: Ref<boolean>;
  index: Ref<number>;
  select: (eventOrIndex?: Event | number) => void;
  next: () => void;
  back: () => void;
};

type Options = Partial<{
  activeIndex: Ref<number> | ComputedRef<number>;
  onSlideCallback: (id: string) => Promise<void> | void;
  autoRefreshChildNodes: boolean;
}>;

export const useSlider = (options?: Options): UseSlider => {
  const { onSlideCallback, autoRefreshChildNodes } = options || {};

  const divRef = ref<HTMLDivElement | undefined>(undefined);
  const isScrolling = ref<boolean>(false);

  const childIndex = ref<number>(0);
  const childNodes = ref<Array<HTMLElement>>([]);

  const getDataId = (element: HTMLElement): string => element.getAttribute('data-id')!;
  const isValidNode = (node: ChildNode): boolean => node instanceof HTMLElement && !!getDataId(node as HTMLElement);

  const getChildNodes = (): Array<HTMLElement> => {
    if (childNodes.value.length && !autoRefreshChildNodes) {
      return childNodes.value;
    } else if (!divRef.value) {
      return [];
    }

    return Array.from(divRef.value.childNodes).filter(isValidNode) as Array<HTMLElement>;
  };

  const getChildNode = (input: Event | number): HTMLElement | undefined => {
    if (input instanceof Event) {
      return getDataId(input.target as HTMLElement) ? (input.target as HTMLElement) : undefined;
    }

    return getChildNodes()[input] || undefined;
  };

  const getCenteredChildId = (divScrollLeft: number): { index: number; child: HTMLElement } => {
    const childNodes = getChildNodes();

    const childNodesAbsPosition = childNodes.map(({ offsetLeft, offsetWidth }: HTMLElement) =>
      Math.abs(offsetLeft + offsetWidth / 4 - divScrollLeft)
    );

    const centerValue = Math.min(...childNodesAbsPosition);
    const index = childNodesAbsPosition.findIndex((value) => value === centerValue);

    return { index, child: childNodes[index] };
  };

  const onScroll = async (): Promise<void> => {
    if (!divRef.value) {
      return;
    }

    isScrolling.value = true;
    const divScrollLeft = divRef.value.scrollLeft + divRef.value.offsetWidth / 2;
    const { index: centerIndex, child: centerChild } = getCenteredChildId(divScrollLeft);

    if (childIndex.value === centerIndex) {
      return;
    }

    childIndex.value = centerIndex;
    await onSlideCallback?.(getDataId(centerChild)!);
  };

  const select = (eventOrIndex: Event | number = childIndex.value, isSmooth = false): void => {
    const childNode = getChildNode(eventOrIndex);

    if (!childNode || !divRef.value) {
      return;
    }

    const { offsetLeft, offsetWidth } = childNode;
    const divWidth = divRef.value.offsetWidth / 2 - offsetWidth / 4;

    divRef.value.scrollTo({ left: offsetLeft - divWidth, ...(isSmooth ? { behavior: 'smooth' } : {}) });
  };

  const next = (): void => select(childIndex.value + 1, true);

  const back = (): void => select(childIndex.value - 1, true);

  watch(
    () => divRef.value,
    () => {
      if (!divRef.value) {
        return;
      }

      divRef.value.addEventListener('scroll', onScroll, { passive: true });
      divRef.value.addEventListener('scrollend', () => (isScrolling.value = false), { passive: true });
    }
  );

  watch(
    () => [options?.activeIndex?.value, childIndex.value],
    async ([index, childIndex]) => {
      if (index !== childIndex) {
        await nextTick(() => select(index));
      }
    },
    { immediate: true }
  );

  return { divRef, index: childIndex, isScrolling, select, next, back };
};
