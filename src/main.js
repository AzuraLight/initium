import router from '@/routes/route';
import { createPinia } from 'pinia';
import { createApp } from 'vue';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.bundle.js';

const app = createApp(App);

app.use(createPinia(App));
app.use(router);

app.mount('#app');
