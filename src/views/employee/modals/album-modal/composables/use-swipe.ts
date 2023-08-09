import { ref, watch, type Ref } from 'vue';

type UseSwiper = {
  elementRef: Ref<HTMLElement | undefined>;
};

type Options = Partial<{
  minStepSize: number; // swipe sensitive minimum pixel change for swipe activate
  isContinuous: boolean; // enable continuous to run action multiple time on one swipe
  isRtl: Ref<boolean>;
  onNext: () => Promise<void> | void;
  onBack: () => Promise<void> | void;
}>;

export const useSwipe = (options: Options): UseSwiper => {
  const { minStepSize = 100, isContinuous, isRtl = ref(false), onNext, onBack } = options;

  const elementRef = ref<HTMLElement | undefined>();
  const touchPosition = ref<{ start: number; end: number } | undefined>();

  const onTouchStart = (ev: TouchEvent): void => {
    touchPosition.value = { start: ev.touches[0]!.pageX, end: ev.touches[0]!.pageX };
  };

  const onTouchMove = async (ev: TouchEvent): Promise<void> => {
    if (!touchPosition.value || !elementRef.value) {
      return;
    }

    touchPosition.value = { ...touchPosition.value, end: ev.touches[0].pageX };

    if (!isContinuous) {
      return;
    }

    await swipeSlide();
  };

  const swipeSlide = async (): Promise<void> => {
    if (!touchPosition.value || !elementRef.value) {
      return;
    }

    if (Math.abs(touchPosition.value.start - touchPosition.value.end) < minStepSize) {
      return;
    }

    const isSwipeLeft = touchPosition.value.start - touchPosition.value.end > 0;
    const isForward = isRtl.value ? !isSwipeLeft : isSwipeLeft;
    touchPosition.value = { ...touchPosition.value, start: touchPosition.value.end };

    await (isForward ? onNext : onBack)?.();
  };

  const onTouchEnd = async (): Promise<void> => {
    await swipeSlide();
    touchPosition.value = undefined;
  };

  watch(
    () => elementRef.value,
    () => {
      if (!elementRef.value) {
        return;
      }

      elementRef.value.addEventListener('touchmove', onTouchMove, { passive: true });
      elementRef.value.addEventListener('touchend', onTouchEnd, { passive: true });
      elementRef.value.addEventListener('touchstart', onTouchStart, { passive: true });
    }
  );

  return { elementRef };
};
