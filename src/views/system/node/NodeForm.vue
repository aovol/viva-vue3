<template>
    <t-dialog
        v-model:visible="visible"
        :footer="false"
        @closed="onClosed"
        :header="`${menuForm.id ? '编辑' : '添加'}节点`"
    >
        <t-form ref="form" :rules="rules" :data="menuForm" :colon="true" @submit="onSubmit">
            <t-form-item label="父级节点" name="parent_id">
                <t-tree-select
                    filterable
                    clearable
                    v-model="menuForm.parent_id"
                    :tree-props="{
                        keys: {
                            label: 'name',
                            value: 'id',
                            children: 'children'
                        },
                        expandAll: true,
                        line: true
                    }"
                    :data="nodeStore.nodes"
                    placeholder="选择父级节点"
                />
            </t-form-item>
            <t-form-item label="节点类型" name="type">
                <template #help>
                    <span> 菜单既是路由，也是权限，权限仅用于权限控制 </span>
                </template>
                <t-radio-group
                    variant="primary-filled"
                    v-model="menuForm.type"
                    @change="onTypeChange"
                >
                    <t-radio-button value="menu">菜单</t-radio-button>
                    <t-radio-button value="permission">权限</t-radio-button>
                </t-radio-group>
            </t-form-item>
            <template v-if="menuForm.type === 'permission' && !menuForm.id">
                <div class="flex items-center justify-center w-full my-5">
                    <t-radio-group
                        variant="default-filled"
                        v-model="menuForm.create_type"
                        @change="onCreateTypeChange"
                    >
                        <t-radio-button value="single">单个添加</t-radio-button>
                        <t-radio-button value="batch">批量添加</t-radio-button>
                    </t-radio-group>
                </div>
            </template>

            <template v-if="menuForm.create_type === 'single'">
                <t-form-item label="名称" name="name">
                    <t-input
                        clearable
                        v-model="menuForm.name"
                        placeholder="请输入节点名称"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>

                <t-form-item label="标识" name="slug">
                    <t-input
                        clearable
                        v-model="menuForm.slug"
                        placeholder="请输入节点唯一标识"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>
                <template v-if="menuForm.type === 'permission'">
                    <t-form-item label="API" name="api">
                        <t-input
                            clearable
                            v-model="menuForm.api"
                            placeholder="请输入节点API"
                            @enter="onEnter"
                        ></t-input>
                    </t-form-item>
                </template>
            </template>
            <template v-if="menuForm.create_type === 'batch'">
                <t-form-item label="批量添加" name="batch_permissions">
                    <template #help>
                        <p>请输入批量添加的权限，每行一个</p>
                        <p>格式为：名称|标识|API，API为空则不添加</p>
                    </template>
                    <t-textarea
                        :autosize="{ minRows: 5 }"
                        clearable
                        v-model="menuForm.batch_permissions"
                        placeholder="请输入批量添加的权限"
                    ></t-textarea>
                </t-form-item>
            </template>

            <template v-if="menuForm.type === 'menu'">
                <t-form-item label="路由" name="path">
                    <t-input
                        clearable
                        v-model="menuForm.path"
                        placeholder="请输入节点路径"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>

                <t-form-item label="组件" name="component">
                    <t-input
                        clearable
                        v-model="menuForm.component"
                        placeholder="请输入节点组件"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>

                <t-form-item label="重定向" name="redirect">
                    <t-input
                        clearable
                        v-model="menuForm.redirect"
                        placeholder="请输入重定向路径"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>

                <t-form-item label="图标" name="icon">
                    <t-input
                        clearable
                        v-model="menuForm.icon"
                        placeholder="请输入节点图标"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>

                <t-form-item label="排序" name="sort">
                    <t-input
                        clearable
                        v-model="menuForm.sort"
                        placeholder="请输入排序"
                        @enter="onEnter"
                    ></t-input>
                </t-form-item>
                <t-form-item label="页面头部" name="show_page_head">
                    <t-switch v-model="menuForm.show_page_head">
                        <template #label="slotProps">{{
                            slotProps.value ? '显示' : '隐藏'
                        }}</template>
                    </t-switch>
                </t-form-item>
            </template>
            <t-form-item label="是否显示" name="is_show">
                <t-switch v-model="menuForm.is_show">
                    <template #label="slotProps">{{ slotProps.value ? '显示' : '隐藏' }}</template>
                </t-switch>
            </t-form-item>

            <t-form-item label="状态" name="status">
                <t-switch v-model="menuForm.status">
                    <template #label="slotProps">{{ slotProps.value ? '启用' : '禁用' }}</template>
                </t-switch>
            </t-form-item>

            <t-form-item>
                <t-space size="small">
                    <t-button
                        theme="primary"
                        type="submit"
                        :loading="appStore.isLoading('/menu/create')"
                        >提交</t-button
                    >
                    <t-button theme="default" variant="base" @click="onClosed">取消</t-button>
                </t-space>
            </t-form-item>
        </t-form>
    </t-dialog>
