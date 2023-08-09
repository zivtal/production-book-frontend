import type { ErrorResponse } from '@/shared/services/api-service/models';
import { computed, type Ref } from 'vue';
import { useI18n } from 'vue-i18n';

export const useServerErrorsMapper = (errors: Ref<ErrorResponse | null>): Ref<Record<string, string>> => {
  const { t } = useI18n();

  const dynamic = (value: string, fields: Record<string, any> = {}): string =>
    t(value).replaceAll(/(<.*?>)/g, (_, key) => t(fields[key.slice(1, -1)] || key) || key);

  return computed(() => {
    return (errors.value?.errorMessage || []).reduce((result: Record<string, string>, { message, property, value }) => {
      return property ? { ...result, [property]: dynamic(t(message), { value, property }) } : result;
    }, {});
  });
};
