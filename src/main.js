import VueApexCharts from 'vue3-apexcharts'
import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
const app = createApp(App);
app.use(VueApexCharts).use(router);
app.mount('#app')
