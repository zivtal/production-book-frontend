import { useI18n } from 'vue-i18n';

export const useTranslator = (): ((value: string, fields?: Record<string, string | number | undefined>) => string) => {
  const { t } = useI18n();

  return (value: string, fields: Record<string, string | number | undefined> = {}) => {
    return (t?.(value) || value).replaceAll(/(<.*?>)/g, (_, key) => t(fields[('' + key).slice(1, -1)] || key)).toLowerCase();
  };
};
