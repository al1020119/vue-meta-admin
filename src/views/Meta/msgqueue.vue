<template>
    <div>消息队列</div>
</template>
<script>
import { getToken } from '@/api/services/cookie.js'
export default {
    name: 'metaMsgqueue',
    setup(props) {
        
    },
    mounted() {
        if(!getToken()) {
            // 页面路由跳转
            this.$router.push({name:"Login"});
        }
    },
}
</script>
<style scoped>

</style>