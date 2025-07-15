export interface Role {
    id: number
    name: string
    guard_name: string
    slug: string
    created_at: string
    visible?: boolean
    loading?: boolean
}

export interface Permission {
    id: number
    name: string
    slug: string
    group_name: string
    guard_name: string
    controller: string
    method: string
    description?: string
    created_at: string
    visible?: boolean
    loading?: boolean
}

export interface Controllers {
    [key: string]: Record<string, string[]>
}

export interface PermissionGroup {
    id: number
    name: string
    created_at: string
}
