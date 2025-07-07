import { defineStore } from 'pinia'

interface State {
    reqLoading: boolean
    actions: string[]
}

export const useAppStore = defineStore('appStore', {
    state: (): State => ({
        reqLoading: false,
        actions: [] as string[]
    }),
    actions: {
        setReqLoading(loading: boolean) {
            this.reqLoading = loading
        },
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
        inAction(action: string) {
            return this.actions.includes(action)
        },
        isLoading(action: string) {
            return this.actions.includes(action) && this.reqLoading
        }
    }
})
