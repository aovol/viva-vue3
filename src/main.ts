import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import TDesign from 'tdesign-vue-next';
// import "tdesign-vue-next/es/style/index.css";
import '@/assets/css/td-q.css';
import '@/assets/css/tw.css';
import router from '@/router';

const app = createApp(App);
const pinia = createPinia();
app.use(TDesign);
app.use(router);
app.use(pinia);
app.mount('#app');
