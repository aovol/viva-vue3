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
                    class="page-head flex items-center justify-between bg-white h-12 p-4 border-b border-secondary-light"
                    v-if="showPageHead"
                >
                    <div class="font-bold">{{ route.meta.data?.name }}</div>
                </div>
                <div
                    class="relative overflow-auto overflow-x-hidden main-content p-4"
                    style="flex-grow: 1; flex-basis: 0px"
                >
                    <router-view v-slot="{ Component }">
                        <transition name="animation" mode="out-in">
                            <component :is="Component" />
                        </transition>
                    </router-view>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import { computed } from 'vue'
    import Aside from './Aside.vue'
    import Header from './Header.vue'
    import { useRoute } from 'vue-router'
    const route = useRoute()
    const showPageHead = computed(() => {
        return route.meta.data?.show_page_head || false
    })
</script>

<style lang="less" scoped>
    .animation-enter-active,
    .animation-leave-active {
        transition: all 0.3s ease-in-out;
    }

    // .animation-enter-from,
    // .animation-leave-to {
    //     transform: translateX(0px);
    //     opacity: 0;
    // }
    // .animation-enter-to,
    // .animation-leave-from {
    //     opacity: 1;
    // }
    // .animation-enter-active {
    //     transition: all 0.1s ease;
    // }
    // .animation-leave-active {
    //     transition: all 0.2s cubic-bezier(1, 0.6, 0.6, 1);
    // }
    // .arco-tabs-nav-type-line .arco-tabs-tab {
    //     margin: 0 16px 0 0;
    // }
</style>
