export interface Menu {
    id?: number
    parent_id?: number
    name: string
    slug: string
    path: string
    icon?: string
    component: string
    redirect?: string
    sort?: number
    status?: boolean
    show_page_head?: boolean
    children?: Menu[]
}
