<template>
    <div id="layout" :class="[menuStatus ? 'close' : 'open']">
        <LayoutMain />
        <LayoutNav />
        <LayoutHeader />
    </div>
</template>

<script>
// 引入新版体验版api
import { computed } from '@vue/composition-api';
// 头部布局
import LayoutHeader from './Components/Header'
// 主页面布局
import LayoutMain from './Components/Main'
// 左边导航布局
import LayoutNav from './Components/Nav'
// 组合引入：import { LayoutHeader, LayoutMain, LayoutNav } from './Components'
export default {
    name: 'layout',
    components: {LayoutHeader, LayoutMain, LayoutNav}, // 注册组件
    setup(props, { root }){
        const menuStatus = computed(() => root.$store.state.app.isCollapse);
        return {
            menuStatus
        }
    },
    mounted() {
        if(!getToken()) {
            // 页面路由跳转
            this.$router.push({name:"Login"});
        }
    },
}
</script>

<style lang="scss" scoped>

</style>