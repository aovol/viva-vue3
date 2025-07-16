<template>
    <t-submenu
        :class="pKeys.includes(node.path) ? 'is-active' : ''"
        :value="node.path"
        v-if="node?.children && node?.children?.length > 0"
    >
        <template #icon>
            <t-icon name="control-platform" />
        </template>
        <template #title>
            <span>{{ node.name }}</span>
        </template>
        <template v-for="item in node?.children" :key="item.id">
            <SubMenu v-if="item.children && item.children.length > 0" :node="item" />
            <MenuItem v-else :node="item" />
        </template>
    </t-submenu>
</template>
<script lang="ts" setup>
    import type { Node } from '@/types/node'
    import MenuItem from './MenuItem.vue'
    import { useRoute } from 'vue-router'
    const route = useRoute()
    import { ref, watch } from 'vue'
    defineProps<{
        node: Node
    }>()

    const pKeys = ref<string[]>([])
    watch(
        () => route.path,
        () => {
            const parentPath = route.matched[route.matched.length - 2]?.path
            if (parentPath) {
                pKeys.value = [parentPath]
            }
        },
        {
            immediate: true
        }
    )
</script>
