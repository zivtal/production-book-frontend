<template>
  <div class="vz-card" :class="{ 'vz-card--editable': editable, 'vz-card--clickable': clickable, skeleton: loading }" @click="onClick">
    <div v-if="editable" class="vz-card__toolbar">
      <div class="vz-card__edit-button" @click.stop="onEdit">
        <vz-icon clickable name="svg:edit" color="primary-900" alt="GENERAL.EDIT" size="12" />
      </div>
    </div>

    <slot name="default" />

    <div v-if="$slots.static || $slots.view || $slots.edit" ref="cardRef">
      <slot name="static" />

      <slot v-if="!isEditMode && $slots['view']" name="view" />

      <div v-else-if="$slots['edit']" class="vz-card__edit">
        <form ref="formRef" role="form" autocomplete="off" @dblclick.stop.prevent @submit.prevent>
          <slot name="edit" :errors="errors" :form-ref="formRef" />
        </form>

        <div class="vz-card__edit-control">
          <vz-button text="GENERAL.SAVE" :loading="loading" @click.stop="onSubmit" />

          <vz-button text="GENERAL.CANCEL" :disabled="loading" @click.stop="onCancel" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { type PropType, ref, watch } from 'vue';
import { useResizeObserver, useServerErrorsMapper } from '@/shared/composables';
import { useFormValidator } from '@/shared/components/fields/helpers';

const props = defineProps({
  loading: { type: Boolean, default: false },
  editable: { type: Boolean, default: false },
  clickable: { type: Boolean, default: false },
  callback: { type: Function as PropType<(...arg: any) => Promise<void> | undefined>, default: undefined },
  payload: { type: Object as PropType<any>, default: () => ({}) },
});

const emit = defineEmits(['edit', 'click', 'load']);

const cardRef = ref<Element | undefined>(undefined);
const formRef = ref<Element | undefined>(undefined);
const error = ref(null);
const loading = ref<boolean>(false);
const isEditMode = ref<boolean>(false);
const errors = useServerErrorsMapper(error);

const { ratio: cardRatio } = useResizeObserver(cardRef, true);

watch(
  () => cardRatio.value,
  () => {
    emit('load', { ratio: cardRatio.value });
  }
);

const onEdit = (): void => {
  error.value = null;
  isEditMode.value = !isEditMode.value;
  emit('edit', isEditMode.value);
};

const onClick = (ev: Event): void => {
  if (props.editable && isEditMode.value) {
    ev.stopPropagation();
    ev.preventDefault();
  } else {
    emit('click');
  }
};

const onSubmit = async (ev: Event): Promise<void> => {
  ev.stopPropagation();
  ev.preventDefault();

  const isValid = useFormValidator(formRef);

  if (!isValid()) {
    return;
  }

  try {
    error.value = null;
    loading.value = true;
    await props.callback?.(props.payload);
  } catch (e: any) {
    error.value = e;
  } finally {
    loading.value = false;

    if (!error.value) {
      setTimeout(() => (isEditMode.value = false));
      emit('edit', false);

      ev.stopPropagation();
      ev.preventDefault();
    }
  }
};

const onCancel = (ev: Event): void => {
  setTimeout(() => (isEditMode.value = false));
  emit('edit', false);

  ev.stopPropagation();
  ev.preventDefault();
};
</script>

<style lang="scss">
.vz-card {
  position: relative;
  border-radius: var(--border-radius-1);
  box-shadow: var(--shadow-level-1);
  background-color: var(--color-background-2);
  border: 1px solid var(--color-mono-300);
  padding: 0.5rem;
  margin: 0.25rem 0;

  &--editable {
    padding: 24px !important;
  }

  &--clickable {
    cursor: pointer;
  }

  &__edit {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  &__edit-button {
    cursor: pointer;
    margin: 0 4px;
    padding: 8px;
  }

  &__toolbar {
    position: absolute;
    display: flex;
    justify-content: flex-end;
    height: 0;
    opacity: 0;
    transition: 0.5s;
    top: 0;
    left: 0;
    width: 100%;
  }

  &:hover {
    .vz-card__toolbar {
      opacity: 1;
    }
  }

  &__edit-control {
    display: flex;
    justify-content: flex-end;
    margin-top: 1rem;

    > * {
      min-width: 4rem;
      margin-inline-start: 0.5rem;
    }
  }
}
</style>
