<template>
  <div class="vz-verification-code">
    <p v-if="!hideTitle" class="vz-verification-code__title" :class="{ 'vz-verification-code__title--error': error }">
      {{ $t(title) }}
    </p>

    <div ref="codeRef" class="vz-verification-code__fields" dir="ltr">
      <input
        v-for="index in codeLength"
        :key="index"
        :ref="(element) => (refs[index - 1] = element)"
        :class="{
          'vz-verification-code__input': true,
          'vz-verification-code__input--disabled': disabled,
          'vz-verification-code__input--error': error,
          [`input_${index}`]: true,
        }"
        type="tel"
        pattern="[0-9]"
        maxlength="1"
        :data-id="index - 1"
        :aria-label="t('COMPONENT_LABELS.VERIFICATION_CODE_NUM', { value: ariaLabel || title })"
        :disabled="disabled"
        @focus="onFocus"
        @input="onValueChange($event, index - 1)"
        @keydown="onKeyDown($event, index - 1)"
        @paste="onPaste"
      />
    </div>

    <div class="vz-verification-code__error" role="alert">
      <p v-if="validateMessage" :class="{ 'vz-input__error-internal': !isTouched }">{{ $t(validateMessage) }}</p>
      <p v-else-if="errorMessage">{{ $t(errorMessage) }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onMounted, PropType, ref } from 'vue';
import { useValidator } from '@/shared/components/fields/helpers';
import { useTranslator } from '@/plugins/i18n/helpers';

const t = useTranslator();

const props = defineProps({
  hideTitle: { type: Boolean, default: false },
  title: { type: String, default: 'AUTH.VERIFICATION_CODE' },
  ariaLabel: { type: String, default: '' },
  modelValue: { type: [String, Number] as PropType<string | number | undefined>, required: true },
  codeLength: { type: Number, default: 6 },
  disabled: { type: Boolean, default: false },
  errorMessage: { type: String as PropType<string | null | undefined>, default: null },
});

const emit = defineEmits(['update:model-value', 'complete']);

const refs = ref<Array<HTMLInputElement>>([]);
const error = ref<string>('');
const codeRef = ref<HTMLDivElement>();

onMounted((): void => {
  nextTick(() => {
    [...(props.modelValue ? '' + props.modelValue : [])].forEach((char, index) => (refs.value[index].value = char));
  });
});

const focus = (index: number): void => {
  if (index > props.codeLength) {
    index++;
  }

  refs.value[index].focus();
};

const onFocus = (event: FocusEvent): void => {
  (event.target as HTMLInputElement).select();
};

const onValueChange = (event: Event, index: number): void => {
  (event.target as HTMLInputElement).value = (event.target as HTMLInputElement).value.replace(/[^\d]/gi, '');
  const value = (event.target as HTMLInputElement).value;

  if (value === '') {
    return;
  }

  if (refs.value.length > index + 1) {
    refs.value[index + 1].focus();
  }

  triggerChange();
};

const triggerChange = (): void => {
  const code = refs.value.map(({ value }) => value).join('');
  emit('update:model-value', +code);
  emit('complete', code.length === props.codeLength);
};

const onKeyDown = (event: KeyboardEvent, index: number): void => {
  triggerChange();

  if (event.code !== 'Backspace' || (event.target as HTMLInputElement).value || !index) {
    return;
  }

  refs.value[index - 1].focus();
};

const onPaste = (event: ClipboardEvent): void => {
  const clipboardData = event.clipboardData;

  if (!clipboardData || isNaN(+clipboardData.getData('Text'))) {
    return;
  }

  const code = clipboardData.getData('Text') || clipboardData.getData('text/plain');
  fillFromClipboardCode(code);
};

const fillFromClipboardCode = (code: string): void => {
  const parts = code.split('').slice(0, props.codeLength);

  focus(0);
  setTimeout(() => parts.forEach((char, index) => (refs.value[index].value = char)));
  setTimeout(() => focus(parts.length - 1));
  setTimeout(triggerChange);
};

const { validateMessage, isTouched } = useValidator(
  computed(() => '' + props.modelValue || undefined),
  computed(() => ({ required: [true], length: [props.codeLength] })),
  props.title
);
</script>

<style lang="scss">
.vz-verification-code {
  &__title {
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--v-accent-lighten5);
    font-weight: 700;

    &--error {
      color: var(--color-red-600);
    }
  }

  &__fields {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 0.5rem;

    > input {
      background-color: var(--color-background-1);
    }
  }

  &__input {
    position: relative;
    width: 100%;
    max-width: 45px;
    height: 40px;
    border-radius: var(--border-radius-1);
    text-align: center;
    direction: ltr;
    margin: 0 6px;
    flex: 1;

    &--disabled {
      background-color: var(--color-mono-600);
      opacity: 0.3;
    }

    &:not(&--error) {
      border: 1px solid var(--color-primary-700);
    }

    &:focus {
      outline: none;
      border: 2px solid var(--color-primary-900);
    }

    &--error {
      border: 1px solid var(--color-red-600);
    }
  }

  &__error {
    text-align: center;
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
