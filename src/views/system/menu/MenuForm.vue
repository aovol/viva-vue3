<template>
    <t-dialog
        v-model:visible="visible"
        :footer="false"
        @closed="onClosed"
        :header="`${menuForm.id ? '编辑' : '添加'}菜单`"
    >
        <t-form ref="form" :rules="rules" :data="menuForm" :colon="true" @submit="onSubmit">
            <t-form-item label="父级菜单" name="parent_id">
                <t-tree-select
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
                    :data="menuStore.menus"
                    placeholder="选择父级菜单"
                />
            </t-form-item>
            <t-form-item label="名称" name="name">
                <t-input
                    clearable
                    v-model="menuForm.name"
                    placeholder="请输入菜单名称"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="标识" name="slug">
                <t-input
                    clearable
                    v-model="menuForm.slug"
                    placeholder="请输入菜单唯一标识"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>
            <t-form-item label="路由" name="path">
                <t-input
                    clearable
                    v-model="menuForm.path"
                    placeholder="请输入菜单路径"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="组件" name="component">
                <t-input
                    clearable
                    v-model="menuForm.component"
                    placeholder="请输入菜单组件"
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

            <t-form-item label="排序" name="sort">
                <t-input
                    clearable
                    v-model="menuForm.sort"
                    placeholder="请输入排序"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="图标" name="icon">
                <t-input
                    clearable
                    v-model="menuForm.icon"
                    placeholder="请输入菜单图标"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="状态" name="status">
                <t-switch v-model="menuForm.status"></t-switch>
            </t-form-item>

            <t-form-item label="显示页面头部" name="show_page_head">
                <t-switch v-model="menuForm.show_page_head"></t-switch>
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
    import type { Menu } from '@/types/menu'
    import { type FormProps, type FormInstanceFunctions, type InputProps } from 'tdesign-vue-next'
    import useHttp from '@/utils/useHttp'
    import { useAppStore } from '@/store/useAppStore'
    import { useMenuStore } from '@/store/useMenuStore'
    const menuStore = useMenuStore()
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
        path: [
            {
                required: true,
                message: '请输入菜单路由'
            }
        ]
    }
    const menuForm: Menu = reactive({
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
        show_page_head: true
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
    }

    const show = (menu?: Menu) => {
        console.log('menu', menu)
        if (menu) {
            menuForm.id = menu.id
            menuForm.parent_id = menu.parent_id
            menuForm.name = menu.name
            menuForm.slug = menu.slug
            menuForm.path = menu.path
            menuForm.icon = menu.icon
            menuForm.component = menu.component
            menuForm.redirect = menu.redirect
            menuForm.sort = menu.sort
            menuForm.status = menu.status ?? true
            menuForm.show_page_head = menu.show_page_head ?? true
        }
        visible.value = true
    }
    defineExpose({
        show
    })

    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!(validateResult === true)) return
        const url = menuForm.id ? '/system/menu/update' : '/system/menu/create'
        useHttp({
            url,
            method: 'post',
            data: menuForm
        }).then(_ => {
            onClosed()
            emit('success')
        })
    }

    // 禁用 Input 组件，按下 Enter 键时，触发 submit 事件
    const onEnter: InputProps['onEnter'] = (_, { e }) => {
        e.preventDefault()
    }
    const onClosed = () => {
        visible.value = false
        resetMenuForm()
    }
</script>
