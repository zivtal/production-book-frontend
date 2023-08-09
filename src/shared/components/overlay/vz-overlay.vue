<template>
  <slot v-if="$slots['activator']" name="activator" v-bind="activatorBind" />

  <teleport to="body">
    <div v-if="isModalOpen" :class="{ 'vz-overlay': isShown, 'vz-overlay--hidden': !isShown }" v-bind="$attrs">
      <div class="vz-overlay-modal" :class="{ 'vz-overlay-modal--hidden': !isShown, [`vz-overlay-modal--${size}`]: !!size }">
        <div ref="headerRef" class="vz-overlay-modal__header">
          <p v-if="title" class="vz-overlay-modal__title">{{ $t(title) }}</p>

          <slot v-if="$slots['header']" name="header" />

          <vz-error-alert class="mb-6 fill-width" :errors="errors" />

          <close-button
            v-if="!hideCloseButton"
            class="vz-overlay-modal__close"
            :class="{
              'vz-overlay-modal__close--fixed': closeButtonFixed,
              'vz-overlay-modal__close--absolute': !closeButtonFixed,
            }"
            size="18"
            :color="closeButtonColor"
            @click="() => (manualClose ? $emit('close') : activator(!isShown))"
          />
        </div>

        <div class="vz-overlay-modal__content">
          <slot name="default" v-bind="activatorBind" />
        </div>

        <div v-if="$slots['actions']" class="vz-overlay-modal__actions">
          <slot name="actions" v-bind="activatorBind" />
        </div>

        <div v-if="$slots['navigate']" class="vz-overlay-modal__navigate">
          <slot name="navigate" />
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import type { ErrorResponse } from '@/shared/services/api-service/models';
import type { ColorName } from '@/shared/services/css-service/types';
import { onBeforeMount, onUnmounted, type PropType, ref, useSlots, watch } from 'vue';
import { emitter } from '@/main';
import BlurElement from '@/shared/services/blur-element.service';
import CloseButton from '@/shared/components/buttons/vz-close-button.vue';
import { isMobile } from '@/shared/helpers';

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  title: { type: String, default: '' },
  manualClose: { type: Boolean, default: false },
  hideCloseButton: { type: Boolean, default: false },
  openEvent: { type: String as PropType<string | undefined>, default: undefined },
  closeEvent: { type: String as PropType<string | undefined>, default: undefined },
  closeButtonColor: { type: String as PropType<ColorName>, default: '' },
  closeButtonFixed: { type: Boolean, default: false },
  openCallback: { type: Function as PropType<() => void | undefined>, default: undefined },
  closeCallback: { type: Function as PropType<() => void | undefined>, default: undefined },
  opacity: { type: Number, default: 0.7 },
  blur: { type: [String, Number], default: 0 },
  size: { type: String as PropType<'small' | 'medium' | 'large' | undefined>, default: undefined },
  errors: { type: Object as PropType<ErrorResponse | null>, default: () => null },
});

const emit = defineEmits(['open', 'close']);
const app = new BlurElement({ controlSelector: '.vz-overlay' });
const headerRef = ref<HTMLElement | undefined>(undefined);
const slots = useSlots();

const isShown = ref<boolean>(false);
const isModalOpen = ref<boolean>(false);

onBeforeMount(() => {
  if (props.openEvent) {
    emitter.on(props.openEvent, setShownOn);
  }
});

onUnmounted(() => {
  if (props.openEvent) {
    emitter.off(props.openEvent, setShownOn);
  }

  if (props.closeEvent) {
    emitter.off(props.closeEvent, setShownOff);
  }

  app.unset();
});

const onEscape = (ev: KeyboardEvent) => {
  if (ev.key !== 'Escape') {
    return;
  }

  if (props.manualClose) {
    emit('close');
  } else {
    setShownOff();
  }
};

const setShownOn = async (payload?: any): Promise<void> => {
  if (!slots['default']) {
    return;
  }

  if (props.openEvent) {
    emitter.off(props.openEvent, setShownOn);
  }

  if (props.closeEvent) {
    emitter.on(props.closeEvent, setShownOff);
  }

  if (props.blur && !isMobile) {
    app.set(+props.blur);
  }

  isModalOpen.value = true;
  emit('open', payload);
  setTimeout(() => (isShown.value = true), isMobile ? 0 : 500);

  window.addEventListener('keydown', onEscape);
  await props.openCallback?.();
};

const setShownOff = (payload?: any): void => {
  if (props.openEvent) {
    emitter.on(props.openEvent, setShownOn);
  }

  if (props.closeEvent) {
    emitter.off(props.closeEvent, setShownOff);
  }

  isShown.value = false;
  emit('close', payload);
  window.removeEventListener('keydown', onEscape);
  props.closeCallback?.();
  app.unset();

  setTimeout(() => (isModalOpen.value = false), 500);
};

const activator = async (state: boolean = isShown.value): Promise<void> => (state ? setShownOn : setShownOff)();
const activatorBind = { open: () => activator(true), close: () => activator(false) };

watch(() => isShown.value, activator);
</script>

<style lang="scss">
$wide-large: 1024px;
$wide-medium: 768px;
$wide-small: 512px;

.vz-overlay {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  width: 100vw;
  height: 100vh;
  box-shadow: var(--shadow-level-1);
  transition: 0.5s;
  display: flex;

  &--hidden {
    @include max-mobile-layout {
      transform: translateY(100%);
    }

    @include min-mobile-layout {
      opacity: 0;
      transform: scale(0.7);
    }
  }

  @include max-mobile-layout {
    height: 100%;
  }

  > div {
    position: relative;

    @include mobile-layout {
      height: 100vh;
    }

    @include min-mobile-layout {
      max-height: calc(100vh - 4rem);
    }
  }

  &-modal {
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    justify-content: center;
    transition: opacity 0.3s;

    @include min-mobile-layout {
      margin: auto;
      padding: 0.5rem;
      width: fit-content;
      max-width: 100%;
      border-radius: var(--border-radius-1);

      &--small {
        width: $wide-small;
      }

      &--medium {
        width: $wide-medium;
      }

      &--large {
        width: $wide-large;
      }
    }

    @include mobile-layout {
      transform: translateY(0);
      width: 100% !important;
      height: 100% !important;
      margin: 0;
    }

    &__header {
      position: relative;
      background-color: var(--color-background-1);
      color: var(--color-primary-900);
      width: 100%;
    }

    &__title {
      font-size: var(--font-size-22);
      font-weight: 700;
      padding: 16px 24px 0 32px;
    }

    &__content {
      position: relative;
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow-y: hidden;
    }

    &__actions {
      margin-top: 3rem;
      position: relative;
      height: fit-content;
      width: 100%;
    }

    &__close {
      @include inline-end(1rem);

      &--fixed {
        top: 0;
        position: fixed;
      }

      &--absolute {
        @include min-mobile-layout {
          top: 0;
        }

        @include max-mobile-layout {
          top: 1rem;
        }
        position: absolute;
      }
    }

    &__navigate {
      width: calc(100vw - var(--safe-area-x) / 2);
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      display: flex;
      justify-content: space-between;
      align-content: center;

      svg {
        @include rtl(transform, scale(-1));
      }
    }
  }
}
</style>
