import type { RouteRecordRaw } from 'vue-router';
import Layout from '@/components/layouts/Layout.vue';
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'root',
    redirect: '/dashboard',
    component: Layout,
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        children: [
          {
            path: '',
            name: 'dashboard-index',
            component: () => import('@/views/dashboard/index.vue'),
          },
        ],
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index.vue'),
  },
];
export default routes;
