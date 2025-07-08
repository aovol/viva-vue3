import { defineStore } from 'pinia'
import useHttp from '@/utils/useHttp'
import type { UserInfo, LoginData, LoginResponse } from '@/types/user'
import { useMenuStore } from './useMenuStore'

interface tokenObj {
    access_token: string
    expires_at?: string
    refresh_token?: string
    scope?: string
    token_type?: string
}
interface UserState {
    token: tokenObj | null
    user: UserInfo | null
}

export const useUserStore = defineStore('userStore', {
    state: (): UserState => {
        const token = localStorage.getItem('access_token')
        return {
            token: {
                access_token: token || ''
            },
            user: null as UserInfo | null
        }
    },
    getters: {
        isAuthenticated: state => !!state.user && !!state.token
    },
    actions: {
        async login(data: LoginData) {
            const res = await useHttp<LoginResponse>({
                url: '/login',
                method: 'post',
                data
            })

            this.setLoginData(res.data)
            return res.data
        },

        async getUser() {
            try {
                const res = await useHttp<UserInfo>({
                    url: '/user',
                    method: 'get'
                })
                this.user = res.data
                const menuStore = useMenuStore()
                await menuStore.getMenus()
                return true
            } catch (error) {
                this.user = null
                return false
            }
        },

        async logout() {
            try {
                await useHttp({
                    url: '/logout',
                    method: 'post'
                })
            } catch (error: any) {
                console.log(error.code)
            } finally {
                this.removeLoginData()
            }
        },

        setLoginData(data: LoginResponse) {
            localStorage.setItem('access_token', data.access_token)
            this.token = {
                access_token: data.access_token
            }
        },

        removeLoginData() {
            localStorage.removeItem('access_token')
            this.token = null
            this.user = null
        }
    }
})
