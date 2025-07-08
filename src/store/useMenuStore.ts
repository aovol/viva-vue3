import useHttp from '@/utils/useHttp'
import { defineStore } from 'pinia'
import type { Menu } from '@/types/menu'

interface State {
    isRouted: boolean
    menus: Menu[]
}

export const useMenuStore = defineStore('useMenuStore', {
    state: (): State => ({
        menus: [],
        isRouted: false
    }),
    actions: {
        async getMenus() {
            const res = await useHttp<Menu[]>({
                url: '/system/menu'
            })
            this.menus = res.data ?? []
        },
        setIsRouted(isRouted: boolean) {
            this.isRouted = isRouted
        }
    }
})
