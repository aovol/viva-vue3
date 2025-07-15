<template>
    <div class="aside flex flex-col border-r border-secondary-light" style="width: 210px">
        <router-link
            to="/"
            class="flex justify-center items-center h-14 shrink-0 border-b border-secondary-light bg-white"
        >
            <img
                class="h-7 cursor-pointer"
                src="https://tdesign.gtimg.com/site/baseLogo-light.png"
                alt="logo"
            />
        </router-link>
        <Menu />
    </div>
</template>

<script lang="ts" setup>
    import Menu from '@/components/menu/Menu.vue'
</script>
