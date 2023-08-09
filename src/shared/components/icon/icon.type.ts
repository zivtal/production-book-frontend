import icons from '@/shared/components/icon/svg-icons.json';

type Icons = Record<keyof typeof icons, Record<IconType | 'viewBox', string>>;

export type IconPrefix = 'svg';
export type SvgIcon = keyof typeof ICONS;
export type IconType = 'regular' | 'bold' | 'solid' | 'thin';
export type IconName = `${IconPrefix}:${SvgIcon}`;

export const ICONS = icons as Icons;
