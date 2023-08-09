import type { Themes } from '@/shared/services/css-service/types';
import defaultTheme from '@/shared/services/css-service/themes/defualt.theme.json';
import warningTheme from '@/shared/services/css-service/themes/warning.theme.json';

export const THEMES: Themes = { default: defaultTheme, warning: warningTheme };
