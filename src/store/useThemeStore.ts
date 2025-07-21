import { defineStore } from 'pinia'
import type { Node } from '@/types/node'

interface State {
    layout: string
    asideNodes?: Node[]
}

export const useThemeStore = defineStore('themeStore', {
    state: (): State => ({
        layout: 'split-menu',
        asideNodes: [] as Node[]
    }),
    actions: {
        setAside(asideNodes: Node[]) {
            this.asideNodes = asideNodes as Node[]
        }
    }
})
