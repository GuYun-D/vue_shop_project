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
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加参数</el-button
          >
          <!-- 动态参数表格 -->
          <el-table :data="mangTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand">
              <template slot-scope="scope">
                <!-- 循环渲染tag标签 -->
                <el-tag
                  :key="i"
                  v-for="(item, i) in scope.row.attr_vals"
                  closable
                  @close="handleClose(i, scope.row)"
                  >{{ item }}</el-tag
                >

                <!-- 动态编辑标签 -->
                <!-- 
                  v-if是控制文本框和按钮的切换
                  handleInputConfirm: 无论是按了回车还是失去焦点都会触发
                 -->
                <el-input
                  class="input-new-tag"
                  v-if="scope.row.inputVisible"
                  v-model="scope.row.inputValue"
                  ref="saveTagInput"
                  size="small"
                  @keyup.enter.native="handleInputConfirm(scope.row)"
                  @blur="handleInputConfirm(scope.row)"
                >
                </el-input>
                <!-- 
                  showInput：显示文本框
                 -->
                <el-button
                  v-else
                  class="button-new-tag"
                  size="small"
                  @click="showInput(scope.row)"
                  >+ New Tag</el-button
                >
              </template>
            </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="参数名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="静态属性" name="only">
          <el-button
            type="primary"
            size="mini"
            :disabled="isDisabled"
            @click="addDialogVisible = true"
            >添加属性</el-button
          >
          <!-- 静态参数表格 -->
          <el-table :data="onlyTabData" border stripe>
            <!-- 展开行 -->
            <el-table-column type="expand"> </el-table-column>
            <!-- 索引列 -->
            <el-table-column type="index"></el-table-column>
            <el-table-column
              label="属性名称"
              prop="attr_name"
            ></el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="showEditDialog(scope.row.attr_id)"
                  >编辑</el-button
                >
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="removeParams(scope.row.attr_id)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
      </el-tabs>
    </el-card>

    <!-- 添加参数的对话框-->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>

    <!-- 修改对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editFormRef"
        label-width="100px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import rolesVue from '../power/roles.vue'
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

      // 动态属性数据
      mangTabData: [],

      // 静态属性的数据
      onlyTabData: [],

      // 控制对话框
      addDialogVisible: false,

      // 添加参数的表单数据对象·
      addForm: {
        attr_name: '',
      },

      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },

      // 控制修改对话框
      editDialogVisible: false,

      // 修改的表单数据对象
      editForm: {},

      // 修改表单的验证规则
      editFormRules: {
        attr_name: [
          { required: true, message: '请输入参数名称', trigger: 'blur' },
        ],
      },

      // 控制按钮和文本框的切换，默认显示按钮
      inputVisible: false,

      // 动态标签输入的内容
      inputValue: '',
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

      // 将字符串变成数组
      res.data.forEach((item) => {
        // 对当前atr_vals进行判断是否为空，否则展开会出现空标签
        item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []

        // 在动态编辑标签时，由于所有的都是用的是inputVisible这同一个，导致所有的动态编辑标签同时联动
        // 为每一个参数都添加这两个属性
        item.inputVisible = false
        item.inputValue = ''
      })

      console.log(res.data)
      // 获取到的数据需要进行判断，是属于静态数据还是动态数据
      if (this.activeName === 'many') {
        this.mangTabData = res.data
      } else {
        this.onlyTabData = res.data
      }

      console.log('参数数据：' + this.mangTabData)
      console.log('参数数据：' + this.onlyTabData)
    },

    // tab页签点击事件处理函数
    handleTabClick() {
      //   console.log(this.activeName)
      this.getParamsData()
    },

    // 监听添加参数对话框的关闭
    addDialogClosed() {
      // 重置表单
      this.$refs.addFormRef.resetFields()
    },

    // 点击按钮添加参数
    addParams() {
      // 表单预验证
      this.$refs.addFormRef.validate(async (Valid) => {
        if (!Valid) {
          // 验证失败
          return
        }

        const { data: res } = await this.$http.post(
          `categories/${this.cateId}/attributes`,
          {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          }
        )

        if (res.meta.status !== 201) {
          return this.$message.error('添加参数失败')
        }

        this.addDialogVisible = false

        this.$message.success('参数添加成功')

        //  刷新列表
        this.getParamsData()
      })
    },

    // 点击按钮显示修改的对话框
    async showEditDialog(attr_id) {
      // 查询当前参数的信息
      const { data: res } = await this.$http.get(
        `categories/${this.cateId}/attributes/${attr_id}`,
        {
          params: {
            attr_sel: this.activeName,
          },
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('获取参数信息失败')
      }

      // this.$message.success("获取参数信息成功")
      this.editForm = res.data

      this.editDialogVisible = true
    },

    // 监听对话框关闭，重置表单
    editDialogClosed() {
      this.$refs.editFormRef.resetFields()
    },

    // 点击按钮，修改参数信息
    editParams() {
      // 表单预校验
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) {
          return this.$message.error('修改失败')
        }

        const { data: res } = await this.$http.put(
          `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('参数修改失败')
        }

        this.$message.success('参数修改成功')

        this.getParamsData()

        this.editDialogVisible = false
      })
    },

    // 删除属性
    async removeParams(attr_id) {
      // elementui messagebox确认消息
      const confirmResult = await this.$confirm(
        '此操作将永久删除该参数, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => err)

      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      // 删除
      const { data: res } = await this.$http.delete(
        `categories/${this.cateId}/attributes/${attr_id}`
      )

      if (res.meta.status !== 200) {
        return this.$message.error('删除失败')
      }

      this.$message.success('删除成功')

      this.getParamsData()
    },

    // 文本框失去焦点或按下回车
    async handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = ''
        row.inputVisible = false
        return
      }

      // 如果没有return，证明用户输入了正式数据,存入数据
      // 可选参数就是循环本参数下的attr_vals,蓑衣将新添加的可选参数添加到这个数组中
      row.attr_vals.push(row.inputValue.trim())
      row.inputValue = ''
      row.inputVisible = false

      this.saveAttrVals(row)
    },

    // 向后端发起请求，保存修改的attr_vals
    async saveAttrVals(row) {
      const { data: res } = await this.$http.put(
        `categories/${this.cateId}/attributes/${row.attr_id}`,
        {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(' '),
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('修改失败')
      }

      this.$message.success('修改成功')
    },

    // 点击按钮显示文本输入框
    showInput(row) {
      row.inputVisible = true

      // 自动获取焦点
      /**
        $nextTick:当页面上的元素被重新渲染后，调用回调函数。
                  面加载出来之后，显示的是tag标签而不是input，
                  直接使用this.$refs.saveTagInput.$refs.input.focus()，会导致无法找到该元素而报错，因为还没有渲染出来
 */
      this.$nextTick((_) => {
        this.$refs.saveTagInput.$refs.input.focus()
      })
    },

    // 删除可选参数,根据id
    handleClose(i, row) {
      row.attr_vals.splice(i, 1)
      this.saveAttrVals(row)
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

    // 动态计算标题的文本
    titleText() {
      if (this.activeName === 'mang') {
        return '动态参数'
      }

      return '静态属性'
    },
  },
}
</script>

<style scoped>
.cat_opt {
  margin: 15px 0;
}

.el-tag {
  margin: 10px;
}

.input-new-tag {
  width: 120px;
}
</style>