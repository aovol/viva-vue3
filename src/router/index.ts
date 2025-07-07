import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { includes } from 'lodash-es'
import { useUserStore } from '@/store/useUserStore'

const router = createRouter({
    history: createWebHistory(),
    routes
})
const guestRoutes = ['/login', '/signup', '/forget_password']
router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore()
    if (includes(guestRoutes, to.path)) {
        next()
        return
    }
    if (!userStore.token) {
        next('/login')
        return
    }

    if (!userStore.user) {
        const user = await userStore.getUser()
        if (!user) {
            userStore.logout()
            next('/login')
            return
        }
    }
    next()
})

export default router
