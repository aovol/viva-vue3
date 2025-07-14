<template>
    <t-space direction="vertical">
        <!-- 按钮操作区域 -->
        <t-button @click="adminFormRef?.show">添加管理员</t-button>

        <div class="bg-white px-4">
            <t-table
                hover
                row-key="index"
                :data="admins.items"
                :columns="columns"
                stripe
                :pagination="pagination"
                cell-empty-content="-"
                resizable
                lazy-load
            >
            </t-table>
        </div>

        <AdminForm ref="adminFormRef" @success="getAdmins" />
    </t-space>
</template>

<script lang="tsx" setup>
    import { reactive, ref, onMounted } from 'vue'
    import type { TableProps } from 'tdesign-vue-next'
    import {
        ErrorCircleFilledIcon,
        CheckCircleFilledIcon,
        CloseCircleFilledIcon
    } from 'tdesign-icons-vue-next'
    import AdminForm from './AdminForm.vue'
    import useHttp from '@/utils/useHttp'
    import type { PaginationResponse } from '@/types/http'
    import type { Admin } from '@/types/admin'
    import { identity, pickBy } from 'lodash-es'
    const params = reactive({
        guard: 'admin'
    })
    const adminFormRef = ref<InstanceType<typeof AdminForm>>()
    const statusNameListMap = {
        0: {
            label: '审批通过',
            theme: 'success',
            icon: <CheckCircleFilledIcon />
        },
        1: {
            label: '审批失败',
            theme: 'danger',
            icon: <CloseCircleFilledIcon />
        },
        2: {
            label: '审批过期',
            theme: 'warning',
            icon: <ErrorCircleFilledIcon />
        }
    }
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
            cell: (h, { row }) => {
                return (
                    <t-space>
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
                            onVisibleChange={onVisibleChange(row as Admin)}
                            confirmBtn={confirmBtn}
                        >
                            <t-link variant="text" hover="color" theme="danger">
                                删除
                            </t-link>
                        </t-popconfirm>

                        <pre>{JSON.stringify(row)}</pre>
                    </t-space>
                )
            }
        }
    ])

    const onVisibleChange = (row: Admin) => (val: boolean, context: any) => {
        row.visible = true
        console.log('onVisibleChange', row)
        console.log('context', context)
    }

    const confirmBtn = () => {
        return <t-button>btn123</t-button>
    }

    const onDeleteConfirm = (row: Admin) => {
        return new Promise((resolve, reject) => {
            reject(false)
        })
        row.visible = true
        // useHttp({
        //     url: '/system/admin',
        //     method: 'delete',
        //     data: {
        //         id: row.id
        //     }
        // }).then(_ => {
        //     getAdmins()
        // })
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
