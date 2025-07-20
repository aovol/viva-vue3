<template>
    <t-menu-item :value="node.path" v-if="node.type === 'menu'">
        {{ node.name }}
    </t-menu-item>
</template>

<script lang="ts" setup>
    import type { Node } from '@/types/node'

    defineProps<{
        node: Node
    }>()
</script>
