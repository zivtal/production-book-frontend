<template>
  <div
    ref="inputRef"
    class="vz-datepicker"
    :class="{ 'vz-datepicker--loading': loading, 'vz-datepicker--disabled': disabled }"
    :data-errors="validateMessage"
  >
    <label class="vz-datepicker__title">{{ $t(label) }}</label>

    <div class="vz-datepicker__container" v-on="!vModel ? { click: onClick } : {}">
      <slot name="prefix" />

      <input
        ref="dateInputRef"
        tabindex="0"
        :aria-label="t('COMPONENT_LABELS.PICKER', { value: ariaLabel || label || 'GENERAL.DATE' })"
        :value="vModel"
        :type="type"
        :data-display="displayDate"
        v-bind="vBind"
        @focus="onFocus"
        @blur="onBlur"
        @input="onChange"
        @click="onClick"
      />

      <vz-icon
        v-if="!!vModel && clearable"
        class="vz-datepicker__icon vz-datepicker__icon-picker"
        name="svg:cancel"
        size="10"
        role="button"
        :color="!!vModel ? 'primary-900' : 'mono-700'"
        :clickable="!!vModel"
        :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'GENERAL.CLEAR' })"
        @click="$emit('update:model-value', undefined)"
      />

      <slot name="append" />
    </div>

    <div class="vz-datepicker__error">
      <p v-if="validateMessage" :class="{ 'vz-datepicker__error-internal': !isTouched }">{{ $t(validateMessage) }}</p>
      <p v-else-if="errorMessage">{{ $t(errorMessage) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, type PropType, ref } from 'vue';
import { RecordValidators } from '@/shared/services/validator/service/record-validator/models/record-validators';
import { useValidator } from '@/shared/components/fields/helpers';
import { useTranslator } from '@/plugins/i18n/helpers';

const t = useTranslator();

const props = defineProps({
  modelValue: { type: Number as PropType<number | undefined>, default: undefined },
  type: { type: String as PropType<'date' | 'datetime-local' | 'time'>, default: 'date' },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  nullable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  errorMessage: { type: String as PropType<string | null>, default: null },
  rules: { type: Object as PropType<RecordValidators>, default: () => ({}) },
  min: { type: Number as PropType<number | undefined>, default: undefined },
  max: { type: Number as PropType<number | undefined>, default: undefined },
});

const emit = defineEmits(['update:model-value']);

const timestampToDate = (timestamp?: number, isMonthIndex = true): [string, string, string] | null => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  return ['' + date.getFullYear(), ('0' + (date.getMonth() + (isMonthIndex ? 0 : 1))).slice(-2), ('0' + date.getDate()).slice(-2)];
};

const timestampToTime = (timestamp?: number): [string, string] | null => {
  if (!timestamp) {
    return null;
  }

  const date = new Date(timestamp);

  return [('0' + date.getHours()).slice(-2), ('0' + date.getMinutes()).slice(-2)];
};

const vBind = computed(() => ({
  ...(props.min ? { min: timestampToDate(props.min, false)?.join('-') } : {}),
  ...(props.max ? { max: timestampToDate(props.max, false)?.join('-') } : {}),
}));

const vModel = computed({
  get: (): string | undefined => {
    if (!props.modelValue) {
      return undefined;
    }

    const date = timestampToDate(props.modelValue)?.join('-');

    switch (props.type) {
      case 'date':
        return date;
      case 'datetime-local': {
        const time = timestampToTime(props.modelValue)?.join(':');

        return `${date} ${time}`;
      }
      case 'time': {
        return timestampToTime(props.modelValue)?.join(':');
      }
      default:
        return undefined;
    }
  },
  set: (value) => value,
});

const displayDate = computed((): string | null => {
  const date = timestampToDate(props.modelValue, false)?.reverse().join('/');

  if (!date) {
    return null;
  }

  switch (props.type) {
    case 'time':
      return timestampToTime(props.modelValue)?.join(':') || null;
    case 'date':
      return date;
    case 'datetime-local': {
      const time = timestampToTime(props.modelValue)?.join(':');

      return `${date} ${time}`;
    }
    default:
      return null;
  }
});

const isFocus = ref<boolean>(false);
const blurTimeout = ref<ReturnType<typeof setTimeout>>();
const inputRef = ref<Element | undefined>(undefined);
const dateInputRef = ref<HTMLInputElement | undefined>(undefined);

