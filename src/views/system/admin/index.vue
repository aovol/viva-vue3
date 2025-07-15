<template>
    <t-space direction="vertical">
        <!-- 按钮操作区域 -->
        <t-button @click="adminFormRef?.show()">添加管理员</t-button>

        <div class="bg-white px-4">
            <t-table
                disable-data-page
                hover
                row-key="index"
                :data="admins.items"
                :columns="columns"
                stripe
                :pagination="pagination"
                cell-empty-content="-"
            >
            </t-table>
        </div>

        <AdminForm ref="adminFormRef" @success="getAdmins" />
    </t-space>
</template>

<script lang="tsx" setup>
    import { reactive, ref, onMounted } from 'vue'
    import type { TableProps } from 'tdesign-vue-next'

    import AdminForm from './AdminForm.vue'
    import useHttp from '@/utils/useHttp'
    import type { PaginationResponse } from '@/types/http'
    import type { Admin } from '@/types/admin'
    import { identity, pickBy } from 'lodash-es'
    const params = reactive({
        guard: 'admin'
    })
    const adminFormRef = ref<InstanceType<typeof AdminForm>>()

    const admins = reactive<PaginationResponse<Admin>>({
        items: [],
        total: 0
    })

    const columns = ref<TableProps['columns']>([
        {
            colKey: 'name',
            title: '管理员名称',
            width: '200'
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
                            onClick={() => adminFormRef.value?.show(row as Admin)}
                        >
                            编辑
                        </t-button>
                        <t-popconfirm
                            v-model:visible={row.visible}
                            content="确认删除吗"
                            onConfirm={() => onDeleteConfirm(row as Admin)}
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

    const onDeleteConfirm = (row: Admin) => {
        row.loading = true
        useHttp({
            url: '/system/admin/delete',
            method: 'post',
            data: {
                id: row.id
            }
        })
            .then(_ => {
                row.visible = false
                getAdmins()
            })
            .finally(() => {
                row.loading = false
            })
    }
    const pagination: TableProps['pagination'] = {
        defaultCurrent: 1,
        defaultPageSize: 5,
        total: admins.total
    }

    const getAdmins = () => {
        useHttp<PaginationResponse<Admin>>({
            url: '/system/admin',
            method: 'get',
            params: pickBy(params, identity)
        }).then(res => {
            admins.items = res.data.items
            admins.total = res.data.total
        })
    }

    onMounted(() => {
        getAdmins()
    })
</script>
