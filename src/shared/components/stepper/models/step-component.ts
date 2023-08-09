import { defineAsyncComponent, defineComponent } from 'vue';

export interface StepComponent<T = any> {
  component: ReturnType<typeof defineAsyncComponent | typeof defineComponent>;
  title?: string;
  subtitle?: string;
  description?: string;
  callback?: () => Promise<any>;
  properties?: Array<keyof T>;
}
