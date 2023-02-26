import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TimeBox from '@/views/TimeBox.vue';
import Goal from '@/views/Goal.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'goal',
    component: Goal,
  },
  {
    path: '/timeBox',
    name: 'timeBox',
    component: TimeBox,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
