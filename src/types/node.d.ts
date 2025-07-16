export interface Node {
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
    type: 'menu' | 'permission'
    children?: Node[]
    is_show?: boolean
    api?: string
    create_type?: 'batch' | 'single'
    batch_permissions?: string
}
