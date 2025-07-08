<template>
    <t-dialog
        v-model:visible="visible"
        :footer="false"
        @closed="onClosed"
        :header="`${menuForm.id ? '编辑' : '添加'}菜单`"
    >
        <!-- <template #header>
            <div class="flex items-center justify-between w-full border-b border-gray-100 pb-4">
                <span>{{ menuForm.id ? '编辑' : '添加' }}菜单</span>
                <t-icon name="close" @click="onClosed" />
            </div>
        </template> -->
        <t-form ref="form" :rules="rules" :data="menuForm" :colon="true" @submit="onSubmit">
            <t-form-item label="名称" name="name">
                <t-input
                    v-model="menuForm.name"
                    placeholder="请输入菜单名称"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="路由" name="path">
                <t-input
                    v-model="menuForm.path"
                    placeholder="请输入菜单路径"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="组件" name="component">
                <t-input
                    v-model="menuForm.component"
                    placeholder="请输入菜单组件"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="重定向" name="redirect">
                <t-input
                    v-model="menuForm.redirect"
                    placeholder="请输入重定向路径"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="排序" name="sort">
                <t-input
                    v-model="menuForm.sort"
                    placeholder="请输入排序"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="图标" name="icon">
                <t-input
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
                    <t-button theme="default" variant="base" type="reset">重置</t-button>
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
        name: '',
        path: '',
        icon: '',
        component: '',
        redirect: '',
        sort: undefined,
        status: false,
        show_page_head: false
    })

    const resetMenuForm = () => {
        form.value?.reset()
        menuForm.id = undefined
        menuForm.name = ''
        menuForm.path = ''
        menuForm.icon = ''
        menuForm.component = ''
        menuForm.redirect = ''
        menuForm.sort = undefined
        menuForm.status = false
        menuForm.show_page_head = false
    }

    const show = (menu?: Menu) => {
        if (menu) {
            menuForm.id = menu.id
            menuForm.name = menu.name
            menuForm.path = menu.path
            menuForm.icon = menu.icon
            menuForm.component = menu.component
            menuForm.redirect = menu.redirect
            menuForm.sort = menu.sort
            menuForm.status = menu.status
            menuForm.show_page_head = menu.show_page_head
        }
        visible.value = true
    }
    defineExpose({
        show
    })

    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!validateResult) return
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
        resetMenuForm()
        visible.value = false
    }
</script>
