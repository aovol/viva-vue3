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
        <template v-for="menu in menuStore.menus" :key="menu.id">
            <SubMenu v-if="menu.children && menu.children.length > 0" :menu="menu" />
            <MenuItem v-else :menu="menu" />
        </template>
    </t-menu>
</template>

<script lang="ts" setup>
    import { ref, watch } from 'vue'
    import type { MenuProps } from 'tdesign-vue-next'
    import { useMenuStore } from '@/store/useMenuStore'
    import MenuItem from './MenuItem.vue'
    import SubMenu from './SubMenu.vue'
    import { useRouter, useRoute } from 'vue-router'
    const router = useRouter()
    const route = useRoute()
    const expandedKeys = ref<MenuProps['expanded']>([])
    watch(
        () => route.path,
        () => {
            const parentPath = route.matched[route.matched.length - 2]?.path
            if (parentPath) {
                expandedKeys.value = [parentPath]
            }
        },
        {
            immediate: true
        }
    )

    const menuStore = useMenuStore()
    const collapsed = ref(false)

    const activeMenu = ref(route.path)
    const handleChange = (value: string) => {
        activeMenu.value = value
        router.push(value)
    }
    const handleExpand = (value: string) => {}
</script>
