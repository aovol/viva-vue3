<template>
    <t-menu-item :value="node.path">
        <template #icon>
            <t-icon :name="`server`" />
        </template>
        {{ node.name }}
    </t-menu-item>
</template>

<script lang="ts" setup>
    import type { Node } from '@/types/node'

    defineProps<{
        node: Node
    }>()
</script>
