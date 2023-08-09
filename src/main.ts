import { createApp } from 'vue';
import App from './App.vue';
import './register-service-worker';
import router from './router';
import store from './store';
import '@/styles/app.scss';
import { TinyEmitter } from 'tiny-emitter';
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import { vzComponents } from '@/shared/components';
import { vzDirectives } from '@/shared/directives';
import i18n from '@/plugins/i18n';

export const emitter = new TinyEmitter();

const app = createApp(App).use(store).use(router).use(i18n).use(vzComponents).use(vzDirectives);

dayjs.extend(customParseFormat);

app.mount('#app');
