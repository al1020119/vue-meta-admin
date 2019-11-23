<template>
    <div>NOSQL</div>
</template>
<script>
import { getToken } from '@/api/services/cookie.js'
export default {
    name: 'metaDatanosql',
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