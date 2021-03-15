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
        label-position="top"
      >
        <!-- 
          before-leave: tab栏切换触发
          tab-click:tab 被选中时触发
        -->
        <el-tabs
          v-model="activeIndex"
          :tab-position="'left'"
          :before-leave="beforeTabLeave"
          @tab-click="tabClicked"
        >
          <el-tab-pane label="基本信息" name="0">
            <el-form-item label="商品名称" prop="goods_name">
              <el-input v-model="addForm.goods_name"></el-input>
            </el-form-item>
            <el-form-item label="商品价格" prop="goods_price">
              <el-input v-model="addForm.goods_price" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品重量" prop="goods_weight">
              <el-input v-model="addForm.goods_weight"></el-input>
            </el-form-item>
            <el-form-item label="商品数量" prop="goods_number">
              <el-input v-model="addForm.goods_number" type="number"></el-input>
            </el-form-item>
            <el-form-item label="商品分类" prop="goods_cat">
              <el-cascader
                v-model="addForm.goods_cat"
                :options="cateList"
                :props="cateProps"
                expand-trigger="hover"
                @change="handleChange"
              ></el-cascader>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品参数" name="1">
            <!-- 渲染表单的item项 -->
            <el-form-item
              :key="item.attr_id"
              :label="item.attr_name"
              v-for="item in manyTableData"
            >
              <!-- 复选框组 -->
              <el-checkbox-group v-model="item.attr_vals">
                <el-checkbox
                  border
                  :key="i"
                  v-for="(cb, i) in item.attr_vals"
                  :label="cb"
                ></el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品属性" name="2">
            <el-form-item
              :key="item.attr_id"
              :label="item.attr_name"
              v-for="item in onlyTableData"
            >
              <el-input v-model="item.attr_vals"> </el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="商品图片" name="3">
            <!-- 图片上传 -->
            <!-- 
              action：上个传地址
              on-preview: 点击预览的图片时触发事件
              on-remove: 删除图片
              headers: 设置请求头
             -->
            <!-- 
              点击图片上传之后，后台传回的数据显示：
               {data: null, meta: {msg: "无效token", status: 400}}
               在axios中配置了token，返回数据说token无效，说明该组件上传图片没有使用axios发ajax
               该组件自己封装了ajax
              -->
            <!-- 
                data: {tmp_path: "tmp_uploads\1d12ebc720396a9eef5cd374b7a6638d.jpg",…}
                      tmp_path: "tmp_uploads\1d12ebc720396a9eef5cd374b7a6638d.jpg"
                      url: "http://127.0.0.1:8888/tmp_uploads\1d12ebc720396a9eef5cd374b7a6638d.jpg"
                上传图片成功之后，后台返回数据，临时路径
               -->
            <el-upload
              :action="uploadUrl"
              :on-preview="handlePreview"
              :on-remove="handleRemove"
              list-type="picture"
              :headers="headersObj"
              :on-success="handleSuccess"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </el-tab-pane>
          <el-tab-pane label="商品内容" name="4">商品内容</el-tab-pane>
        </el-tabs>
      </el-form>
    </el-card>

    <!-- 图片预览 -->
    <el-dialog
      title="图片预览"
      :visible.sync="previewDialogVisible"
      width="50%"
    >
      <img :src="previewPath" alt="" class="previewImg"/>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: '0',

      // 添加商品的表单数据对象
      addForm: {
        goods_name: '',
        goods_price: 0,
        goods_weight: 0,
        goods_number: 0,
        // 商品所属的分类
        goods_cat: [],
        // 图片上传临时路径,数组
        pics: [],
      },

      // 表单的验证规则
      addFormRules: {
        goods_name: [
          {
            required: true,
            message: '请输入商品名称',
            trigger: 'blur',
          },
        ],

        goods_price: [
          {
            required: true,
            message: '请输入商品价格',
            trigger: 'blur',
          },
        ],

        goods_weight: [
          {
            required: true,
            message: '请输入商品重量',
            trigger: 'blur',
          },
        ],

        goods_number: [
          {
            required: true,
            message: '请输入商品数量',
            trigger: 'blur',
          },
        ],

        goods_cat: [
          {
            required: true,
            message: '请选择三级分类',
            trigger: 'blur',
          },
        ],
      },

      // 商品分类列表
      cateList: [],

      //
      cateProps: {
        // 看到的是谁
        label: 'cat_name',
        // 选中的是谁
        value: 'cat_id',
        // 哪个节点实现父子嵌套
        children: 'children',
      },

      // 动态参数列表获取
      manyTableData: [],

      // 静态属性列表获取
      onlyTableData: [],

      // 图片上传地址
      uploadUrl: 'http://127.0.0.1:8888/api/private/v1/upload',

      // 图片上传请求头
      headersObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },

      // 图片预览时的图片路径
      previewPath: '',

      // 控制图片预览对话框
      previewDialogVisible: false,
    }
  },

  created() {
    this.getCateList()
  },

  methods: {
    // 获取所有商品分类数据
    async getCateList() {
      const { data: res } = await this.$http.get('categories')
      if (res.meta.status !== 200) {
        return this.$message.error('获取所有商品分类数据失败')
      }

      this.$message.success('获取所有商品分类数据成功')

      this.cateList = res.data

      console.log(this.cateList)
    },

    // 级联选选择器选中项发生变化会触发这个函数
    handleChange() {
      console.log(this.addForm.goods_cat)
      if (this.addForm.goods_cat.length != 3) {
        this.addForm.goods_cat = []
        return this.$message.error('请选择三级分类')
      }
    },

    // 阻止标签页跳转
    beforeTabLeave(activeName, oldActiveName) {
      console.log('即将离开的是' + oldActiveName)
      console.log('即将进入的是' + activeName)

      if (oldActiveName === 0 || this.addForm.goods_cat.length !== 3) {
        this.$message.error('请先选择商品分类')
        return false
      }
    },

    // tab被选中时触发
    async tabClicked() {
      console.log(this.activeIndex)
      if (this.activeIndex === '1') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateIde}/attributes`,
          {
            params: {
              sel: 'many',
            },
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }

        console.log(res.data)

        res.data.forEach((item) => {
          item.attr_vals =
            item.attr_vals.length === 0 ? [] : item.attr_vals.split(' ')
        })

        this.manyTableData = res.data
      } else if (this.activeIndex === '2') {
        const { data: res } = await this.$http.get(
          `categories/${this.cateIde}/attributes`,
          {
            params: {
              sel: 'only',
            },
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('获取动态参数列表失败')
        }

        console.log(res.data)

        this.onlyTableData = res.data
      }
    },

    // 点击预览的图片时触发事件
    handlePreview(file) {
      // console.log(file);
      this.previewPath = file.response.data.url
      this.previewDialogVisible = true
    },

    // 删除图片的操作
    handleRemove(file) {
      console.log(file)
      // 获取将要删除的图片临时路径
      const filePath = file.response.data.tmp_path
      console.log('要删除的图片路径是' + filePath)
      // 从pics数组中找到该图片索引值
      const i = this.addForm.pics.findIndex((x) => {
        x.pic == filePath
      })

      // 调用数组的splice方法，移除
      this.addForm.pics.splice(i, 1)

      // console.log(this.addForm);
    },

    // 监听图片上传成功事件
    handleSuccess(response) {
      console.log(response)
      // 拼接得到一个图片信息对象
      const picInfo = { pic: response.data.tmp_path }
      // 将图片信息对象push到pics中
      this.addForm.pics.push(picInfo)
      console.log(this.addForm)
    },
  },

  computed: {
    cateIde() {
      if (this.addForm.goods_cat.length === 3) {
        return this.addForm.goods_cat[2]
      } else {
        return null
      }
    },
  },
}
</script>

<style scoped>
.el-checkbox {
  margin: 5px 10px 0 0 !important;
}

.previewImg{
  width: 100%;
}
</style>