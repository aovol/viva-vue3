<template>
    <t-space direction="vertical" class="border border-secondary-light w-full py-4">
        <div class="flex justify-between px-4">
            <div class="">
                当前选中节点: <span class="text-primary">{{ checkedNodes.length }}</span> 个节点
            </div>
        </div>
        <div class="border-b border-secondary-light px-4">
            <t-input-adornment prepend="筛选:">
                <t-input v-model="demo1Text" @change="demo1Input" />
            </t-input-adornment>
        </div>
        <t-tree
            @check="updateNodes"
            v-model:value="checkedNodes"
            checkable
            ref="tree"
            :data="nodeStore.nodes"
            :filter="demo1Filter"
            hover
            line
            expand-all
            :keys="{ label: 'name', value: 'id' }"
        />
    </t-space>
</template>

<script lang="ts" setup>
    import { ref, computed } from 'vue'
    import type { TreeProps, InputProps } from 'tdesign-vue-next'
    import { useNodeStore } from '@/store/useNodeStore'
    const nodeStore = useNodeStore()
    const demo1Text = ref('')
    const demo1Filter = ref<TreeProps['filter']>(null as any)
    const props = defineProps<{
        nodes: number[]
    }>()

    const checkedNodes = computed({
        get: () => props.nodes,
        set: (value: number[]) => {
            emit('update:nodes', value)
        }
    })

    const demo1Input: InputProps['onChange'] = state => {
        console.info('demo1 input:', state)
        if (demo1Text.value) {
            // 存在过滤文案，才启用过滤
            demo1Filter.value = node => {
                return (node.data.name as string).indexOf(demo1Text.value) >= 0
            }
        } else {
            // 过滤文案为空，则还原 tree 为无过滤状态
            demo1Filter.value = null as any
        }
    }
    const emit = defineEmits(['update:nodes'])
    const updateNodes = (nodes: number[]) => {
        emit('update:nodes', nodes)
    }
</script>
