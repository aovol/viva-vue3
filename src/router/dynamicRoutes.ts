import type { RouteRecordRaw } from 'vue-router'
import type { Menu } from '@/types/menu'
import { useMenuStore } from '@/store/useMenuStore'
import router from './index'
import Empty from '@/components/layouts/Empty.vue'

export const initDynamicRoutes = async () => {
    generateDynamicRoutes()
}

// 使用Vite的glob导入功能预加载所有视图组件
const asyncViews = import.meta.glob('../views/**/**.vue')

// 获取组件
const getComponent = (item: Menu) => {
    let component: any = asyncViews[`../views${item.component}.vue`]
    if (!component) {
        component = asyncViews[`../views${item.component}/index.vue`]
    }
    if (item.component === 'iframe') {
        component = Empty
    }
    if (item?.children && item?.children.length && !component) {
        component = Empty
    }
    if (!component) {
        component = asyncViews[`../views/error/404.vue`]
    }
    return component
}

const generateRoutes = (menus: any[], parentPath = ''): RouteRecordRaw[] => {
    if (!menus || !menus.length) return []

    return menus.map(menu => {
        if (!menu.path) {
            console.log('menu', menu)
        }
        const path = menu.path.startsWith('/')
            ? menu.path
            : parentPath
            ? `${parentPath}/${menu.path}`
            : `/${menu.path}`

        let name = `route-${menu.slug || path}`
        if (menu.path === '/') {
            name = 'index'
        }
        const route: RouteRecordRaw = {
            path,
            name,
            component: getComponent(menu),
            redirect: menu.redirect,
            meta: {
                title: menu.name,
                icon: menu.icon,
                data: menu
            },
            children: [] // 初始化children为空数组
        }

        // 处理子路由
        if (menu.children && menu.children.length > 0) {
            // 如果是顶级路由且有子路由，添加重定向到第一个子路由
            if (!parentPath) {
                route.redirect = menu.children[0].path.startsWith('/')
                    ? menu.children[0].path
                    : `${path}/${menu.children[0].path}`
            }

            // 递归生成子路由
            route.children = generateRoutes(menu.children, path)
        }

        return route
    })
}

export const generateDynamicRoutes = () => {
    const menuStore = useMenuStore()
    const menus = menuStore.menus

    if (!menus || menus.length === 0) {
        console.warn('没有菜单数据，无法生成动态路由')
        return
    }

    // 清除所有动态添加的路由
    try {
        const routes = router.getRoutes()
        routes.forEach(route => {
            if (
                route.name &&
                typeof route.name === 'string' &&
                route.name.startsWith('route-') &&
                route.name !== 'Login' &&
                route.name !== 'Dashboard'
            ) {
                router.removeRoute(route.name)
            }
        })
    } catch (error) {
        console.error('清除路由失败:', error)
    }

    const routes = generateRoutes(menus)

    routes.forEach(route => {
        if (route.path === '/') return
        router.addRoute('root', route)
    })

    router.addRoute('root', {
        path: '/:pathMatch(.*)*',
        name: 'NotFound',
        component: () => import('../views/error/404.vue'),
        meta: { title: '页面不存在' }
    })

    const currentRoute = router.currentRoute.value
    if (currentRoute.matched.length === 0) {
        router.replace(currentRoute.fullPath)
    }
}
