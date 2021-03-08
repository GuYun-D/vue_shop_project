<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片试图区域 -->
    <el-card>
      <!-- 使用layout布局 -->
      <!-- 
          gutter:	栅格间隔
          span: 栅格占据的列数
       -->
      <el-row :gutter="20">
        <el-col :span="8">
          <!-- 搜索与添加区域 -->
          <div>
            <!-- 
              elementui提供clear事件，当点击clearable之后触发
             -->
            <el-input
              placeholder="请输入内容"
              v-model="queryInfo.query"
              clearable
              @clear="getUserList"
            >
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="getUserList"
              ></el-button>
            </el-input>
          </div>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="addDialogVisable = true"
            >添加用户</el-button
          >
        </el-col>
      </el-row>

      <!-- 用户列表区域 -->
      <el-table :data="userlist" style="width: 100%" border stripe>
        <el-table-column type="index"> </el-table-column>
        <el-table-column label="姓名" prop="username"> </el-table-column>
        <el-table-column label="邮箱" prop="email"> </el-table-column>
        <el-table-column label="电话" prop="mobile"> </el-table-column>
        <el-table-column label="角色" prop="role_name"> </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <!-- 为开关添加改变事件 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="usersStateChanged(scope.row)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="180px">
          <template slot-scope="scope">
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="showEditDialog(scope.row.id)"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="removeUserById(scope.row.id)"
            ></el-button>
            <!-- 分配角色按钮 -->
            <el-tooltip
              class="item"
              effect="dark"
              content="分配用户角色"
              placement="top-start"
              :enterable="false"
            >
              <el-button
                type="warning"
                icon="el-icon-setting"
                size="mini"
                @click="setRole(scope.row)"
              ></el-button>
            </el-tooltip>
          </template>
        </el-table-column>
      </el-table>

      <!--
        分页区域
        size-change：页码大小变动时触发
        current-change：当前页发生变动时触发
        current-page：当前显示的是第几页的数据
        page-sizes: 每页显示几条数据
        page-size：当前每页显式几条数据
        layout: 表示要展示哪些控件，如total就是显式总共有几页，删除之后页面相应区域也会消失
      -->
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="queryInfo.pagenum"
        :page-sizes="[1, 2, 3, 4]"
        :page-size="queryInfo.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>

      <!-- 添加用户对话框 -->
      <!-- 
        visible.sync：控制对话框的显示与隐藏，绑定布尔值
        before-close：对话框关闭之前触发
       -->
      <el-dialog
        title="添加用户"
        :visible.sync="addDialogVisable"
        width="50%"
        @close="addDialogClose"
      >
        <!-- 内容主题区域 -->
        <!-- 对话框主体区域 -->
        <el-form
          :model="addForm"
          :rules="addFormRules"
          ref="addFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名" prop="username">
            <el-input v-model="addForm.username"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="addForm.password"></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="addForm.email"></el-input>
          </el-form-item>
          <el-form-item label="手机" prop="mobile">
            <el-input v-model="addForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="addUser">确 定</el-button>
        </span>
      </el-dialog>

      <!-- 修改用户的对话框 -->
      <el-dialog
        title="修改用户信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClose"
      >
        <el-form
          :model="editForm"
          :rules="editFormRules"
          ref="editFormRef"
          label-width="70px"
        >
          <el-form-item label="用户名">
            <el-input v-model="editForm.username" disabled></el-input>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="editForm.email"></el-input>
          </el-form-item>
          <el-form-item label="电话" prop="mobile">
            <el-input v-model="editForm.mobile"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
    </el-card>

    <!-- 分配角色的对话框 -->
    <el-dialog
      title="分配角色"
      :visible.sync="setRoleDialogVisable"
      width="50%"
      @close="setRoleDialogClosed"
    >
      <div>
        <p>当前用户： {{ userInfo.username }}</p>
        <p>当前角色： {{ userInfo.role_name }}</p>
        <p>
          分配新角色
          <el-select v-model="selectedRoleId" placeholder="请选择">
            <el-option
              v-for="item in rolesList"
              :key="item.id"
              :label="item.roleName"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRoleDialogVisable = false">取 消</el-button>
        <el-button type="primary" @click="saveRoleInfo">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    // 自定义校验规则
    /**
      rule：校验规则
      value：要检验的值
      callback：回调函数
     */
    // 邮箱
    var checkEmail = (rule, value, callback) => {
      // 校验邮箱正则
      const regEmail = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/
      // 校验
      if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
      }

      callback(new Error('请输入合法邮箱'))
    }

    // 手机号
    var checkmobile = (rule, value, callback) => {
      // 校验邮箱正则
      const regmobile = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      // 校验
      if (regmobile.test(value)) {
        // 合法邮箱
        return callback()
      }

      callback(new Error('请输入合法手机号'))
    }

    return {
      // 获取用户列表的参数对象
      queryInfo: {
        // 搜索关键字query
        query: '',
        pagenum: 1,
        pagesize: 2,
      },

      // 用户列表
      userlist: [],

      //   总
      total: 0,

      // 用于控制添加用户对话框的显示与隐藏
      addDialogVisable: false,

      // 用于显式与隐藏修改对话框
      editDialogVisible: false,

      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        emali: '',
        mobile: '',
      },

      // 添加表单的验证规则对象
      addFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '用户名长度应在3~10个字符之间',
            trigger: 'blur',
          },
        ],

        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '用户名长度应在6~15个字符之间',
            trigger: 'blur',
          },
        ],

        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],

        mobile: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' },
        ],
      },

      // 点击修改，查询到的用户信息
      editForm: {},

      // 修改表单的验证规则
      editFormRules: {
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' },
          { validator: checkEmail, trigger: 'blur' },
        ],

        mobile: [
          { required: true, message: '请输入正确手机号', trigger: 'blur' },
          { validator: checkmobile, trigger: 'blur' },
        ],
      },

      // 分配角色对话框
      setRoleDialogVisable: false,

      // 需要被分配角色的用户信息
      userInfo: {},

      // 所有角色列表
      rolesList: [],

      // 已选中的角色值
      selectedRoleId: '',
    }
  },

  created() {
    this.getUserList()
  },

  methods: {
    async getUserList() {
      const { data: res } = await this.$http.get('users', {
        params: this.queryInfo,
      })
      // 对获取用户列表成功与否进行判断
      if (res.meta.status !== 200) {
        return this.$message.error('获取用户列表失败')
      }

      this.userlist = res.data.users
      this.total = res.data.total
      console.log(res)
    },

    // 监听pagesize改变的事件
    handleSizeChange(newSize) {
      // 最新的页码值
      // console.log(newSize)
      // 将新的页码重新赋值，并重新查询
      this.queryInfo.pagesize = newSize
      this.getUserList()
    },

    handleCurrentChange(newPage) {
      console.log(newPage)
      this.queryInfo.pagenum = newPage
      this.getUserList()
    },

    // 监听switch开关状态的变化
    async usersStateChanged(userInfo) {
      // console.log(userInfo);
      const { data: res } = await this.$http.put(
        `users/${userInfo.id}/state/${userInfo.mg_state}`
      )
      // console.log("在这呢");
      // console.log(res);
      if (res.meta.status !== 200) {
        userInfo.mg_state = !userInfo.mg_state
        return this.$message.erroe('更新用户失败')
      }

      this.$message.success('用户修改成功')
    },

    // 监听添加用户对话框的关闭事件
    addDialogClose() {
      this.$refs.addFormRef.resetFields()
      console.log(this.$refs)
    },

    // 添加用户前的预校验
    addUser() {
      this.$refs.addFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return false
        }

        // 验证通过，发起请求
        const { data: res } = await this.$http.post('users', this.addForm)

        if (res.meta.status !== 200) {
          this.$message.error('添加用户失败')
        }

        this.$message.success('添加用户成功')

        // 添加后关闭对话框
        this.addDialogVisable = false

        // 新增用户之后，刷新用户列表
        this.getUserList()
      })
    },

    // 展示编辑用户的对话框
    async showEditDialog(id) {
      const { data: res } = await this.$http.get('users/' + id)
      if (res.meta.status !== 200) {
        return this.$message.error('用户数据查询失败')
      }

      // 将获取到的用户信息赋值给editForm
      this.editForm = res.data

      this.editDialogVisible = true
      // console.log(id)
    },

    // 监听修改用户对话框的关闭事件，并重置表单
    editDialogClose() {
      this.$refs.editFormRef.resetFields()
    },

    // 提交用户修改信息预验证
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        // console.log(valid);
        if (!valid) {
          return
        }
        // 发起请求
        const { data: res } = await this.$http.put(
          'users/' + this.editForm.id,
          {
            email: this.editForm.email,
            mobile: this.editForm.mobile,
          }
        )

        if (res.meta.status !== 200) {
          return this.$message.error('用户更新失败')
        }

        // 修改成功，关闭对话框，刷新数据列表
        this.editDialogVisible = false
        this.getUserList()
        this.$message.success('修改用户信息成功')
        console.log(this.editForm)
      })
    },

    // 删除用户
    async removeUserById(id) {
      // console.log(id);
      // 弹框提示用户确认
      // 如果用户点击确定返回字符串confirm，点击取消会报错，需要用catch捕获,返回结果为cancel
      const confirmResult = await this.$confirm(
        '此操作将永久删除该用户, 是否继续?',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning',
        }
      ).catch((err) => {
        return err
      })

      // console.log(confirmResult)
      if (confirmResult !== 'confirm') {
        return this.$message.info('已取消删除')
      }

      // 确认删除
      const { data: res } = await this.$http.delete('users/' + id)

      console.log(res)

      if (res.meta.status !== 200) {
        return this.$message.error('用户删除失败')
      }

      this.$message.success('删除用户成功')

      this.getUserList()
    },

    // 展示分配角色对话框
    async setRole(userInfo) {
      this.userInfo = userInfo

      // 展开对话框前获取所有角色列表
      const { data: res } = await this.$http.get('roles')
      // console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.erroe('角色列表获取失败')
      }

      this.rolesList = res.data
      this.setRoleDialogVisable = true
    },

    // 分配角色
    async saveRoleInfo() {
      console.log(this.selectedRoleId)
      // 判断是否选中
      if (!this.selectedRoleId) {
        return this.$message.error('请选择要分配的角色')
      }

      const { data: res } = await this.$http.put(
        `users/${this.userInfo.id}/role`,
        {
          rid: this.selectedRoleId,
        }
      )

      if (res.meta.status !== 200) {
        return this.$message.error('用户角色更新失败')
      }

      this.$message.success('用户角色更新成功')

      this.getUserList()

      this.setRoleDialogVisable = false
    },

    // 监听分配角色对话框的关闭事件
    setRoleDialogClosed() {
      this.selectedRoleId = ''
      this.userInfo = {}
    },
  },
}
</script>

<style scoped>
.el-pagination {
  margin-top: 25px;
}
</style>