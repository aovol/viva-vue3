export interface Menu {
    id?: number
    name: string
    path: string
    icon?: string
    component: string
    redirect?: string
    sort?: number
    status?: boolean
    show_page_head?: boolean
    children?: Menu[]
}
