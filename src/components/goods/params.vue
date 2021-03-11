<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>分类参数</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图 -->
    <el-card>
      <!-- 头部警告 -->
      <el-alert
        title="注意：只允许为第三级分类设置相关参数"
        type="warning"
        :closable="false"
        show-icon
      ></el-alert>

      <!-- 选择商品分类 -->
      <el-row class="cat_opt">
        <el-col>
          <span>选择商品分类：</span>
          <!-- 级联选择框 -->
          <!-- 
              options: 数据源
           -->
          <el-cascader
            expandTrigger="hover"
            :options="cateList"
            :props="cateProps"
            @change="handleChange"
            v-model="selectedOption"
          ></el-cascader>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 商品分类数据
      cateList: [],

      //   级联选择框的配置对象
      cateProps: {
        // 选中的值
        value: 'cat_id',
        // 看到的值
        label: 'cat_name',
        // 父子嵌套
        children: 'children',
      },

      // 级联选择框双向绑定到的数据
      selectedOption: [],
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('商品列表获取失败')
      }

      this.cateList = res.data
      //   console.log(this.cateList)
    },

    // 級聯選擇框選中項變化，會觸發此函數
    handleChange() {
        // console.log(this.selectedOption);
        // 限制用户只能选择三级分类，利用selectedOption，三级数组长度为3，二级数组长度为2
        // 选择不是三级分类
        if(this.selectedOption.length !== 3){
            this.selectedOption = []
            return this.$message.error("请选择三级分类")
        }

        // 选中三级分类
        console.log(this.selectedOption);
    },
  },
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
</style>