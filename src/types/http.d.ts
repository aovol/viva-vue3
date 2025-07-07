// request 返回数据类型
import { AxiosResponse } from 'axios'
export interface PaginationResponse<T> {
    items: T[]
    total: number
    current_page: number
    page_size: number
}

//axios请求参数
interface BaseRequestConfig {
    // 请求参数
    url: string
    method?: string
    data?: object
    params?: object
    loading?: boolean
    showMsg?: boolean
    rb?: boolean
    headers?: object
    hideMsg?: boolean
}

//axios响应参数
interface BaseResponseConfig<T> extends AxiosResponse<T> {
    // 响应参数
    data: T
    msg: string
    code: number
}
