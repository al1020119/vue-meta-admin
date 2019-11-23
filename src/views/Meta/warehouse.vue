<template>
    <div>数据仓库</div>
</template>
<script>
export default {
    name: 'metaWarehouse',
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