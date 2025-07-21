export interface Node {
    id?: number
    parent_id?: number
    name: string
    path?: string
    api?: string
    icon?: string
    component: string
    redirect?: string
    sort?: number
    status?: boolean
    show_page_head?: boolean
    type: 'menu' | 'permission'
    is_show?: boolean
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE'
    create_type?: 'batch' | 'single'
    batch_permissions?: string
    children?: Node[]
}
