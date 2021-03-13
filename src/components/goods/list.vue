<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容">
            <el-button slot="append" icon="el-icon-search"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary">添加商品</el-button>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        // 搜索关键字
        query: '',
        // 当前页码
        pagenum: 1,
        // 每页显示条数
        pagesize: 10,
      },

      // 商品列表數據
      goodslist: [],

      // 縂數據條數
      total: 0
    }
  },

  created() {
    // 获取商品列表数据
    this.getGoodsList()
  },

  methods: {
    // 根据分页获取商品列表数据
    async getGoodsList() {
      const { data: res } = await this.$http.get('goods', {
        params: this.queryInfo,
      })

      console.log('商品列表数据')
      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('获取商品列表失败')
      }

      this.$message.success('获取商品列表成功')

      this.goodslist = res.data.goods

      this.total = res.data.total
    },
  },
}
</script>

<style scoped>
</style>