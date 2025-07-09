<template>
    <t-submenu :value="menu.path" v-if="menu.children && menu.children.length > 0">
        <template #icon>
            <t-icon name="control-platform" />
        </template>
        <template #title>
            <span>{{ menu.name }}</span>
        </template>
        <template v-for="item in menu.children" :key="item.id">
            <SubMenu v-if="item.children && item.children.length > 0" :menu="item" />
            <MenuItem v-else :menu="item" />
        </template>
    </t-submenu>
</template>
<script lang="ts" setup>
    import type { Menu } from '@/types/menu'
    import MenuItem from './MenuItem.vue'
    defineProps<{
        menu: Menu
    }>()
</script>
