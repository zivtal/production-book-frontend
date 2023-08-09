import type { IconName } from '@/shared/components/icon/icon.type';

export interface RouteItem {
  label?: string;
  name: string;
  icon?: IconName;
  count?: boolean;
}
