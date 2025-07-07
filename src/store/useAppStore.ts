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
            // 如果action已经存在，则不添加
            if (this.actions.includes(action)) {
                return
            }
            this.actions.push(action)
        },
        removeAction(action: string) {
            // 如果action不存在，则不删除
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
