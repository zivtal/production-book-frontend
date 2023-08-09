<template>
  <label>
    <input type="checkbox" :value="vModel" @change="onClick" />
    <span class="vz-checkbox__icon" role="checkbox" :aria-label="t('COMPONENT_LABELS.CHECKBOX', { value: ariaLabel || label })" :style="getStyle">
      <vz-icon name="svg:add" :size="size - 8" />
    </span>

    <span v-if="label" class="vz-checkbox__label">{{ $t(label) }}</span>
  </label>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useTranslator } from '@/plugins/i18n/helpers';

const props = defineProps({
  modelValue: { type: Boolean, required: true },
  label: { type: String, default: '' },
  ariaLabel: { type: String, default: '' },
  size: { type: [String, Number], default: 20 },
});

const emit = defineEmits(['update:model-value', 'blur', 'focus']);

const t = useTranslator();

const vModel = computed({
  get: (): boolean => props.modelValue,
  set: (value) => emit('update:model-value', value),
});

const getStyle = computed(() => ({
  width: props.size + 'px',
  height: props.size + 'px',
}));

const onClick = (): void => {
  emit('update:model-value', !props.modelValue);
};
</script>

<style lang="scss" scoped>
label {
  position: relative;
  display: inline-flex;
  align-items: center;

  input {
    display: none;
  }

  .vz-checkbox {
    &__icon {
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: var(--color-primary-500);
      border: 2px solid var(--color-mono-900);
      border-radius: var(--border-radius-1);
      overflow: hidden;

      > * {
        transition: opacity 0.3s;
      }
    }

    &__label {
      padding-inline-start: 4px;
    }
  }

  input:checked ~ .vz-checkbox__icon {
    background-color: var(--color-primary-900);

    > * {
      opacity: 1;
    }
  }

  input:not(:checked) ~ .vz-checkbox__icon {
    > * {
      opacity: 0;
    }
  }

  &:hover {
    > input:checked > .vz-checkbox__icon {
      background-color: #ccc;
    }
  }
}
</style>
