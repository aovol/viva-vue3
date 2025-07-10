<template>
    <t-submenu
        :class="pKeys.includes(menu.path) ? 'is-active' : ''"
        :value="menu.path"
        v-if="menu.children && menu.children.length > 0"
    >
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
    import { useRoute } from 'vue-router'
    const route = useRoute()
    import { ref, watch } from 'vue'
    defineProps<{
        menu: Menu
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
