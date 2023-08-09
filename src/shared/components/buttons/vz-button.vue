<template>
  <button
    :class="['vz-button', `vz-button--${mode}`]"
    role="button"
    :style="getStyle"
    :disabled="disabled || loading"
    :aria-label="t('COMPONENT_LABELS.BUTTON', { value: ariaLabel || label })"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div
      class="vz-button__content"
      :class="{ 'vz-button__content--loading': loading && !isFlatWithIcon, 'vz-button__content--uppercase': uppercase }"
      :style="contentStyle"
    >
      <template v-if="iconName">
        <spinner-loader v-if="loading" :color="getColor?.color" :size="height ? height / 2 : iconSize" :aria-label="ariaLabel || label" />

        <vz-icon
          v-else
          class="vz-button__content-icon"
          clickable
          :name="iconName"
          :color="iconColor || getIconColor"
          :size="iconSize || height / 2"
        />
      </template>

      <slot>
        <span v-if="text" :class="['text-ellipsis', { 'vz-button__content-text--minimizable': minimizable }]">{{ $t(text) }}</span>
      </slot>
    </div>

    <spinner-loader
      v-if="loading && !isFlatWithIcon"
      class="vz-button__loader"
      :aria-label="ariaLabel || label"
      :color="getColor?.color"
      :size="height / 2"
    />
  </button>
</template>

<script setup lang="ts">
import { computed, PropType, ref } from 'vue';
import SpinnerLoader from '@/shared/components/loaders/vz-spinner.vue';
import { type ColorCategory, COLORS_MAP, type ColorsMap } from '@/shared/services/css-service/types/colors';
import { useTranslator } from '@/plugins/i18n/helpers';
import { IconName } from '@/shared/components/icon/icon.type';

const props = defineProps({
  active: { type: Boolean, default: false },
  color: { type: String as PropType<ColorsMap | string | undefined>, default: 'mono-100' },
  backgroundColor: { type: String as PropType<ColorsMap | string | undefined>, default: undefined },
  mode: { type: String as PropType<'default' | 'flat' | 'rounded' | 'solid' | 'none'>, default: 'default' },
  width: { type: [String, Number], default: 0 },
  height: { type: [String, Number], default: 0 },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  minimizable: { type: Boolean, default: false },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  text: { type: String, default: '' },
  fontSize: { type: [String, Number], default: 14 },
  iconColor: { type: String as PropType<ColorCategory | ColorsMap>, default: '' },
  iconName: { type: String as PropType<IconName | undefined>, default: undefined },
  iconSize: { type: [String, Number], default: 12 },
  uppercase: { type: Boolean, default: true },
});

const t = useTranslator();
const hover = ref<boolean>(false);

const isFlatWithIcon = computed((): boolean => !!props.iconName && props.mode === 'flat');

const isInvert = computed(() => {
  const isActive = props.active;
  const isHover = hover.value && !props.loading && !props.disabled;
  const isDefault = props.mode === 'default' && !hover.value;
  const isFlat = props.mode === 'flat';

  return isFlat || isDefault || isHover || isActive;
});

const getColor = computed((): { color?: string; backgroundColor?: string } => {
  const color = COLORS_MAP[props.color as ColorsMap] || props.color;
  const backgroundColor = COLORS_MAP[props.backgroundColor as ColorsMap] || props.backgroundColor;

  return props.mode === 'solid'
    ? { color }
    : {
        ...(backgroundColor ? { backgroundColor: isInvert.value ? color : backgroundColor } : {}),
        ...(color ? { color: isInvert.value ? backgroundColor : color } : {}),
      };
});

const getIconColor = computed(() => {
  if (props.mode === 'solid') {
    return props.color;
  }

  return isInvert.value ? props.backgroundColor : props.color;
});

const getStyle = computed(() => ({
  ...getColor.value,
  ...(props.width ? { width: props.width + 'px' } : {}),
  ...(props.height ? { height: props.height + 'px' } : {}),
}));

const contentStyle = computed(() => ({
  ...(props.fontSize ? { fontSize: props.fontSize + 'px' } : {}),
}));
</script>

<style lang="scss">
.vz-button {
  &:disabled {
    opacity: 0.3 !important;
  }

  &:not(:disabled) {
    cursor: pointer;
  }

  position: relative;
  border-radius: var(--border-radius-1);
  width: fit-content;
  height: fit-content;

  &__loader {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__content {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: var(--font-weight-medium);

    > *:not(:last-child) {
      margin-inline-end: 4px;
    }

    &--loading {
      opacity: 0;
    }

    &--uppercase {
      text-transform: uppercase;
    }

    &-text {
      &--minimizable {
        @include max-mobile-layout {
          display: none;
        }
      }
    }

    &-icon {
      margin: 0.25rem 0;
    }

    @include mobile-layout {
      overflow: hidden;

      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }

      span.vz-button__content-text--minimizable {
        display: none;
      }
    }
  }

  &--solid {
    position: relative;
    transition: background-color 0.3s;
    padding: 0 0.5rem;

    &:before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-1);
      background-color: currentColor;
      content: '';
      opacity: 0.1;
      transition: opacity 0.3s;
    }

    &:after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      content: '';
      outline: 1px solid currentColor;
      border-radius: var(--border-radius-1);
      opacity: 0.5;
      transition: opacity 0.3s;
    }

    &:hover:not(:disabled) {
      background-color: transparent;

      &:before {
        opacity: 0.2;
      }

      &:after {
        opacity: 1;
      }
    }
  }

  &--default {
    position: relative;
    transition: background-color 0.3s, color 0.2s;
    padding: 2px 8px;

    &:before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      background-color: currentColor;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-1);
      opacity: 0;
      transition: opacity 0.3s;
    }

    &:after {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      border: 1px solid currentColor;
      width: 100%;
      height: 100%;
      border-radius: var(--border-radius-1);
    }

    &:hover:not(:disabled) {
      &:before {
        opacity: 0.15;
      }
    }
  }

  &--rounded {
    border-radius: 50%;
    transition: background-color 0.3s;
    overflow: hidden;
  }

  &--flat {
    padding: 0.25rem 0.5rem;
    margin-top: 6px;
    height: max-content !important;
    background-color: transparent !important;

    &:hover:not(:disabled) {
      text-decoration: underline;
    }
  }
}
</style>
