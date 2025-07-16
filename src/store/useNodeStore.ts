import useHttp from '@/utils/useHttp'
import { defineStore } from 'pinia'
import type { Node } from '@/types/node'

interface State {
    isRouted: boolean
    nodes: Node[]
}

export const useNodeStore = defineStore('useNodeStore', {
    state: (): State => ({
        nodes: [],
        isRouted: false
    }),
    actions: {
        async getNodes() {
            const res = await useHttp<Node[]>({
                url: '/system/node'
            })
            this.nodes = res.data ?? []
        },
        setIsRouted(isRouted: boolean) {
            this.isRouted = isRouted
        }
    }
})
