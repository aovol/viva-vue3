<template>
    <t-drawer
        v-model:visible="visible"
        @close="onClosed"
        :header="`${roleForm.id ? '编辑' : '添加'}角色`"
        size="700px"
    >
        <t-form
            ref="form"
            :rules="rules"
            :data="roleForm"
            :colon="true"
            @reset="onReset"
            @submit="onSubmit"
            label-align="top"
        >
            <t-form-item label="角色名称" name="name">
                <t-input
                    v-model="roleForm.name"
                    placeholder="请输入内容"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>

            <t-form-item label="角色标识" name="slug">
                <t-input
                    v-model="roleForm.slug"
                    placeholder="请输入角色标识"
                    @enter="onEnter"
                ></t-input>
            </t-form-item>
            <t-form-item label="节点权限" name="node_ids">
                <NodeSelector v-model:nodes="roleForm.node_ids" />
            </t-form-item>
            <t-form-item>
                <t-button
                    block
                    theme="primary"
                    type="submit"
                    :loading="
                        appStore.isLoading('/system/role/create') ||
                        appStore.isLoading('/system/role/update')
                    "
                    >提交</t-button
                >
            </t-form-item>
        </t-form>
    </t-drawer>
</template>
<script lang="ts" setup>
    import { ref, reactive } from 'vue'
    import { type FormProps, type FormInstanceFunctions, type InputProps } from 'tdesign-vue-next'
    import useHttp from '@/utils/useHttp'
    import type { Role } from '@/types/role-permission'
    import { useAppStore } from '@/store/useAppStore'
    import NodeSelector from '../node/NodeSelector.vue'
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
        ]
    }
    const visible = ref(false)
    const emit = defineEmits(['success'])
    const roleForm = reactive<Role>({
        id: 0,
        name: '',
        slug: '',
        node_ids: []
    })
    const form = ref<FormInstanceFunctions<typeof roleForm>>()

    const show = (row?: Role) => {
        visible.value = true
        if (row) {
            roleForm.id = row.id
            roleForm.name = row.name
            roleForm.slug = row.slug
            roleForm.node_ids = row.node_ids || []
        }
    }

    defineExpose({ show })

    const resetForm = () => {
        roleForm.id = 0
        roleForm.name = ''
        roleForm.slug = ''
        roleForm.node_ids = []
        form.value?.reset()
    }
    const onReset: FormProps['onReset'] = () => {
        resetForm()
    }
    const onSubmit: FormProps['onSubmit'] = ({ validateResult }) => {
        if (!(validateResult === true)) return
        useHttp({
            url: roleForm.id ? '/system/role/update' : '/system/role/create',
            method: roleForm.id ? 'PUT' : 'POST',
            data: roleForm
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
</script>
