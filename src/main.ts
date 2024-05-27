import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';

import App from './App.vue';

import 'primevue/resources/themes/aura-dark-green/theme.css';
import './main.scss';

createApp(App).use(PrimeVue).use(ToastService).mount('#app');
