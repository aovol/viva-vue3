import 'vue-router'
import type { Menu } from './menu'

declare module 'vue-router' {
    interface RouteMeta {
        data?: Menu
    }
}
