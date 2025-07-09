<template>
    <t-menu-item :value="menu.path">
        <template #icon>
            <t-icon :name="`server`" />
        </template>
        {{ menu.name }}
    </t-menu-item>
</template>

<script lang="ts" setup>
    import type { Menu } from '@/types/menu'

    defineProps<{
        menu: Menu
    }>()
</script>
