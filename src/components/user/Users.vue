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
          <template>
            <!-- 修改按钮 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
            ></el-button>
            <!-- 删除按钮 -->
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
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

      <!-- 添加用户 -->
      <!-- 
        visible.sync：控制对话框的显示与隐藏，绑定布尔值
        before-close：对话框关闭之前触发
       -->
      <el-dialog title="添加用户" :visible.sync="addDialogVisable" width="50%">
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
          <el-form-item label="手机" prop="moblie">
            <el-input v-model="addForm.moblie"></el-input>
          </el-form-item>
        </el-form>
        <!-- 底部区域 -->
        <span slot="footer" class="dialog-footer">
          <el-button @click="addDialogVisable = false">取 消</el-button>
          <el-button type="primary" @click="addDialogVisable = false"
            >确 定</el-button
          >
        </span>
      </el-dialog>
    </el-card>
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
    var checkMoblie = (rule, value, callback) => {
      // 校验邮箱正则
      const regMoblie = /^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/
      // 校验
      if (regMoblie.test(value)) {
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

      // 添加用户的表单数据
      addForm: {
        username: '',
        password: '',
        emali: '',
        moblie: '',
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

        moblie: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { validator: checkMoblie, trigger: 'blur' },
        ],
      },
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
  },
}
</script>

<style scoped>
.el-pagination {
  margin-top: 25px;
}
</style>