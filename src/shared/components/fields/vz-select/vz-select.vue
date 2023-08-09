<template>
  <div ref="selectRef" class="vz-select" :class="{ 'vz-select--loading': loading, 'vz-select--disabled': disabled }" :data-errors="validateMessage">
    <label class="vz-select__title">{{ $t(label) }}</label>

    <div class="vz-select__container">
      <slot name="prefix" />

      <template v-if="!badges && (vModel || []).length && type !== 'suggest'">
        <div
          v-if="!loading"
          :class="{ 'vz-select__container-multiple': type === 'multiselect', 'vz-select__container-select': type === 'select' }"
          @click="selectionInputRef?.focus()"
        >
          {{ vModel.join(', ') }}
        </div>

        <div v-if="vModel.length > 1" class="vz-select__container-multiple-count" @click="selectionInputRef?.focus()">({{ vModel.length }})</div>
      </template>

      <input
        ref="selectionInputRef"
        v-model="searchValue"
        type="text"
        tabindex="0"
        :placeholder="$t(placeholder)"
        :disabled="disabled"
        :aria-label="
          t(`COMPONENT_LABELS.${type === 'multiselect' ? 'AUTOCOMPLETE_FIELD' : 'SELECT_FIELD'}`, { value: ariaLabel || label || placeholder })
        "
        @keydown="onQuerySearch"
        @focus="onFocus"
        @blur="onBlur"
        @input="onInput"
      />

      <vz-icon
        v-if="clearable && isClearable"
        class="vz-select__icon"
        clickable
        role="button"
        name="svg:cancel"
        size="10"
        color="primary-900"
        :aria-label="t('COMPONENT_LABELS.BUTTON', { value: 'GENERAL.CLEAR' })"
        @click="$emit('update:model-value', null)"
      />

      <slot name="append" />
    </div>

    <div v-if="autoCompleteShown" class="vz-select__list">
      <div class="vz-select__list-container" role="list" :style="{ width: inputWidth + 'px', position: fixed ? 'fixed' : 'absolute' }">
        <div v-if="!itemList?.length">{{ $t('GENERAL.NO_DATA_AVAILABLE') }}</div>

        <template v-else>
          <div
            v-for="(item, index) in itemList"
            :key="index"
            class="vz-select__list-item"
            :class="{
              [`vz-select__list-item-${index}`]: true,
              'vz-select__list-item--active': selectedIndex === index,
              'vz-select__list-item--selected': isItemSelected(item),
            }"
            role="listitem"
            @click="onSelectFromList(item)"
          >
            {{ getTitle(item) }}
          </div>
        </template>
      </div>
    </div>

    <div v-show="!badges || validateMessage || externalError" class="vz-select__error" role="alert">
      <p v-if="validateMessage" :class="{ 'vz-select__error-internal': !isTouched }">{{ $t(validateMessage) }}</p>
      <p v-else-if="externalError">{{ $t(externalError) }}</p>
    </div>

    <div v-if="badges && type === 'multiselect'" class="vz-select__badges">
      <slot v-for="(item, index) in selectionValueModal(modelValue)" :key="index" :item="item" name="badge">
        <vz-badge clearable :color="badgeColor" :text="getTitle(item)" @clear="onClearSelectedItem(index)" />
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { BaseItem, BaseOptions } from '@/shared/models';
import type { ItemFunctionArg } from '@/shared/components/fields/vz-select/models';
import type { ErrorResponse } from '@/shared/services/api-service/models';
import type { ColorsMap } from '@/shared/services/css-service/types';
import { computed, type PropType, ref } from 'vue';
import { RecordValidators } from '@/shared/services/validator/service/record-validator/models/record-validators';
import { useResizeObserver } from '@/shared/composables';
import { scrollToView } from '@/shared/helpers';
import { useValidator } from '@/shared/components/fields/helpers';
import { itemTextFunction, itemValueFunction, useGetItemText, useGetItemValue, useValuesToText } from '@/shared/components/fields/vz-select/helpers';
import { useTranslator } from '@/plugins/i18n/helpers';

