import type { BaseLocation } from '@/shared/models';

export interface UserLocation extends BaseLocation {
  id: string;
  title: string;
  place?: string;
  address: string;
  icon?: string;
}
