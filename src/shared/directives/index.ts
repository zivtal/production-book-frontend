import { type App } from 'vue';
import { vValidate } from '@/shared/directives/validate';

const vzDirectives = {
  install: (app: App<Element>) => {
    [vValidate].forEach(([name, callback]) => app.directive(name, callback));
  },
};

export { vzDirectives };
