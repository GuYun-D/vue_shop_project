<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片视图区域 -->
    <el-card>
      <el-alert
        title="添加商品信息"
        type="info"
        center
        show-icon
        :closable="false"
      ></el-alert>
    </el-card>

    <!-- 步骤条区域 -->
    <el-steps
      :space="200"
      :active="activeIndex - 0"
      finish-status="success"
      align-center
    >
      <el-step title="基本信息"></el-step>
      <el-step title="商品参数"></el-step>
      <el-step title="商品属性"></el-step>
      <el-step title="商品图片"></el-step>
      <el-step title="商品内容"></el-step>
      <el-step title="完成"></el-step>
    </el-steps>

    <!-- tab栏区域 -->
    <!-- 
        tab-position:tab栏所在区域
     -->
    <!-- 
        tab栏与步骤条数据联动
        步骤条接收number类型，activeIndex - 0转为数字
        tab栏接受string类型
     -->
    <!-- 
         labe-position：label位置
      -->
    <!-- 
          五个tab栏的表单要同时提交，所以在五个的最外层添加表单控件
       -->
    <el-form
      :model="addForm"
      :rules="addFormRules"
      ref="ruleFormRef"
      label-width="100px"
      labe-position="top"
    >
      <el-tabs
        v-model="activeIndex"
        :tab-position="'left'"
        style="height: 200px"
      >
        <el-tab-pane label="基本信息" name="0">基本信息</el-tab-pane>
        <el-tab-pane label="商品参数" name="1">商品参数</el-tab-pane>
        <el-tab-pane label="商品属性" name="2">商品属性</el-tab-pane>
        <el-tab-pane label="商品图片" name="3">商品图片</el-tab-pane>
        <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
      </el-tabs>
    </el-form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',

      // 添加商品的表单数据对象
      addForm: {},

      // 表单的验证规则
      addFormRules: {},
    }
  },

  created() {},

  methods() {},
}
</script>

<style scoped>
</style>