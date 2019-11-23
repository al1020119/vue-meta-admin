<template>
  <el-tabs v-model="activeName" @tab-click="handleClick">
    <el-tab-pane label="数据库" name="first">数据库</el-tab-pane>
    <el-tab-pane label="数据仓库" name="second">数据仓库</el-tab-pane>
    <el-tab-pane label="数据缓存" name="third">数据缓存</el-tab-pane>
    <el-tab-pane label="消息队列" name="fourth">消息队列</el-tab-pane>
    <el-tab-pane label="NoSQL" name="five">NoSQL</el-tab-pane>
  </el-tabs>
</template>
<script>
export default {
    name: 'metaIndex',
    data() {
      return {
        activeName: 'second'
      };
    },
    methods: {
      handleClick(tab, event) {
        console.log(tab, event);
      }
    }
}
</script>
<style scoped>

</style>