import { defineStore } from 'pinia'

interface State {
    actions: string[]
}

export const useAppStore = defineStore('appStore', {
    state: (): State => ({
        actions: [] as string[]
    }),
    actions: {
        setAction(action: string) {
            if (this.actions.includes(action)) {
                return
            }
            this.actions.push(action)
        },
        removeAction(action: string) {
            if (!this.actions.includes(action)) {
                return
            }
            this.actions = this.actions.filter(item => item !== action)
        },
        isLoading(action: string) {
            return this.actions.includes('/admin' + action)
        }
    }
})
