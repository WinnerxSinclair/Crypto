import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import ChartView from '../views/ChartView.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView
  },
  {
    path: '/:id',
    name: 'Chart',
    component: ChartView,
    props: (route) => ({crypto: String(route.params.id)})
  }
]


const router = createRouter({
  history: createWebHistory(),
  routes
});


export default router
