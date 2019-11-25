<template>
    <div>Text</div>
</template>
<script>
import { getToken } from '@/api/services/cookie.js'
export default {
    name: 'metaDatatext',
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