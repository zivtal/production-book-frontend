<template>
  <div class="vz-field vz-autocomplete" :class="{ 'vz-field--error': hasError, 'vz-field--disabled': isDisabled, 'vz-field--focused': isFocused }">
    <p>{{ $t(label) }}</p>

    <v-autocomplete
      ref="vzAutocompleteField"
      v-model="localValue"
      :class="{ 'vz-field__show-details': !hideDetails }"
      closable-chips
      v-bind="$attrs"
      :hide-details="hideDetails"
      :autofocus="autofocus"
      :placeholder="placeholder"
      :disabled="disabled"
      :multiple="!!multiple"
      :loading="loading"
      :items="items || []"
      :variant="variant!"
      :error-messages="errorDisplay"
      :item-title="itemTitle"
      :rules="rules || []"
      @focus="onFocus"
      @blur="onBlur"
      @keydown="onKeyDown"
      @update:model-value="onUpdate"
      @input="onInput"
    >
      <template #prepend-inner>
        <slot name="custom-prepend-inner" />
      </template>

      <template #append>
        <slot name="custom-append" />
      </template>

      <template v-if="isShortenFormat" #selection="data">
        <template v-if="!loading">
          <template v-if="data.index < +maxSelectionShown">
            <span v-if="!badges" class="vz-font-size-14 pe-1">
              {{ data.item.title }}{{ data.index < modelValue.length - 1 && data.index !== +maxSelectionShown - 1 ? ', ' : '' }}
            </span>

            <vz-badge v-else class="autocomplete-field__badges" font-size="13" :text="data.item.title" />
          </template>

          <span v-else-if="data.index === +maxSelectionShown" class="hrm-font-size-10 fill-width"
            >(+{{ modelValue.length - maxSelectionShown }})</span
          >
        </template>
      </template>
    </v-autocomplete>
  </div>
</template>

<script setup lang="ts">
import type { BaseItem } from '@/shared/models';
import { computed, PropType, ref, watch } from 'vue';
import { debounce } from 'lodash';

const props = defineProps({
  items: { type: Array as PropType<Array<BaseItem>>, default: () => [] },
  loading: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  multiple: { type: Boolean, default: false },
  modelValue: { type: [Object, Number, String, Array], required: true },
  label: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  autofocus: { type: Boolean, default: false },
  ariaLabel: { type: String, default: '' },
  itemTitle: { type: [String, Function], default: 'title' },
  itemValue: { type: String, default: 'value' },
  errorMessages: { type: [Array, String] as PropType<Array<string> | string>, default: () => [] },
  error: { type: Boolean, default: false },
  hideDetails: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  variant: { type: String as PropType<'filled' | 'outlined' | 'plain' | 'underlined' | 'solo'>, default: 'outlined' },
  shortFormat: { type: Boolean, default: true },
  maxSelectionShown: { type: [String, Number], default: 2 },
  debounce: { type: [String, Number], default: 0 },
  badges: { type: Boolean, default: false },
  rules: { type: Array as PropType<Array<(value: any) => string | boolean>>, default: () => [] },
});

const emit = defineEmits(['update:model-value', 'blur', 'focus', 'input']);

const vzAutocompleteField = ref();
const isFocused = ref<boolean>(false);
const isDisabled = computed((): boolean => props.disabled || props.loading);
const isShortenFormat = computed((): boolean => props.multiple && props.shortFormat);

const localValue = computed(() => props.modelValue);

const onInput = debounce(({ target }: { target: HTMLInputElement }): void => emit('input', target.value), +props.debounce);

const onBlur = (): void => {
  isFocused.value = false;
  emit('blur');
};

const onFocus = (): void => {
  isFocused.value = true;
  emit('focus');
};

const onKeyDown = (event: KeyboardEvent): void => {
  if (event.code !== 'Backspace' || (event.target as HTMLInputElement).value || !Array.isArray(localValue.value) || !localValue.value.length) {
    return;
  }

  emit('update:model-value', localValue.value.length === 1 ? null : localValue.value.slice(0, -1));
};

const onUpdate = (event: any): void => {
  if ((Array.isArray(event) && !event.length) || !event) {
    emit('update:model-value', null);

    return;
  }

  emit('update:model-value', event);
};

const isTouched = ref<boolean>(false);
const errorDisplay = computed((): Array<string> | string => (!isTouched.value && props.errorMessages) || []);
const hasError = computed((): boolean => props.error || !!errorDisplay.value?.length);

watch(
  () => props.errorMessages,
  () => (isTouched.value = false),
  { immediate: true, deep: true }
);

watch(
  () => props.modelValue,
  () => (isTouched.value = true)
);
</script>

<style lang="scss">
.vz-autocomplete {
  width: 100%;

  .v-field__input {
    padding-inline-start: 0 !important;
  }

  p {
    font-size: var(--font-size-14);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  &__chip {
    height: 24px !important;
  }

  &__badges {
    margin: 2px 1px;
  }

  .v-autocomplete {
    &__selection {
      font-size: var(--font-size-14);

      span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
      }
    }
  }

  :not(&__append) {
    .v-input__append {
      display: none;
    }
  }

  .v-input {
    padding-bottom: 0;

    &__append {
      padding: 0 !important;
      margin: 0 !important;
    }

    &__details {
      padding: 0;
      position: absolute;
    }
  }
}
</style>
