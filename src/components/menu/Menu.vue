<template>
    <t-menu
        v-model:expanded="expandedKeys"
        v-model:value="activeMenu"
        height="100%"
        :collapsed="collapsed"
        width="100%"
        @change="handleChange"
        @expand="handleExpand"
    >
        <template v-for="node in nodeStore.nodes" :key="node.id">
            <template v-if="node.type === 'menu'">
                <SubMenu v-if="node?.children && node?.children?.length > 0" :node="node" />
                <MenuItem v-else :node="node" />
            </template>
        </template>
    </t-menu>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue'
    import type { MenuProps } from 'tdesign-vue-next'
    import { useNodeStore } from '@/store/useNodeStore'
    import MenuItem from './MenuItem.vue'
    import SubMenu from './SubMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()
    const route = useRoute()
    const expandedKeys = ref<MenuProps['expanded']>([])
    watch(
        () => route.path,
        () => {
            const parentPath = route.path.split('/').slice(0, -1).join('/')

            if (parentPath) {
                expandedKeys.value = [parentPath]
            }
        },
        {
            immediate: true
        }
    )

    const nodeStore = useNodeStore()
    const collapsed = ref(false)

    const activeMenu = ref(route.path)
    const handleChange = (value: string) => {
        activeMenu.value = value
        router.push(value)
    }
    const handleExpand = (value: string) => {}
</script>
