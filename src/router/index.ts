import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { includes } from 'lodash-es'
import { useUserStore } from '@/store/useUserStore'
import { useMenuStore } from '@/store/useMenuStore'
import { initDynamicRoutes } from './dynamicRoutes'

const router = createRouter({
    history: createWebHistory(),
    routes
})
const guestRoutes = ['/login']
router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore()
    const menuStore = useMenuStore()
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
    if (!menuStore.isRouted) {
        await initDynamicRoutes()
        menuStore.setIsRouted(true)
        next({ ...to, replace: true })
    } else {
        next()
    }
})

export default router
