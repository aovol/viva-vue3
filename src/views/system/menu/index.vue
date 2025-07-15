<template>
    <div class="space-y-4">
        <div class="flex items-center gap-4">
            <t-button @click="menuFormRef?.show()">添加菜单</t-button>
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
                :data="menuStore.menus"
                :columns="columns"
                :tree="{ indent: 25, treeNodeColumnIndex: 1 }"
                :tree-expand-and-fold-icon="treeExpandIcon"
                :before-drag-sort="beforeDragSort"
                @abnormal-drag-sort="onAbnormalDragSort"
                @drag-sort="onDragSort"
            ></t-enhanced-table>
        </div>
        <MenuForm ref="menuFormRef" @success="getMenus" />
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
    import { useMenuStore } from '@/store/useMenuStore'
    import MenuForm from './MenuForm.vue'
    import type { Menu } from '@/types/menu'
    import { nextTick } from 'vue'
    import useHttp from '@/utils/useHttp'
    const menuStore = useMenuStore()
    const expandAll = ref(true)
    const tableRef = ref<EnhancedTableInstanceFunctions | null>(null)
    const menuFormRef = ref<InstanceType<typeof MenuForm> | null>(null)

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
            colKey: 'slug',
            title: '标识',
            width: 200,
            cell: (_, { row }) => <t-link>{row.slug}</t-link>
        },
        {
            colKey: 'path',
            title: '路由',
            width: 200,
            cell: (_, { row }) => <t-link>{row.path}</t-link>
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
    const onEditClick = (row: Menu) => {
        menuFormRef.value?.show(row)
    }
    // 删除
    const onDeleteConfirm = (row: Menu) => {
        useHttp({
            url: '/system/menu/delete',
            method: 'post',
            data: {
                menuId: row.id
            }
        }).then(() => {
            menuStore.getMenus()
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
    const getMenus = async () => {
        await menuStore.getMenus()
        nextTick(() => tableRef.value?.expandAll())
    }
    onMounted(() => tableRef.value?.expandAll())
</script>
