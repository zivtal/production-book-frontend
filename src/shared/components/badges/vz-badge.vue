<template>
  <div
    class="vz-badge"
    :class="{ 'vz-badge--clickable': clickable, 'vz-badge--selected': selected, 'vz-badge--outlined': outlined, 'vz-badge--multiline': multiline }"
    :style="{ color: getColor, 'font-size': fontSize + 'px' }"
    :aria-label="t('COMPONENT_LABELS.BADGE', { value: areaLabel || text })"
  >
    <slot name="prefix" />

    <div v-if="clearable" class="vz-badge__clearable" @click="$emit('clear')">
      <vz-icon clickable name="svg:close" :size="fontSize" :color="color" />
    </div>

    <div v-if="prefix" class="vz-badge__prefix">{{ prefix }}</div>
    <span v-if="getDate" class="vz-badge__prefix">{{ $t(text) }}</span>
    <span v-if="counter !== undefined" class="vz-badge__counter">{{ counter }}</span>
    <span v-if="text" class="vz-badge__text">{{ getDate || $t(text) }}</span>

    <slot name="default" />
  </div>
</template>

<script setup lang="ts">
import type { ColorsMap } from '@/shared/services/css-service/types/colors';
import { computed, PropType } from 'vue';
import { GlobalVariables } from '@/shared/constants/global-variables';
import dayjs from 'dayjs';
import getThemeColor from '@/shared/services/css-service/helpers/get-theme-color';
import { useTranslator } from '@/plugins/i18n/helpers';

defineEmits(['clear']);

const props = defineProps({
  text: { type: String, default: '' },
  date: { type: Number, default: undefined },
  color: { type: String as PropType<ColorsMap | string>, default: 'primary-900' },
  fontSize: { type: [String, Number], default: 12 },
  counter: { type: Number, default: undefined },
  prefix: { type: String as PropType<string>, default: undefined },
  clearable: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  selected: { type: Boolean, default: false },
  outlined: { type: Boolean, default: false },
  multiline: { type: Boolean, default: false },
});

const t = useTranslator();

const getDate = computed((): string | undefined => (props.date ? dayjs(props.date).format(GlobalVariables.DAY_MONTH_YEAR_TIME_FORMAT) : undefined));
const getColor = computed((): string => getThemeColor(props.color));
const areaLabel = computed((): string => [props.counter, props.date, props.text].filter((value) => value !== undefined).join(' '));
const iconSize = computed((): number => Math.ceil(+props.fontSize * 0.9));
</script>

<style lang="scss">
$border-radius: var(--border-radius-1);

.vz-badge {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  user-select: none;
  position: relative;
  overflow: hidden;

  &__clearable {
    padding: 0.25rem;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  &__prefix,
  &__counter {
    position: relative;
    display: flex;
    align-items: center;
    font-weight: 700;
    padding: 0.125rem 0.25rem;
    min-height: 100%;

    &::before {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: currentColor;
      opacity: 0.1;
      border-radius: $border-radius 0 0 $border-radius;
      content: '';
    }
  }

  &__text {
    flex-grow: 1;
    padding: 0.125rem 0.25rem;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &--clickable {
    cursor: pointer;
  }

  &::before {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: currentColor;
    opacity: 0.15;
    border-radius: $border-radius;
    content: '';
  }

  &--outlined,
  &--selected {
    &::after {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      outline: currentColor solid 1px;
      background-color: transparent;
      content: '';
    }
  }

  &--selected {
    &::before {
      opacity: 0.3;
    }
  }

  &--multiline {
    flex-direction: column;

    * {
      width: 100%;
      text-align: center;
      padding: 0 0.5rem;
    }

    > :last-child {
      position: relative;

      &::before {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: currentColor;
        opacity: 0.15;
        border-radius: 0 0 $border-radius $border-radius;
        content: '';
      }
    }
  }
}
</style>
