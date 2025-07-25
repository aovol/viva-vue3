<template>
    <t-space direction="vertical">
        <t-button @click="roleFormRef?.show()">添加角色</t-button>
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
                :data="roles.items"
                :columns="columns"
                stripe
                :pagination="{
                    defaultCurrent: 1,
                    defaultPageSize: 5,
                    total: roles.total
                }"
                cell-empty-content="-"
                lazy-load
            >
            </t-table>
        </div>

        <RoleForm ref="roleFormRef" @success="getRoles" />
    </t-space>
</template>

<script lang="tsx" setup>
    import { reactive, ref, onMounted } from 'vue'
    import type { TableProps } from 'tdesign-vue-next'

    import RoleForm from './RoleForm.vue'
    import useHttp from '@/utils/useHttp'
    import type { PaginationResponse } from '@/types/http'
    import type { Role } from '@/types/role-permission'
    import { identity, pickBy } from 'lodash-es'
    const params = reactive({
        guard: 'admin'
    })
    const roleFormRef = ref<InstanceType<typeof RoleForm>>()

    const roles = reactive<PaginationResponse<Role>>({
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
                            onClick={() => roleFormRef.value?.show(row as Role)}
                        >
                            编辑
                        </t-button>
                        <t-popconfirm
                            v-model:visible={row.visible}
                            content="确认删除吗"
                            onConfirm={() => onDeleteConfirm(row as Role)}
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

    const onDeleteConfirm = (row: Role) => {
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
                getRoles()
            })
            .finally(() => {
                row.loading = false
            })
    }

    const getRoles = () => {
        useHttp<PaginationResponse<Role>>({
            url: '/system/role',
            method: 'get',
            params: pickBy(params, identity)
        }).then(res => {
            roles.items = res.data.items
            roles.total = res.data.total
        })
    }

    onMounted(() => {
        getRoles()
    })
</script>
