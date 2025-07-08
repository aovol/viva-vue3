import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/components/layouts/Layout.vue'
const routes: RouteRecordRaw[] = [
    {
        path: '/',
        name: 'root',
        redirect: '/dashboard/index',
        component: Layout,
        children: [
            {
                path: '/dashboard',
                name: 'dashboard',
                children: [
                    {
                        path: 'index',
                        name: 'dashboard-index',
                        component: () => import('@/views/dashboard/index.vue')
                    }
                ]
            }
        ]
    },
    {
        path: '/login',
        component: () => import('@/views/login/index.vue')
    },
    {
        // hide: true,
        path: '/:pathMatch(.*)*',
        component: () => import('../views/error/404.vue')
    }
]

export default routes
