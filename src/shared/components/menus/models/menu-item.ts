import type { IconName } from '@/shared/components/icon/icon.type';

export interface MenuItem {
  divider?: 'before' | 'after';
  icon?: IconName;
  text: string;
  click: () => void;
}
