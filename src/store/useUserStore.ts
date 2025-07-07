import { defineStore } from 'pinia'
import useHttp from '@/utils/useHttp'
import type { UserInfo, LoginData, LoginResponse } from '@/types/user'
export const useUserStore = defineStore('userStore', {
    state: () => {
        const token = localStorage.getItem('token')
        return {
            token: token || null,
            user: null as UserInfo | null
        }
    },
    getters: {
        isAuthenticated: state => !!state.user && !!state.token
    },
    actions: {
        async login(params: LoginData) {
            const res = await useHttp<LoginResponse>({
                url: '/auth/login',
                method: 'post',
                data: params
            })

            this.setLoginData(res.data)
            return res.data
        },

        async getUser() {
            try {
                const res = await useHttp<UserInfo>({
                    url: '/auth/user',
                    method: 'get'
                })
                this.user = res.data
                return true
            } catch (error) {
                this.user = null
                return false
            }
        },

        async logout() {
            try {
                await useHttp({
                    url: '/auth/logout',
                    method: 'post'
                })
            } catch (error: any) {
                console.log(error.code)
            } finally {
                this.removeLoginData()
            }
        },

        setLoginData(data: LoginResponse) {
            localStorage.setItem('token', data.token)
            this.token = data.token
        },

        removeLoginData() {
            localStorage.removeItem('token')
            this.token = null
            this.user = null
        }
    }
})
