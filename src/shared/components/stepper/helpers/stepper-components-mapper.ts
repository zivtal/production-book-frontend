import type { ErrorResponse } from '@/shared/services/api-service/models';
import type { StepComponent } from '@/shared/components/stepper/models/step-component';
import { computed, type Ref, ref } from 'vue';
import ServerError from '@/shared/services/api-service/server-error';
import { useServerErrorsMapper } from '@/shared/composables';
import { useFormValidator } from '@/shared/components/fields/helpers';

export const stepperComponentMapper = (
  components: Array<StepComponent>,
  callback: { submit: () => void; cancel?: () => void }
): {
  formRef: Ref;
  dynamicComponent: Ref<StepComponent>;
  nextStep: () => Promise<boolean>;
  previousStep: () => void;
  resetSteps: () => void;
  stepNumber: Ref<number>;
  isLastStep: Ref<boolean>;
  totalSteps: Ref<number>;
  loading: Ref<boolean>;
  errors: Ref<ErrorResponse | null>;
  fields: Ref<Record<string, string>>;
} => {
  const formRef = ref();
  const stepNumber = ref<number>(0);
  const loading = ref<boolean>(false);
  const errors = ref<ErrorResponse | null>(null);
  const fields = useServerErrorsMapper(errors);

  const isLastStep = computed((): boolean => stepNumber.value === components.length - 1);
  const dynamicComponent = computed((): StepComponent => components[stepNumber.value]);
  const totalSteps = computed(() => components.length);

  const resetSteps = (): void => {
    errors.value = null;
    stepNumber.value = 0;
    formRef.value?.reset();
  };

  const nextStep = async (): Promise<boolean> => {
    const isValid = useFormValidator(formRef);

    if (!isValid()) {
      return false;
    }

    try {
      loading.value = true;
      await dynamicComponent.value.callback?.();

      if (isLastStep.value) {
        await callback.submit?.();
      } else {
        stepNumber.value++;
      }

      return true;
    } catch (e: any) {
      errorHandler(e);

      return false;
    } finally {
      loading.value = false;
    }
  };

  const errorHandler = (fulfilled?: ServerError): void => {
    if (!fulfilled) {
      return;
    }

    errors.value = fulfilled;
    const property = fulfilled.errorMessage![0].property;

    if (property && components.find(({ properties }) => !!properties?.includes(property))) {
      stepNumber.value = components.findIndex(({ properties }) => !!properties?.includes(property));
    }
  };

  const previousStep = (): void => {
    loading.value = true;

    if (!stepNumber.value) {
      callback.cancel?.();
      resetSteps();
    } else {
      stepNumber.value--;
    }

    loading.value = false;
  };

  return {
    formRef,
    nextStep,
    previousStep,
    resetSteps,
    isLastStep,
    stepNumber,
    totalSteps,
    dynamicComponent,
    loading,
    errors,
    fields,
  };
};
