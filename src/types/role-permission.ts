export interface Role {
    id?: number
    name: string
    slug: string
    created_at?: string
    visible?: boolean
    loading?: boolean
    node_ids: number[]
}

export interface Test {
    [key: string]: Record<string, string[]>
}

export interface PermissionGroup {
    id: number
    name: string
    created_at: string
}