</template>

<script setup lang="ts">
    import { ref, reactive } from 'vue'
    import type { Node } from '@/types/node'
    import { type FormProps, type FormInstanceFunctions, type InputProps } from 'tdesign-vue-next'
    import useHttp from '@/utils/useHttp'
    import { useAppStore } from '@/store/useAppStore'
    import { useNodeStore } from '@/store/useNodeStore'
    const nodeStore = useNodeStore()
    const appStore = useAppStore()
    const visible = ref(false)
    const form = ref<FormInstanceFunctions | null>(null)
    const emit = defineEmits(['success'])
    //form
    const rules = {
        name: [
            {
                required: true,
                message: '请输入菜单名称'
            }
        ],
        slug: [
            {
                required: true,
                message: '请输入菜单标识'
            }
        ],
        path: [
            {
                required: true,
                message: '请输入菜单路由'
            }
        ]
    }
    const menuForm: Node = reactive({
        id: undefined,
        parent_id: undefined,
        name: '',
        slug: '',
        path: '',
        icon: '',
        component: '',
        redirect: '',
        sort: undefined,
        status: true,
        show_page_head: true,
        type: 'menu',
        is_show: true,
        api: '',
        create_type: 'single'
    })

    const resetMenuForm = () => {
        form.value?.reset()
        menuForm.id = undefined
        menuForm.parent_id = undefined
        menuForm.name = ''
        menuForm.slug = ''
        menuForm.path = ''
        menuForm.icon = ''
        menuForm.component = ''
        menuForm.redirect = ''
        menuForm.sort = undefined
        menuForm.status = true
        menuForm.show_page_head = true
        menuForm.type = 'menu'
        menuForm.is_show = true
        menuForm.api = ''
        menuForm.create_type = 'single'
    }

    const show = (node?: Node) => {
        if (node) {
            menuForm.id = node.id
            menuForm.parent_id = node.parent_id
            menuForm.name = node.name
            menuForm.slug = node.slug
            menuForm.path = node.path
            menuForm.icon = node.icon
            menuForm.component = node.component
            menuForm.redirect = node.redirect
            menuForm.sort = node.sort
            menuForm.status = node.status ?? true
            menuForm.show_page_head = node.show_page_head ?? true
            menuForm.type = node.type
            menuForm.is_show = node.is_show ?? false
            menuForm.api = node.api ?? ''
        }
        visible.value = true
    }
    defineExpose({
        show
    })

    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!(validateResult === true)) return
        const url = menuForm.id ? '/system/node/update' : '/system/node/create'
        useHttp({
            url,
            method: 'post',
            data: menuForm
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
        resetMenuForm()
    }

    const onTypeChange = (value: string) => {
        // if (value === 'menu') {
        //     menuForm.create_type = 'single'
        //     menuForm.batch_permissions = ''
        //     menuForm.api = ''
        //     menuForm.show_page_head = true
        //     menuForm.is_show = true
        // } else {
        //     menuForm.slug = ''
        //     menuForm.path = ''
        //     menuForm.component = ''
        //     menuForm.redirect = ''
        //     menuForm.sort = undefined
        //     menuForm.show_page_head = true
        //     menuForm.is_show = false
        // }
    }

    const onCreateTypeChange = (value: string) => {
        // if (value === 'batch') {
        //     menuForm.name = ''
        //     menuForm.slug = ''
        // } else {
        //     menuForm.batch_permissions = ''
        // }
    }
</script>
