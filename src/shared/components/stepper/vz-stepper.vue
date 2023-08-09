<template>
  <div class="vz-stepper">
    <div>
      <slot />
      <p v-if="dynamicComponent.title" class="vz-stepper__title">{{ $t(dynamicComponent.title) }}</p>
      <p v-if="dynamicComponent.subtitle" class="vz-stepper__subtitle">{{ $t(dynamicComponent.subtitle) }}</p>
    </div>

    <div v-if="!hideProgressBar" class="vz-stepper__progress">
      <div v-for="index in components.length" :key="index" :class="{ 'vz-stepper__active': stepNumber + 1 === index }">
        {{ index }}
      </div>
    </div>

    <vz-error-alert v-if="!hideErrors" class="vz-stepper__errors" :errors="errors" />

    <div class="vz-stepper__content">
      <form ref="formRef" role="form" :autocomplete="autocomplete" @submit.prevent>
        <component
          :is="dynamicComponent.component"
          :field-message="fields"
          :model-value="modelValue"
          @update:model-value="emit('update:model-value', $event)"
        />
      </form>
    </div>

    <div class="vz-stepper__actions">
      <vz-button tabindex="2" :text="!stepNumber ? cancelText! : 'GENERAL.BACK'" @click="onBack" />

      <vz-button tabindex="1" :loading="loading" :text="isLastStep ? submitText! : 'GENERAL.NEXT'" @click="onNext" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType } from 'vue';
import type { StepComponent } from '@/shared/components/stepper/models/step-component';
import { stepperComponentMapper } from '@/shared/components/stepper/helpers/stepper-components-mapper';

const props = defineProps({
  autocomplete: { type: String as PropType<'off' | 'on'>, default: 'off' },
  modelValue: { type: [Object, Number, String, Array], required: true },
  components: { type: Array as PropType<Array<StepComponent>>, required: true },
  submitText: { type: String, default: 'GENERAL.SUBMIT' },
  submitCallback: { type: Function as PropType<() => void | undefined>, default: undefined },
  cancelText: { type: String, default: 'GENERAL.CANCEL' },
  cancelCallback: { type: Function as PropType<() => void | undefined>, default: undefined },
  hideProgressBar: { type: Boolean, default: false },
  hideErrors: { type: Boolean, default: false },
});

const emit = defineEmits(['update:model-value', 'previous-step', 'next-step', 'submit', 'cancel', 'loading', 'errors']);

const { formRef, dynamicComponent, nextStep, previousStep, stepNumber, isLastStep, loading, errors, fields } = stepperComponentMapper(
  props.components,
  {
    submit: () => {
      props.submitCallback?.();
      emit('submit');
    },
    cancel: () => {
      props.cancelCallback?.();
      emit('cancel');
    },
  }
);

const onNext = async (): Promise<void> => {
  await nextStep();

  emit('errors', errors.value);
};

const onBack = (): void => {
  previousStep();
  emit('previous-step');
};
</script>

<style lang="scss">
.vz-stepper {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  max-width: 100%;

  @include max-mobile-layout {
    height: 100vh;
    padding: var(--safe-area-top) var(--safe-area-x) var(--safe-area-bottom) var(--safe-area-x);
  }

  @include min-mobile-layout {
    padding: 1rem 2rem;
  }

  &__title {
    font-size: var(--font-size-20);
    font-weight: 700;
  }

  &__subtitle {
    font-size: var(--font-size-14);
  }

  &__errors {
    margin: 0 1px 1rem 1px;
  }

  &__content {
    position: relative;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    margin: 0.5rem 0 1rem 0.5rem;
    overflow-x: hidden;

    @include max-mobile-layout {
      padding: 0.25rem;
    }

    @include min-mobile-layout {
      padding: 0 0.5rem 1rem 1rem;
    }
  }

  &__progress {
    --stepper-progress-bar-width: 100%;
    position: relative;
    display: flex;
    justify-content: space-between;
    width: var(--stepper-progress-bar-width);
    height: 32px;
    margin-top: 36px;
    margin-bottom: 8px;

    > div {
      display: flex;
      justify-content: center;
      align-items: center;
      border: 1px solid var(--color-mono-600);
      border-radius: 50%;
      font-weight: 500;
      z-index: 1;
      transition: height 0.3s, width 0.3s, background-color 0.3s, margin-top 0.3s;

      &:not(&.vz-stepper__active) {
        margin-top: 2px;
        height: 28px;
        width: 28px;
        color: var(--color-mono-400);
        background-color: var(--color-background-2);
      }

      &.vz-stepper__active {
        height: 32px;
        width: 32px;
        color: var(--color-mono-200);
        background-color: var(--color-primary-900);
      }
    }

    &:before {
      content: '';
      position: absolute;
      top: 50%;
      left: 0;
      width: calc(var(--stepper-progress-bar-width) - 32px);
      height: 100%;
      border-top: 1px solid var(--color-mono-600);
    }
  }

  &__actions {
    position: relative;
    display: flex;
    justify-content: flex-end;
    align-items: flex-end;
    flex-grow: 1;

    > * {
      min-width: 6rem;
      margin-inline-end: 0.5rem;
    }

    &:before {
      position: absolute;
      top: 8px;
      left: 0;
      content: '';
      width: 100%;
      height: 100%;
    }
  }
}
</style>
