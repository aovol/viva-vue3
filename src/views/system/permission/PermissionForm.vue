<template>
    <t-dialog
        v-model:visible="visible"
        :footer="false"
        @closed="onClosed"
        :header="`${permissionForm.id ? '编辑' : '添加'}权限`"
        width="400px"
    >
        <t-form
            ref="form"
            :rules="rules"
            :data="permissionForm"
            :colon="true"
            @reset="onReset"
            @submit="onSubmit"
            label-align="top"
        >
            <t-form-item label="权限分组" name="group_name">
                <t-select
                    v-model="permissionForm.group_name"
                    clearable
                    filterable
                    placeholder="单选支持自定义创建"
                    :options="groups"
                    style="width: 400px"
                />
            </t-form-item>
            <t-form-item label="角色类型" name="guard_name">
                <t-select
                    v-model="permissionForm.guard_name"
                    placeholder="请选择角色类型"
                    clearable
                >
                    <t-option value="admin" label="管理员"></t-option>
                    <t-option value="user" label="用户"></t-option>
                </t-select>
            </t-form-item>
            <t-form-item label="权限名称" name="name">
                <t-input
                    v-model="permissionForm.name"
                    placeholder="请输入内容"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="权限标识" name="slug">
                <t-input
                    v-model="permissionForm.slug"
                    placeholder="请输入权限标识"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="请求路径" name="path">
                <div class="grid grid-cols-2 gap-2">
                    <t-select
                        v-model="permissionForm.controller"
                        placeholder="请选择"
                        filterable
                        @change="onControllerChange"
                    >
                        <t-option-group
                            v-for="(controllerList, index) in controllers"
                            :key="index"
                            :label="index"
                            divider
                        >
                            <t-option
                                v-for="(methods, controller) in controllerList"
                                :key="controller"
                                :value="controller"
                                :label="index"
                            >
                                {{ controller }}
                            </t-option>
                        </t-option-group>
                    </t-select>

                    <t-select
                        v-model="permissionForm.method"
                        placeholder="请选择"
                        filterable
                        @change="onControllerChange"
                    >
                        <t-option
                            v-for="method in (controllers as any)[permissionForm.controller] || []"
                            :key="method"
                            :value="method"
                            :label="method"
                        >
                            {{ permissionForm.controller }}/{{ method }}
                        </t-option>
                    </t-select>
                </div>
            </t-form-item>

            <t-form-item>
                <t-button
                    block
                    theme="primary"
                    type="submit"
                    :loading="appStore.isLoading('/system/permission/create')"
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
    import type { Controllers, Permission, PermissionGroup } from '@/types/role-permission'
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
    const permissionForm = reactive({
        id: 0,
        name: '',
        guard_name: 'admin',
        slug: '',
        group_name: '',
        description: '',
        controller: '',
        method: ''
    })
    const form = ref<FormInstanceFunctions<typeof permissionForm>>()
    const props = defineProps<{
        groups: PermissionGroup[]
        controllers: Controllers
    }>()
    const show = (row?: Permission) => {
        visible.value = true
        if (row) {
            permissionForm.id = row.id
            permissionForm.name = row.name
            permissionForm.guard_name = row.guard_name
            permissionForm.slug = row.slug
            permissionForm.group_name = row.group_name
            permissionForm.description = row.description || ''
            permissionForm.controller = row.controller
            permissionForm.method = row.method
        }
    }

    defineExpose({ show })

    const resetForm = () => {
        permissionForm.id = 0
        permissionForm.name = ''
        permissionForm.guard_name = 'admin'
        permissionForm.slug = ''
        permissionForm.group_name = ''
        permissionForm.description = ''
        permissionForm.controller = ''
        permissionForm.method = ''
        form.value?.reset()
    }
    const onReset: FormProps['onReset'] = () => {
        resetForm()
    }
    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!(validateResult === true)) return
        useHttp({
            url: permissionForm.id ? '/system/permission/update' : '/system/permission/create',
            method: 'POST',
            data: permissionForm
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

    const onControllerChange = (val: string) => {
        const allController = props.controllers.admin
        console.log('所有控制器:', allController)
    }
</script>
