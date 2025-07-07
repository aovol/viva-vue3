import { MessagePlugin } from 'tdesign-vue-next'

export const message = {
    success: (message: string) => {
        MessagePlugin.closeAll()
        MessagePlugin.success(message)
    },
    error: (message: string) => {
        MessagePlugin.closeAll()
        MessagePlugin.error(message)
    }
}
