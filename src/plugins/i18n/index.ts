import { AvailableLanguages } from './available-languages.enum';
import { createI18n } from 'vue-i18n';

import enLang from '@/plugins/i18n/translations/en.json';
import enShared from '@/plugins/i18n/translations/en-shared.json';

import heLang from '@/plugins/i18n/translations/he.json';
import heShared from '@/plugins/i18n/translations/he-shared.json';

const en = { ...enShared, ...enLang };
const he = { ...heShared, ...heLang };

type DictionarySchema = typeof en;

const i18n = createI18n<[DictionarySchema], keyof typeof AvailableLanguages>({
  locale: 'en',
  allowComposition: true,
  silentTranslationWarn: true,
  messages: { en, he },
});

export default i18n;
