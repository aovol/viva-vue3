import { createRouter, createWebHistory } from 'vue-router'
import routes from './routes'
import { includes } from 'lodash-es'
import { useUserStore } from '@/store/useUserStore'
import { useNodeStore } from '@/store/useNodeStore'
import { initDynamicRoutes } from './dynamicRoutes'

const router = createRouter({
    history: createWebHistory(),
    routes
})
const guestRoutes = ['/login']
router.beforeEach(async (to, _, next) => {
    const userStore = useUserStore()
    const nodeStore = useNodeStore()
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
    if (!nodeStore.isRouted) {
        await initDynamicRoutes()
        nodeStore.setIsRouted(true)
        next({ ...to, replace: true })
    } else {
        next()
    }
})

export default router
