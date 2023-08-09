import type { ColorName } from '@/shared/services/css-service/types/colors';

const THEME_NAME = ['default', 'warning'] as const;

export type ThemeColors = Record<ColorName, string>;
export type ThemeName = (typeof THEME_NAME)[number];
export type Themes = Record<ThemeName, ThemeColors>;
