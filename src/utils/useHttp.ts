import axios from 'axios'
import type { BaseRequestConfig, BaseResponseConfig } from '@/types/http'
import { message } from '@/utils/fn'
import { useAppStore } from '@/store/useAppStore'
import { useUserStore } from '@/store/useUserStore'
declare module 'axios' {
    interface AxiosInstance {
        <T = any, R = BaseResponseConfig<T>, D = any>(config: AxiosRequestConfig<D>): Promise<R>
    }
}

const apiPrefix = '/admin'
const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL + apiPrefix,
    timeout: 10000
})

instance.interceptors.request.use(
    config => {
        const app = useAppStore()
        app.setAction(apiPrefix + (config.url ?? ''))
        const token = localStorage.getItem('access_token')
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`
        }
        return config
    },
    error => {
        return Promise.reject(error)
    }
)

instance.interceptors.response.use(
    response => {
        if (response.data.code === 0) {
            return Promise.resolve(response.data)
        } else if (response.data && response.data.code === 401) {
            useUserStore().logout()
            // window.location.href = '/login'
            return Promise.reject(response.data)
        }
        return Promise.reject(response.data)
    },
    error => {
        if (error.response && error.response.status === 401) {
            useUserStore().logout()
            // window.location.href = '/login'
        }
        return Promise.reject(error)
    }
)

const useHttp = <T>(req: BaseRequestConfig): Promise<BaseResponseConfig<T>> => {
    const { url, method = 'get', data, params, headers = {} } = req
    const showMsg = req.showMsg ?? method.toLowerCase() !== 'get'
    const loading = req.loading ?? true
    const appStore = useAppStore()
    loading && appStore.$patch({ reqLoading: true })
    return new Promise((resolve, reject) => {
        instance({
            url,
            method,
            data,
            params,
            headers: headers
        })
            .then((res: BaseResponseConfig<T>) => {
                showMsg && res.msg && message.success(res.msg)
                loading && appStore.$patch({ reqLoading: false })
                resolve(res)
            })
            .catch(err => {
                showMsg && err.msg && message.error(err.msg)
                loading && appStore.$patch({ reqLoading: false })
                reject(err)
            })
            .finally(() => {
                appStore.removeAction(apiPrefix + (url ?? ''))
            })
    })
}

export default useHttp
