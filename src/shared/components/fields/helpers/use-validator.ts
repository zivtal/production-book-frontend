import { computed, type ComputedRef, ref, type Ref, watch } from 'vue';
import type { RecordValidators } from '@/shared/services/validator/service/record-validator/models/record-validators';
import RecordValidator from '@/shared/services/validator/service/record-validator/record-validator.service';
import { useI18n } from 'vue-i18n';

export const useValidator = (
  valueModel: Ref,
  rules: Ref<RecordValidators | undefined>,
  label: string
): { validateMessage: ComputedRef<string | null>; isTouched: Ref<boolean> } => {
  const { t } = useI18n();
  const isTouched = ref<boolean>(false);

  watch(
    () => [valueModel.value],
    () => (isTouched.value = true),
    { deep: true }
  );

  return {
    validateMessage: computed((): string | null => {
      if (!rules.value) {
        return null;
      }

      const validator = new RecordValidator({ value: valueModel.value }, [['value', rules.value]]);
      validator.validate();

      return validator.message(t, label);
    }),
    isTouched,
  };
};