const props = defineProps({
  modelValue: { type: [Object, Number, String, Array], required: true },
  autoCloseOnSelect: { type: Boolean, default: false },
  badges: { type: Boolean, default: false },
  badgeColor: { type: String as PropType<ColorsMap>, default: 'mono-800' },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  placeholder: { type: String, default: '' },
  type: { type: String as PropType<'select' | 'multiselect' | 'suggest'>, default: 'select' },
  debounce: { type: [String, Number], default: 0 },
  items: { type: Array as PropType<BaseOptions<any> | undefined>, default: undefined },
  itemText: { type: [Function, String] as PropType<((item: ItemFunctionArg) => string) | string>, default: itemTextFunction },
  itemValue: { type: [Function, String] as PropType<((item: ItemFunctionArg) => any) | string>, default: itemValueFunction },
  fixed: { type: Boolean, default: false },
  nullable: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  readonly: { type: Boolean, default: false },
  clearable: { type: Boolean, default: false },
  errorMessage: { type: [Object, String] as PropType<ErrorResponse | string | null | undefined>, default: null },
  rules: { type: Object as PropType<RecordValidators | undefined>, default: undefined },
});

const emit = defineEmits(['update:model-value', 'search']);

const t = useTranslator();

const isFocus = ref<boolean>(false);
const blurTimeout = ref<ReturnType<typeof setTimeout>>();
const debounceTimeout = ref<ReturnType<typeof setTimeout>>(0);
const selectRef = ref<Element | undefined>(undefined);
const selectionInputRef = ref<HTMLInputElement | undefined>(undefined);
const searchValue = ref<string | null>(null);
const selectedIndex = ref<number>(0);

const { width: inputWidth } = useResizeObserver(selectRef);

const autoCompleteShown = computed((): boolean => !!props.items && isFocus.value && !isSelected.value && (!!searchValue.value || !props.badges));

const optionsList = computed(() =>
  (props.items || []).map((item: BaseItem | string) => (typeof item === 'string' ? { title: t(item), value: item.split('.').pop() } : item))
);

const { validateMessage, isTouched } = useValidator(
  computed(() => props.modelValue),
  computed(() => props.rules),
  props.label
);

const vModel = computed({
  get: (): any => selectionValueModal(props.modelValue),
  set: (value) => emit('update:model-value', value),
});

