<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 视图区域 -->
    <el-card> </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 权限列表
      rightsList: [],
    }
  },

  // 生命周期函数
  created() {
    // 获取所有权限列表
    this.getRightsList()
  },

  methods: {
    async getRightsList() {
      const { data: res } = await this.$http.get('rights/list')
      // console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error('权限列表获取失败')
      }

      this.$message.success("权限数据列表获取成功")

      this.rightsList = res.data

      console.log(this.rightsList);
    },
  },
}
</script>

<style scoped>
</style>