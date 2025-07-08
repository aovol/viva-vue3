<template>
    <div class="h-screen flex items-center justify-center">
        <div class="bg-white p-8 rounded-lg shadow-lg" style="width: 320px">
            <div class="flex justify-center items-center mt-4">
                <img src="@/assets/vue.svg" alt="" />
                <span class="ml-2 font-bold">V-Admin</span>
            </div>
            <div class="text-center mb-6 font-bold mt-4">登录到管理中心</div>
            <t-form
                ref="form"
                :data="formData"
                :colon="true"
                :label-width="0"
                @reset="onReset"
                @submit="onSubmit"
            >
                <t-form-item name="username">
                    <t-input v-model="formData.username" clearable placeholder="请输入用户名">
                        <template #prefix-icon>
                            <desktop-icon />
                        </template>
                    </t-input>
                </t-form-item>

                <t-form-item name="password">
                    <t-input
                        v-model="formData.password"
                        type="password"
                        clearable
                        placeholder="请输入密码"
                    >
                        <template #prefix-icon>
                            <lock-on-icon />
                        </template>
                    </t-input>
                </t-form-item>

                <t-form-item>
                    <t-button
                        theme="primary"
                        type="submit"
                        block
                        :loading="appStore.isLoading('/admin/auth/login')"
                        >登录</t-button
                    >
                </t-form-item>
            </t-form>
        </div>
    </div>
</template>
<script lang="ts" setup>
    import { reactive } from 'vue'
    import { MessagePlugin, type FormProps } from 'tdesign-vue-next'
    import { DesktopIcon, LockOnIcon } from 'tdesign-icons-vue-next'
    import { useAppStore } from '@/store/useAppStore'
    import { useUserStore } from '@/store/useUserStore'
    import type { LoginData } from '@/types/user'
    import { useRouter } from 'vue-router'
    const router = useRouter()
    const userStore = useUserStore()
    const appStore = useAppStore()
    const formData = reactive<LoginData>({
        username: 'admin',
        password: '123456'
    })
    const onReset: FormProps['onReset'] = () => {
        MessagePlugin.success('重置成功')
    }
    const onSubmit: FormProps['onSubmit'] = async ({ validateResult, firstError }) => {
        if (validateResult === true) {
            await userStore.login(formData)
            router.push('/')
        } else {
            console.log('Validate Errors: ', firstError, validateResult)
            MessagePlugin.warning(firstError ?? '')
        }
    }
</script>
