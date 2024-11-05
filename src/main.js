import router from '@/routes/route';
import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';

import 'bootstrap/dist/css/bootstrap.css';


const app = createApp(App);

app.use(createPinia(App));
app.use(router);

app.mount('#app');