import { createApp } from 'vue';
import { createRouter, createWebHashHistory } from 'vue-router';
import { createVuetify } from 'vuetify';
import * as directives from 'vuetify/directives';
import App from './App.vue';
import routes from '~pages';

import '@unocss/reset/tailwind.css';
import 'virtual:uno.css';
import 'vuetify/styles';
import './styles.css';
import '@mdi/font/css/materialdesignicons.css';

const router = createRouter({ routes, history: createWebHashHistory() });

createApp(App)
  .use(router)
  .use(
    createVuetify({
      directives
    })
  )
  .mount('#app');
