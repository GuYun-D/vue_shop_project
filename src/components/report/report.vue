<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <h1>数据报表</h1>
    <h5>未开始学习echarts，此功能略过</h5>
  </div>
</template>

<script>

export default {
  data() {
    return {}
  },

  created() {},

}
</script>

<style scoped>
</style>