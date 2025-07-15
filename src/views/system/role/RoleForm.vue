<template>
    <t-dialog
        v-model:visible="visible"
        :footer="false"
        @closed="onClosed"
        :header="`${roleForm.id ? '编辑' : '添加'}角色`"
        width="300px"
    >
        <t-form
            ref="form"
            :rules="rules"
            :data="roleForm"
            :colon="true"
            @reset="onReset"
            @submit="onSubmit"
            label-align="top"
        >
            <t-form-item label="角色类型" name="guard_name">
                <t-select v-model="roleForm.guard_name" placeholder="请选择角色类型" clearable>
                    <t-option value="admin" label="管理员"></t-option>
                    <t-option value="user" label="用户"></t-option>
                </t-select>
            </t-form-item>
            <t-form-item label="角色名称" name="name">
                <t-input
                    v-model="roleForm.name"
                    placeholder="请输入内容"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="角色标识" name="slug">
                <t-input
                    v-model="roleForm.slug"
                    placeholder="请输入角色标识"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>
            <t-form-item>
                <t-button
                    block
                    theme="primary"
                    type="submit"
                    :loading="appStore.isLoading('/system/role/create')"
                    >提交</t-button
                >
            </t-form-item>
        </t-form>
    </t-dialog>
</template>
<script lang="ts" setup>
    import { ref, reactive } from 'vue'
    import { type FormProps, type FormInstanceFunctions, type InputProps } from 'tdesign-vue-next'
    import useHttp from '@/utils/useHttp'
    import type { Role } from '@/types/role-permission'
    import { useAppStore } from '@/store/useAppStore'
    const appStore = useAppStore()
    const rules: FormProps['rules'] = {
        name: [
            {
                required: true,
                message: '请输入角色名称'
            }
        ],
        slug: [
            {
                required: true,
                message: '请输入角色标识'
            }
        ],
        guard_name: [
            {
                required: true,
                message: '请选择角色类型'
            }
        ]
    }
    const visible = ref(false)
    const emit = defineEmits(['success'])
    const roleForm = reactive({
        id: 0,
        name: '',
        guard_name: 'admin',
        slug: ''
    })
    const form = ref<FormInstanceFunctions<typeof roleForm>>()

    const show = (row?: Role) => {
        visible.value = true
        if (row) {
            roleForm.id = row.id
            roleForm.name = row.name
            roleForm.guard_name = row.guard_name
            roleForm.slug = row.slug
        }
    }

    defineExpose({ show })

    const resetForm = () => {
        roleForm.id = 0
        roleForm.name = ''
        roleForm.guard_name = 'admin'
        roleForm.slug = ''
        form.value?.reset()
    }
    const onReset: FormProps['onReset'] = () => {
        resetForm()
    }
    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!(validateResult === true)) return
        useHttp({
            url: roleForm.id ? '/system/role/update' : '/system/role/create',
            method: 'POST',
            data: roleForm
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
</script>
