<template>
  <div
    ref="inputRef"
    class="vz-textarea"
    :class="{ 'vz-textarea--loading': loading, 'vz-textarea--disabled': disabled }"
    :data-errors="validateMessage"
  >
    <label class="vz-textarea__title">{{ $t(label) }}</label>

    <div class="vz-textarea__container">
      <textarea
        v-model="vModel"
        :placeholder="$t(placeholder)"
        :disabled="disabled"
        :readonly="readonly"
        :rows="rows"
        :style="{ resize: !resizable ? 'none' : 'vertical' }"
        :aria-label="t('COMPONENT_LABELS.TEXTAREA', { value: ariaLabel || label || placeholder })"
        @input="onUpdate"
        @focus="onFocus"
        @blur="onBlur"
      />
    </div>

    <div class="vz-textarea__error" role="alert">
      <p v-if="validateMessage" :class="{ 'vz-textarea__error-internal': !isTouched }">{{ $t(validateMessage) }}</p>
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
  modelValue: { type: [Object, Number, String, Array], required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  resizable: { type: Boolean, default: false },
  rows: { type: [Number, String], default: 5 },
  errorMessage: { type: String as PropType<string | null | undefined>, default: null },
  rules: { type: Object as PropType<RecordValidators | undefined>, default: undefined },
});

const emit = defineEmits(['update:model-value', 'input']);

const isFocus = ref<boolean>(false);
const blurTimeout = ref<ReturnType<typeof setTimeout>>();

const { validateMessage, isTouched } = useValidator(
  computed(() => props.modelValue),
  computed(() => props.rules),
  props.label
);

const vModel = computed({
  get: (): any => props.modelValue,
  set: (value) => emit('update:model-value', value),
});

const onUpdate = (ev: InputEvent): void => {
  const { value } = ev.target as HTMLInputElement;
  emit('update:model-value', value);
};

const onFocus = () => {
  if (blurTimeout.value) {
    clearTimeout(blurTimeout.value);
  }

  isFocus.value = true;
};

const onBlur = () => (blurTimeout.value = setTimeout(() => (isFocus.value = false), 500));
</script>

<style lang="scss">
.vz-textarea {
  position: relative;
  display: flex;
  flex-direction: column;

  &--loading {
    .vz-textarea__container {
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
    min-height: 36px !important;
    padding: 8px 8px 8px 8px !important;
    border: 1px solid var(--color-mono-500);
    border-radius: var(--border-radius-1);
    background-color: white;

    textarea {
      outline: none !important;
      padding-inline-end: 0.5rem;
      width: 100%;
    }

    &:has(textarea:focus) {
      border: 2px solid var(--color-mono-800);
    }
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
