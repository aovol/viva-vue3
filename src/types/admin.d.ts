export interface Admin {
    id: number
    name: string
    created_at?: string
    visible?: boolean
    loading?: boolean
    password?: string
    password_confirmation?: string
    role_slugs?: string[]
}
