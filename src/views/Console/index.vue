<template>
  <div>
    <el-row :gutter="40">
        <el-col :span="8">
            <el-card shadow="always">
                汇总元数据
            </el-card>
        </el-col>
        <el-col :span="8">
            <el-card shadow="always">
                最近访问
            </el-card>
        </el-col>
        <el-col :span="8">
            <el-card shadow="always">
                最新更新
            </el-card>
        </el-col>
    </el-row>
  </div>
</template>

<script>
import { getToken } from '@/api/services/cookie.js'
export default {
    name: 'consoleIndex',
    mounted() {
        if(!getToken()) {
            // 页面路由跳转
            this.$router.push({name:"Login"});
        }
    },
}
</script>

<style lang="scss" scoped>
.el-card {
    height: 200px;
}
</style>