import type { defineAsyncComponent, defineComponent } from 'vue';
import type { ColorName } from '@/shared/services/css-service/types';
import type { IconName } from '@/shared/components/icon/icon.type';

export type BaseTab = { label: string | number; style: Record<string, string>; onClick?: (index?: number) => Promise<void> | void };

interface Action {
  color?: ColorName;
  label: string;
  onClick: () => void;
}

export type SwitcherComponent = {
  component: ReturnType<typeof defineAsyncComponent | typeof defineComponent>;
  actions: Array<Action>;
};

export interface SwitcherTab extends BaseTab, Partial<SwitcherComponent> {
  iconName?: IconName;
}

export type SwitcherTabs = Array<SwitcherTab>;
