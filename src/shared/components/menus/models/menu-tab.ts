import { defineAsyncComponent, defineComponent } from 'vue';

export interface MenuTab {
  component: ReturnType<typeof defineAsyncComponent | typeof defineComponent>;
  title?: string;
  subtitle?: string;
  icon?: string;
}
