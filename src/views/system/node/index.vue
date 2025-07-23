<template>
    <div class="space-y-4">
        <div class="flex items-center gap-4">
            <t-button @click="nodeFormRef?.show()">添加节点</t-button>
            <t-button theme="default" @click="toggleExpandAll">{{
                expandAll ? '收起全部' : '展开全部'
            }}</t-button>
        </div>
        <div class="p-4 bg-white">
            <t-enhanced-table
                disable-data-page
                ref="tableRef"
                row-key="id"
                drag-sort="row-handler"
                :data="nodeStore.nodes"
                :columns="columns"
                :tree="{ indent: 25, treeNodeColumnIndex: 1 }"
                :tree-expand-and-fold-icon="treeExpandIcon"
                :before-drag-sort="beforeDragSort"
                @abnormal-drag-sort="onAbnormalDragSort"
                @drag-sort="onDragSort"
                cell-empty-content="-"
            ></t-enhanced-table>
        </div>
        <NodeForm ref="nodeFormRef" @success="getNodes" />
    </div>
</template>
<script lang="tsx" setup>
    import { ref, computed, onMounted } from 'vue'
    import {
        EnhancedTable as TEnhancedTable,
        MessagePlugin,
        type EnhancedTableProps,
        type EnhancedTableInstanceFunctions,
        type ButtonProps
    } from 'tdesign-vue-next'
    import { ChevronRightIcon, ChevronDownIcon, MoveIcon } from 'tdesign-icons-vue-next'
    import NodeForm from './NodeForm.vue'
    import type { Node } from '@/types/node'
    import useHttp from '@/utils/useHttp'
    import { useClipboard } from '@vueuse/core'
    import { useNodeStore } from '@/store/useNodeStore'
    const nodeStore = useNodeStore()
    const expandAll = ref(true)
    const tableRef = ref<EnhancedTableInstanceFunctions | null>(null)
    const nodeFormRef = ref<InstanceType<typeof NodeForm> | null>(null)
    const { copy } = useClipboard()
    const columns: EnhancedTableProps['columns'] = [
        {
            // 列拖拽排序必要参数
            colKey: 'drag',
            title: '排序',
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cell: _ => <MoveIcon />,
            width: 60
        },

        {
            width: 240,
            colKey: 'name',
            title: '菜单名',
            cell: (_, { row }) => (
                <div class="flex items-center gap-2">
                    <t-icon name="menu" />
                    {row.name}
                </div>
            )
        },
        {
            colKey: 'type',
            title: '类型',
            width: 100,
            cell: (_, { row }) => (
                <t-tag theme={row.type === 'menu' ? 'primary' : 'default'}>
                    {row.type === 'menu' ? '菜单' : '权限'}
                </t-tag>
            )
        },
        {
            colKey: 'path',
            title: 'API/路由',
            width: 200,
            cell: (_, { row }) => (
                <div class="flex items-center gap-2 group">
                    <span>{row.path}</span>
                    <span class="hidden group-hover:block">
                        <t-icon
                            name="copy"
                            class="cursor-pointer "
                            onClick={() =>
                                copy(row.path).then(() => MessagePlugin.success('标识复制成功'))
                            }
                        />
                    </span>
                </div>
            )
        },

        {
            colKey: 'component',
            title: '组件',
            width: 200,
            cell: (_, { row }) => <t-link>{row.component || '-'}</t-link>
        },
        {
            colKey: 'redirect',
            title: '重定向',
            width: 200,
            cell: (_, { row }) => <t-link>{row.redirect || '-'}</t-link>
        },

        {
            colKey: 'method',
            title: '请求方法',
            width: 100,
            cell: (_, { row }) => <>{row.method || '-'}</>
        },
        {
            colKey: 'operate',
            title: '操作',
            // 增、删、改、查 等操作
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            cell: (_, { row }) => (
                <div class="flex items-center gap-2">
                    <t-link variant="text" hover="color" onClick={() => onEditClick(row)}>
                        编辑
                    </t-link>

                    <t-popconfirm content="确认删除吗" onConfirm={() => onDeleteConfirm(row)}>
                        <t-link variant="text" hover="color" theme="danger">
                            删除
                        </t-link>
                    </t-popconfirm>
                </div>
            )
        }
    ]
    // 编辑
    const onEditClick = (row: Node) => {
        nodeFormRef.value?.show(row)
    }
    // 删除
    const onDeleteConfirm = (row: Node) => {
        useHttp({
            url: '/system/node/delete',
            method: 'post',
            data: {
                nodeId: row.id
            }
        }).then(() => {
            getNodes()
        })
    }

    const treeExpandAndFoldIconRender: EnhancedTableProps['treeExpandAndFoldIcon'] = (
        h,
        { type, row }
    ) => {
        return type === 'expand' ? <ChevronRightIcon /> : <ChevronDownIcon />
    }

    const toggleExpandAll: ButtonProps['onClick'] = () => {
        expandAll.value = !expandAll.value
        expandAll.value ? tableRef.value?.expandAll() : tableRef.value?.foldAll()
    }

    const onAbnormalDragSort: EnhancedTableProps['onAbnormalDragSort'] = params => {
        console.log(params)
        // MessagePlugin.warning(params.reason);
        if (params.code === 1001) {
            MessagePlugin.warning('不同层级的元素，不允许调整顺序')
        }
    }

    const onDragSort: EnhancedTableProps['onDragSort'] = params => {
        console.log('onDragSort:', params)
    }

    const beforeDragSort: EnhancedTableProps['beforeDragSort'] = params => {
        console.log('beforeDragSort:', params)
        return true
    }
    const treeExpandIcon = computed<EnhancedTableProps['treeExpandAndFoldIcon']>(() => {
        return treeExpandAndFoldIconRender
    })
    const getNodes = async () => {
        await nodeStore.getNodes()
        tableRef.value?.expandAll()
    }
    onMounted(() => {
        tableRef.value?.expandAll()
    })
</script>
