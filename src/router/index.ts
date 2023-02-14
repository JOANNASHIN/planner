import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import SearchView from '@/views/TimeBox.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'search',
    component: SearchView,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
