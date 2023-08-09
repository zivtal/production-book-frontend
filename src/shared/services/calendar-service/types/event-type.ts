import type { BaseId } from '@/shared/models';

export type EventType<T> = {
  idKey: keyof T;
  titleKey: keyof T;
  fromKey: keyof T;
  toKey?: keyof T;
  colors?: { key: string; map: Record<string, string> };
};

export type EventMap<T> = Array<T & { title: string; color?: string; id: BaseId }>;
