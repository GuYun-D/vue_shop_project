<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary">添加分类</el-button>
        </el-col>
      </el-row>

      <!-- 表格区域 -->
      <tree-table :data="cateList" :columns="columns" :selection-type="false">
      </tree-table>

      <!-- 分页区域 -->
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据列表
      cateList: [],

      //   获取商品分类数据的查询条件
      queryInfo: {
        type: 3,
        //   默认显示第几页
        pageNum: 1,
        // 每页显示几条数据
        pagesize: 5,
      },
      //   总数据条数
      total: 0,
      // 为table指定列的定义
      columns: [
        {
          label: '分类名称',
          prop: 'cat_name',
        },
      ],
    }
  },

  created() {
    this.getCataList()
  },

  methods: {
    //   获取商品分类数据列表
    async getCataList() {
      const { data: res } = await this.$http.get('categories', {
        params: this.queryInfo,
      })

      //   判断
      if (res.meta.status !== 200) {
        return this.$message.error('商品分类数据获取失败')
      }

      console.log(res.data)
      this.cateList = res.data
    },
  },
}
</script>

<style scoped>
</style>