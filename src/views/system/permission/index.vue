<template>
    <t-space direction="vertical">
        <t-button @click="permissionFormRef?.show()">添加权限</t-button>
        <div class="bg-white p-4">
            <div class="border-b-2 gap-3 border-secondary-light flex items-center">
                <div class="text-sm text-secondary pb-2">角色类型</div>
                <div
                    class="border-b-2 cursor-pointer pb-2"
                    style="margin-bottom: -2px"
                    :class="[
                        params.guard === 'admin'
                            ? 'text-primary border-primary font-bold'
                            : 'border-transparent'
                    ]"
                >
                    管理员
                </div>
                <div
                    class="border-b-2 cursor-auto pb-2"
                    style="margin-bottom: -2px"
                    :class="[
                        params.guard === 'user'
                            ? 'text-primary border-primary'
                            : 'border-transparent text-disabled'
                    ]"
                >
                    用户
                </div>
            </div>
            <t-table
                disable-data-page
                hover
                row-key="index"
                :data="permissions.items"
                :columns="columns"
                stripe
                :pagination="{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    total: permissions.total
                }"
                cell-empty-content="-"
                lazy-load
            >
            </t-table>
        </div>

        <PermissionForm ref="permissionFormRef" @success="getPermissions" :groups="groups" />
    </t-space>
</template>

<script lang="tsx" setup>
    import { reactive, ref, onMounted } from 'vue'
    import type { TableProps } from 'tdesign-vue-next'

    import PermissionForm from './PermissionForm.vue'
    import useHttp from '@/utils/useHttp'
    import type { PaginationResponse } from '@/types/http'
    import type { Permission, PermissionGroup } from '@/types/role-permission'
    import { identity, pickBy } from 'lodash-es'
    const params = reactive({
        guard: 'admin'
    })
    const permissionFormRef = ref<InstanceType<typeof PermissionForm>>()
    const groups = ref<PermissionGroup[]>([])
    const permissions = reactive<PaginationResponse<Permission>>({
        items: [],
        total: 0
    })

    const columns = ref<TableProps['columns']>([
        {
            colKey: 'name',
            title: '角色名称',
            width: '150'
        },
        {
            colKey: 'slug',
            title: '角色标识',
            width: '150'
        },
        {
            colKey: 'created_at',
            title: '创建时间',
            width: '150'
        },
        {
            colKey: 'actions',
            title: '操作',
            cell: (_, { row }) => {
                return (
                    <t-space size="small">
                        <t-button
                            theme="primary"
                            size="small"
                            onClick={() => permissionFormRef.value?.show(row as Permission)}
                        >
                            编辑
                        </t-button>
                        <t-popconfirm
                            v-model:visible={row.visible}
                            content="确认删除吗"
                            onConfirm={() => onDeleteConfirm(row as Permission)}
                            onVisibleChange={() => {
                                row.visible = true
                            }}
                            confirmBtn={{
                                size: 'small',
                                loading: row.loading,
                                content: '确认删除'
                            }}
                        >
                            <t-button size="small" variant="text" hover="color" theme="danger">
                                删除
                            </t-button>
                        </t-popconfirm>
                    </t-space>
                )
            }
        }
    ])

    const onDeleteConfirm = (row: Permission) => {
        row.loading = true
        useHttp({
            url: '/system/role/delete',
            method: 'post',
            data: {
                id: row.id
            }
        })
            .then(_ => {
                row.visible = false
                getPermissions()
            })
            .finally(() => {
                row.loading = false
            })
    }

    const getPermissions = () => {
        useHttp<PaginationResponse<Permission>>({
            url: '/system/permission',
            method: 'get',
            params: pickBy(params, identity)
        }).then(res => {
            permissions.items = res.data.items
            permissions.total = res.data.total
        })
    }

    const getGroups = () => {
        useHttp<PermissionGroup[]>({
            url: '/system/permission/groups',
            method: 'get'
        }).then(res => {
            groups.value = res.data
        })
    }
    onMounted(() => {
        getPermissions()
        getGroups()
    })
</script>
