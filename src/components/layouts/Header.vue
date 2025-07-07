<template>
    <div class="header border-b border-gray-100 bg-white">
        <t-head-menu v-model="menu1Value" theme="light" @change="changeHandler">
            <template #logo>
                <img
                    class="h-7"
                    src="https://tdesign.gtimg.com/site/baseLogo-light.png"
                    alt="logo"
                />
            </template>
            <t-menu-item value="item1"> 菜单1 </t-menu-item>
            <t-menu-item value="item2"> 菜单2 </t-menu-item>
            <t-menu-item value="item4" :disabled="true"> 禁用菜单 </t-menu-item>
            <template #operations>
                <t-button variant="text" shape="square">
                    <template #icon><t-icon name="search" /></template>
                </t-button>
                <t-button variant="text" shape="square">
                    <template #icon><t-icon name="mail" /></template>
                </t-button>
                <t-button variant="text" shape="square">
                    <template #icon><t-icon name="user" /></template>
                </t-button>
                <t-button variant="text" shape="square">
                    <template #icon><t-icon name="ellipsis" /></template>
                </t-button>
                <t-dropdown trigger="click" :options="options" :min-column-width="88">
                    <t-button variant="text" shape="square">
                        <t-avatar image="https://tdesign.gtimg.com/site/avatar.jpg" />
                    </t-button>
                </t-dropdown>
            </template>
        </t-head-menu>
    </div>
</template>

<script lang="ts" setup>
    import { ref } from 'vue'
    import type { HeadMenuProps } from 'tdesign-vue-next'
    import { useUserStore } from '@/store/useUserStore'
    import { useRouter } from 'vue-router'
    const userStore = useUserStore()
    const router = useRouter()
    const menu1Value = ref('item2')
    const changeHandler: HeadMenuProps['onChange'] = active => {
        console.log('change', active)
    }

    const options = [
        {
            content: '个人中心',
            value: 1,
            onClick: () => {
                router.push('/user/info')
            }
        },
        {
            content: '修改密码',
            value: 2,
            onClick: () => {
                router.push('/user/password')
            }
        },
        {
            content: '退出登录',
            value: 4,
            onClick: () => {
                userStore.logout()
                router.push('/login')
            }
        }
    ]
</script>

<!-- <style lang="less" scoped>
    .t-menu__operations {
        .t-button {
            margin-left: 8px;
        }
    }
    .t-demo-menu--dark {
        .t-button {
            color: #fff;
            &:hover {
                background-color: #4b4b4b;
                border-color: transparent;
                --ripple-color: #383838;
            }
        }
    }
</style> -->
