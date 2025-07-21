<template>
    <t-dialog
        v-model:visible="visible"
        :footer="false"
        @closed="onClosed"
        :header="`${adminForm.id ? '编辑' : '添加'}管理员`"
    >
        <t-form
            ref="form"
            :rules="rules"
            :data="adminForm"
            :colon="true"
            @reset="onReset"
            @submit="onSubmit"
        >
            <t-form-item label="姓名" name="name">
                <t-input
                    v-model="adminForm.name"
                    placeholder="请输入内容"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>
            <t-form-item label="角色" name="role_slugs">
                <t-select v-model="adminForm.role_slugs" placeholder="请选择角色" multiple>
                    <t-option label="全选" :check-all="true" />
                    <t-option
                        v-for="role in roles"
                        :key="role.id"
                        :value="role.slug"
                        :label="role.name"
                    >
                        {{ role.name }}
                    </t-option>
                </t-select>
            </t-form-item>
            <t-form-item label="密码" name="password">
                <t-input
                    v-model="adminForm.password"
                    placeholder="请输入内容"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>
            <t-form-item label="确认密码" name="password_confirmation">
                <t-input
                    v-model="adminForm.password_confirmation"
                    placeholder="请输入内容"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>
            <t-form-item>
                <t-space size="small">
                    <t-button
                        theme="primary"
                        type="submit"
                        :loading="
                            appStore.isLoading('/system/admin/create') ||
                            appStore.isLoading('/system/admin/update')
                        "
                        >提交</t-button
                    >
                    <t-button theme="default" variant="base" type="reset">重置</t-button>
                </t-space>
            </t-form-item>
        </t-form>
    </t-dialog>
</template>
<script lang="ts" setup>
    import { ref, reactive, onMounted } from 'vue'
    import { type FormProps, type FormInstanceFunctions, type InputProps } from 'tdesign-vue-next'
    import type { Admin } from '@/types/admin'
    import useHttp from '@/utils/useHttp'
    import type { Role } from '@/types/role-permission'
    import { useAppStore } from '@/store/useAppStore'
    const appStore = useAppStore()
    const rules: FormProps['rules'] = {
        name: [
            {
                required: true,
                message: '请输入用户名'
            }
        ]
    }
    const visible = ref(false)
    const emit = defineEmits(['success'])
    const adminForm = reactive<Admin>({
        id: 0,
        name: '',
        password: '',
        password_confirmation: '',
        role_slugs: []
    })
    const form = ref<FormInstanceFunctions<typeof adminForm>>()

    const show = (row?: Admin) => {
        visible.value = true
        if (row) {
            adminForm.id = row.id
            adminForm.name = row.name
            adminForm.role_slugs = row.role_slugs || []
        }
    }

    defineExpose({ show })

    const resetForm = () => {
        adminForm.id = 0
        adminForm.name = ''
        adminForm.password = ''
        adminForm.password_confirmation = ''
        adminForm.role_slugs = []
        form.value?.reset()
    }
    const onReset: FormProps['onReset'] = () => {
        resetForm()
    }
    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!(validateResult === true)) return
        useHttp({
            url: adminForm.id ? '/system/admin/update' : '/system/admin/create',
            method: adminForm.id ? 'PUT' : 'POST',
            data: adminForm
        }).then(_ => {
            onClosed()
            emit('success')
        })
    }

    const onEnter: InputProps['onEnter'] = (_, { e }) => {
        e.preventDefault()
    }

    const onClosed = () => {
        visible.value = false
        resetForm()
    }

    const roles = ref<Role[]>([])
    const getRoles = () => {
        useHttp<Role[]>({
            url: '/system/role',
            method: 'GET',
            params: { fetchAll: true }
        }).then(res => {
            roles.value = res.data
        })
    }

    onMounted(() => {
        getRoles()
    })
</script>
