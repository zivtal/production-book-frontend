import i18n from '@/plugins/i18n';
import { isRtl } from '@/plugins/i18n/helpers';

export const setLanguage = (languageCode: string) => {
  i18n.global.locale = languageCode;
  document.documentElement.setAttribute('lang', languageCode);
  document.documentElement.setAttribute('dir', isRtl(languageCode) ? 'rtl' : 'ltr');
};
