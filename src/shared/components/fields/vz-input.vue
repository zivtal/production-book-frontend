<template>
  <div class="vz-input" :class="{ 'vz-input--loading': loading, 'vz-input--disabled': disabled }" :data-errors="validateMessage">
    <label class="vz-input__title">{{ $t(label) }}</label>

    <div class="vz-input__container">
      <slot name="prefix" />

      <input
        ref="inputRef"
        tabindex="0"
        :value="vModel"
        :placeholder="$t(placeholder)"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :readonly="readonly"
        :type="inputType"
        :aria-label="t('COMPONENT_LABELS.TEXT_FIELD', { value: ariaLabel })"
        @keypress="onKeypress"
        @focus="onFocus"
        @blur="onBlur"
        @input="onUpdate($event.target.value)"
      />

      <vz-icon
        v-if="clearable && isClearable"
        class="vz-input__icon"
        clickable
        role="button"
        name="svg:cancel"
        size="10"
        color="primary-900"
        :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'GENERAL.CLEAR' })"
        @click="$emit('update:model-value', null)"
      />

      <slot name="append">
        <vz-icon
          v-if="appendIcon"
          class="vz-input__icon"
          :name="appendIcon"
          clickable
          role="button"
          size="10"
          color="primary-900"
          :aria-label="t('COMPONENT_LABELS.BUTTON', { value: appendLabel })"
          @click="$emit('click:append')"
        />
      </slot>
    </div>

    <div :class="['vz-input__error', { 'vz-input__error--hidden': hideDetails && !validateMessage && !externalError }]" role="alert">
      <p v-if="validateMessage" :class="{ 'vz-input__error-internal': !isTouched && !isStandalone }">{{ $t(validateMessage) }}</p>
      <p v-else-if="externalError">{{ $t(externalError) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { ErrorResponse } from '@/shared/services/api-service/models';
import { computed, type PropType, ref } from 'vue';
import { RecordValidators } from '@/shared/services/validator/service/record-validator/models/record-validators';
import { useValidator } from '@/shared/components/fields/helpers';
import RegexPattern from '@/shared/constants/regex-pattern';
import { useTranslator } from '@/plugins/i18n/helpers';
import { IconName } from '@/shared/components/icon/icon.type';

const t = useTranslator();

const props = defineProps({
  modelValue: { type: [Object, Number, String, Array], required: true },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String as PropType<'text' | 'number' | 'password' | 'email'>, default: 'text' },
  autocomplete: { type: String as PropType<'on' | 'off'>, default: 'off' },
  nullable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  capitalized: { type: Boolean, default: false },
  errorMessage: { type: [Object, String] as PropType<ErrorResponse | string | null | undefined>, default: null },
  hideDetails: { type: Boolean, default: false },
  isStandalone: { type: Boolean, default: false },
  rules: { type: Object as PropType<RecordValidators | undefined>, default: undefined },
  regex: { type: RegExp, default: undefined },
  appendIcon: { type: String as PropType<IconName | undefined>, default: undefined },
  appendLabel: { type: String, default: 'GENERAL.BUTTON' },
});

const emit = defineEmits(['update:model-value', 'click:append']);

const inputRef = ref<HTMLInputElement | undefined>(undefined);
const isFocus = ref<boolean>(false);
const blurTimeout = ref<ReturnType<typeof setTimeout>>();

const { validateMessage, isTouched } = useValidator(
  computed(() => props.modelValue),
  computed(() => props.rules),
  props.label
);

const externalError = computed(() => {
  if (!props.errorMessage) {
    return;
  }

  if (typeof props.errorMessage === 'string') {
    return props.errorMessage;
  }

  const { message, ...fields } = props.errorMessage.errorMessage!.pop() || {};

  return message ? t(message, { ...fields, ...(props.label ? { property: props.label } : {}) }) : undefined;
});

const isClearable = computed(() => !!props.modelValue);

const inputType = computed(() => {
  switch (props.type) {
    case 'number':
    case 'email':
      return 'text';
    default:
      return props.type;
  }
});

const vModel = computed({
  get: (): any => props.modelValue,
  set: (value) => emit('update:model-value', value),
});

const regEx = computed(() => {
  if (props.regex) {
    return props.regex;
  }

  switch (props.type) {
    case 'number':
      return RegexPattern.NUMBER;
    default:
      return undefined;
  }
});

const valueUpdate = (value: string): void => {
  const { selectionStart, selectionEnd } = inputRef.value!;
  const oldValue = props.modelValue?.toString();
  const newValue = oldValue
    ? [selectionStart ? oldValue.slice(0, selectionStart) : '', value, selectionEnd ? oldValue.slice(selectionEnd, oldValue.length) : ''].join('')
    : value;

  if (regEx.value && !regEx.value.test(newValue)) {
    return;
  }

  inputRef.value!.setSelectionRange?.((selectionStart || 0) + 1, 0);

  onUpdate(newValue);
};

const onUpdate = (value: string): void => {
  if (!value) {
    emit('update:model-value', props.nullable ? null : undefined);
  }

  switch (props.type) {
    case 'text':
      emit('update:model-value', props.capitalized ? value.charAt(0).toUpperCase() + value.slice(1) : value);
      break;
    case 'number':
      emit('update:model-value', +value);
      break;
    default:
      emit('update:model-value', value);
      break;
  }
};

const onKeypress = (ev: KeyboardEvent): void => {
  if (ev.key.length > 1) {
    return;
  }

  valueUpdate(ev.key);

  return ev.preventDefault();
};

const onFocus = (): void => {
  if (blurTimeout.value) {
    clearTimeout(blurTimeout.value);
  }

  isFocus.value = true;
};

const onBlur = (): void => {
  blurTimeout.value = setTimeout(() => (isFocus.value = false), 500);
};
</script>

<style lang="scss">
.vz-input {
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
    background-color: white;

    > *:not(input) {
      max-width: fit-content;
    }

    input {
      outline: none !important;
      flex-grow: 1;
      min-width: 1ch;
    }

    &:has(input:focus) {
      outline: 2px solid var(--color-mono-800);
    }

    &:has(input:not(:focus)) {
      outline: 1px solid var(--color-mono-500);
    }
  }

  &__icon {
    min-width: 0.75rem !important;
    min-height: 0.75rem !important;
  }

  &__error {
    font-size: var(--font-size-12);
    color: var(--color-red-700);
    height: var(--line-height-16);
    overflow: hidden;
    transition: height 0.3s;

    &--hidden {
      height: 0;
    }

    &-internal {
      display: none;

      [validate='errors'] & {
        display: initial;
      }
    }
  }
}
</style>
