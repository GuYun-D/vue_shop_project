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

      <!-- tabs标签页 -->
      <!-- 
          v-model：将当前激活的tab标签页名称绑定到数据中
          tab-click：tabs切换时触发
       -->
      <el-tabs v-model="activeName" type="card" @tab-click="handleTabClick">
        <el-tab-pane label="动态参数" name="many">
          <el-button type="primary" size="mini" :disabled="isDisabled"
            >添加参数</el-button
          >
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button type="primary" size="mini" :disabled="isDisabled"
            >添加属性</el-button
          >
        </el-tab-pane>
      </el-tabs>
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

      // 默认显示第一个
      activeName: 'many',
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
      this.getParamsData()
    },

    async getParamsData() {
      // console.log(this.selectedOption);
      // 限制用户只能选择三级分类，利用selectedOption，三级数组长度为3，二级数组长度为2
      // 选择不是三级分类
      if (this.selectedOption.length !== 3) {
        this.selectedOption = []
        return this.$message.error('请选择三级分类')
      }

      // 选中三级分类
      console.log(this.selectedOption)

      // 根据所选的id，当前所处的面板进行发送请求
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes`,
        {
          params: { sel: this.activeName },
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('参数列表获取失败')
      }

      console.log(res.data)
    },

    // tab页签点击事件处理函数
    handleTabClick() {
      //   console.log(this.activeName)
      this.getParamsData()
    },
  },

  // 计算属性
  computed: {
    // 如果按钮需要被禁用返回true，反之false
    isDisabled() {
      // 关联selectedOption，监听用户是否选中三级分类
      if (this.selectedOption.length !== 3) {
        return true
      }

      return false
    },

    //当前选中的三级分类的id
    cateId() {
      if (this.selectedOption.length === 3) {
        return this.selectedOption[2]
      }

      return null
    },
  },
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}
</style>