const onClick = (): void => {
  dateInputRef.value?.focus();
  dateInputRef.value?.showPicker();
};

const onChange = ({ target }: { target: HTMLInputElement }): void => {
  if (!target.value) {
    emit('update:model-value', props.nullable ? null : undefined);

    return;
  }

  switch (props.type) {
    case 'time': {
      const [hours = 0, minutes = 0] = target.value.split(':');
      emit('update:model-value', new Date(0, 0, 0, +hours, +minutes));
      break;
    }
    case 'date': {
      const date = target.value.slice(0, 10);
      const [yearValue, monthValue, dayValue] = date.split('-');

      emit('update:model-value', new Date(+yearValue, +monthValue - 1, +dayValue).valueOf());
      break;
    }
    case 'datetime-local': {
      const date = target.value.slice(0, 10);
      const time = target.value.slice(11);

      const [yearValue, monthValue, dayValue] = date.split('-');
      const [hoursValue, minutesValue] = time.split(':');

      emit('update:model-value', new Date(+yearValue, +monthValue - 1, +dayValue, +(hoursValue || 0), +(minutesValue || 0)).valueOf());
      break;
    }
  }
};

const onFocus = () => {
  if (blurTimeout.value) {
    clearTimeout(blurTimeout.value);
  }

  isFocus.value = true;
};

const onBlur = () => {
  blurTimeout.value = setTimeout(() => (isFocus.value = false), 500);
};

const { validateMessage, isTouched } = useValidator(
  computed(() => props.modelValue),
  computed(() => props.rules),
  props.label
);
</script>

<style lang="scss">
$background-color: var(--color-background-1);

.vz-datepicker {
  position: relative;
  display: flex;
  flex-direction: column;

  &--loading {
    .vz-input__container {
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: 0.125rem;
        left: 0;
        width: 100%;
        height: 0.125rem;
        background-image: linear-gradient(100deg, var(--color-mono-500) 2%, var(--color-primary-900) 44%, var(--color-mono-500) 98%);
        background-repeat: no-repeat;
        background-size: 35% 100%;
        background-position: 0 0;
        animation: skeletonOverlay 2s linear infinite;
      }

      @keyframes skeletonOverlay {
        0% {
          background-position: -100% 0;
        }
        100% {
          background-position: 200% 0;
        }
      }
    }
  }

  &--disabled {
    color: var(--color-mono-600);
  }

  &__title {
    font-size: var(--font-size-14);
  }

  &__container {
    display: flex;
    min-height: 36px !important;
    padding: 8px 8px 8px 8px !important;
    border-radius: var(--border-radius-1);
    align-items: center;
    background-color: $background-color;

    > *:not(input) {
      max-width: fit-content;
    }

    input {
      position: relative;
      outline: none !important;
      flex-grow: 1;

      &:before {
        position: absolute;
        content: attr(data-display);
        color: black;
        width: 100%;
        height: 100%;
        background-color: $background-color;
        @include rtl(direction, rtl);
      }

      &::-webkit-inner-spin-button,
      &::-webkit-clear-button {
        display: none;
      }
    }

    &:has(input:focus) {
      outline: 2px solid var(--color-mono-800);
    }

    &:has(input:not(:focus)) {
      outline: 1px solid var(--color-mono-500);
    }
  }

  &__picker {
    padding-top: 0.25rem;
    height: 0;

    &-container {
      position: fixed;
      height: fit-content;
      z-index: 10;
      display: flex;
      flex-direction: column;
      background-color: var(--color-background-1);
      border-radius: var(--border-radius-1);
      padding: 0.5rem;
      max-height: 260px;
      overflow-y: auto;
      box-shadow: var(--shadow-level-1);
    }

    &-error {
      position: sticky;
      top: 0;
      font-size: var(--font-size-12);
      color: var(--color-red-700);
      background-color: var(--color-background-1);

      &-internal {
        display: none;

        [validate='errors'] & {
          display: initial;
        }
      }
    }
  }

  &__icon {
    width: 0.75rem !important;
    height: 0.75rem !important;
    margin: 0 0.25rem;
  }

  &__error {
    font-size: var(--font-size-12);
    color: var(--color-red-700);
    height: var(--line-height-16);

    &-internal {
      display: none;

      [validate='errors'] & {
        display: initial;
      }
    }
  }
}
</style>
