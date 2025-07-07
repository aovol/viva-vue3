<template>
    <div class="flex app-layout h-full relative overflow-hidden">
        <Aside />
        <div
            class="flex flex-col flex-1 absolute top-0 overflow-x-hidden right-0 bottom-0 transition-all ease-in-out duration-300"
            style="left: 210px"
        >
            <Header />
            <div class="flex-1 flex flex-col overflow-hidden">
                <div
                    class="page-head flex items-center justify-between bg-white h-12 p-4 border-b border-gray-100"
                >
                    <div class="text-base font-bold">控制台</div>
                </div>
                <div
                    class="relative overflow-auto overflow-x-hidden main-content p-4"
                    style="flex-grow: 1; flex-basis: 0px"
                >
                    <router-view />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import Aside from './Aside.vue'
    import Header from './Header.vue'
</script>