const getTitle = useGetItemText(props.itemText);
const getValue = useGetItemValue(props.itemValue);
const selectionValueModal = useValuesToText(
  computed(() => optionsList.value || []),
  getTitle,
  getValue,
  props.type === 'multiselect'
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

const isSelected = computed((): boolean => !!vModel.value?.length && props.type !== 'multiselect');
const isClearable = computed(() => (props.type === 'multiselect' ? !!((props.modelValue as Array<any>) || []).length : !!props.modelValue));

const itemList = computed(() => {
  const value = searchValue.value;
  const regExp = new RegExp(`^(${value})`, 'gi');

  return value ? optionsList.value?.filter((item) => getTitle(item).match(regExp)) : optionsList.value;
});

const debounce = (value: string | null) => {
  clearTimeout(debounceTimeout.value);

  if (props.type === 'suggest') {
    emit('update:model-value', value);
  }

  debounceTimeout.value = setTimeout(() => {
    emit('search', value);
    selectionInputRef.value?.focus();
  }, +props.debounce);
};

const isItemSelected = (value: any): boolean => {
  return !!(Array.isArray(props.modelValue) ? props.modelValue : [props.modelValue]).find(
    (item) => JSON.stringify(getValue(value)) === JSON.stringify(getValue(item))
  );
};

const onFocus = (): void => {
  if (blurTimeout.value) {
    clearTimeout(blurTimeout.value);
  }

  isFocus.value = true;
};

const onBlur = (): void => {
  blurTimeout.value = setTimeout(() => {
    if (props.type === 'select' || props.type === 'multiselect') {
      searchValue.value = null;
    }

    isFocus.value = false;
  }, 250);
};

const onInput = (): void => debounce(searchValue.value);

const onQuerySearch = (ev: KeyboardEvent): void => {
  switch (ev.key) {
    case 'Backspace':
      if (!!searchValue.value?.length || props.badges) {
        return;
      }

      if (Array.isArray(props.modelValue)) {
        emit('update:model-value', props.modelValue.slice(0, -1));
      } else {
        emit('update:model-value', null);
      }
      break;
    case 'ArrowDown':
      selectedIndex.value = Math.min(selectedIndex.value + 1, (itemList.value?.length || 0) - 1);
      scrollToView(`.vz-select__list-item-${selectedIndex.value}`);
      ev.preventDefault();
      break;
    case 'ArrowUp':
      selectedIndex.value = Math.max(selectedIndex.value - 1, 0);
      scrollToView(`.vz-select__list-item-${selectedIndex.value}`);
      ev.preventDefault();
      break;
    case 'Enter':
      onSelectFromList(itemList.value![selectedIndex.value]);
      ev.preventDefault();
      break;
    case 'Escape':
      selectionInputRef.value?.blur();
      ev.preventDefault();
      break;
    default:
      selectedIndex.value = 0;
      scrollToView(`.vz-select__list-item-${selectedIndex.value}`);
      break;
  }
};

const onSelectFromList = (item: Record<string, any>): void => {
  if (!props.autoCloseOnSelect) {
    selectionInputRef.value?.focus();
  } else {
    selectionInputRef.value?.blur();
  }

  switch (props.type) {
    case 'multiselect':
      searchValue.value = null;
      emit(
        'update:model-value',
        ((props.modelValue as Array<any>) || []).includes(getValue(item))
          ? (props.modelValue as Array<any>).filter((currentItem) => currentItem !== getValue(item))
          : [...((props.modelValue as Array<any>) || []), getValue(item)]
      );
      break;

    case 'select':
      searchValue.value = null;
      emit('update:model-value', getValue(item));
      break;

    default:
      selectionInputRef.value!.value = getTitle(item);
      emit('update:model-value', getValue(item));
      break;
  }
};

const onClearSelectedItem = (index: number) => {
  if (props.type !== 'multiselect') {
    return;
  }

  emit(
    'update:model-value',
    (props.modelValue as Array<any>).filter((_, bulkIndex) => bulkIndex !== index)
  );
};
</script>

<style lang="scss">
.vz-select {
  position: relative;
  display: flex;
  flex-direction: column;

  &--loading {
    .vz-select__container {
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

      &:not(:focus) {
        width: 1ch;
      }
    }

    &:has(input:focus) {
      outline: 2px solid var(--color-mono-800);
    }

    &:has(input:not(:focus)) {
      outline: 1px solid var(--color-mono-500);
    }

    &-select,
    &-multiple {
      font-size: var(--font-size-14);
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      padding-inline-end: 0.25rem;
      flex-grow: 3;

      &-count {
        padding-inline-end: 0.25rem;
      }
    }
  }

  &__list {
    padding-top: 0.25rem;
    height: 0;

    &-item {
      &:hover {
        background-color: var(--color-mono-300);
      }

      &--selected {
        background-color: var(--color-background-2);
      }

      &--active {
        background-color: var(--color-mono-300);
      }
    }

    &-container {
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

      > * {
        padding: 0.25rem;
        width: 100% !important;
      }
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
    min-width: 0.75rem !important;
    min-height: 0.75rem !important;
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

  &__badges {
    display: flex;
    flex-wrap: wrap;
    margin-top: 0.25rem;
    margin-bottom: 1rem;

    > * {
      margin: 0.125rem;
    }
  }
}
</style>
