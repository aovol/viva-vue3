export interface UserInfo {
    id: number
    username: string
    created_at?: string
    updated_at?: string
}

export interface LoginData {
    username: string
    password: string
}

export interface LoginResponse {
    access_token: string
}
