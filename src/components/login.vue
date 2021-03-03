<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 默认用户头像 -->
      <div class="avatar_box">
        <img src="../assets/logo.png" alt="" />
      </div>

      <!-- 登录表单区域 -->
      <!-- 
          :model="loginForm"：表单的数据绑定对象
          :rules="loginFormRules": 表单验证规则对象
           ref="loginFormRef": 表单实例对象
       -->
      <el-form
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
        ref="loginFormRef"
      >
        <!-- 用户名 -->
        <el-form-item prop="username">
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>

        <!-- 密码 -->
        <el-form-item prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>

        <!-- 按钮 -->
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 这是登录表单的数据绑定对象
      loginForm: {
        username: 'admin',
        password: '123456',
      },

      // 表单验证规则对象
      loginFormRules: {
        // 验证用户名是否合法
        // trigger；触发时机：blur：失去焦点
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { min: 3, max: 5, message: '长度在 3 到 5 个字符', trigger: 'blur' },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: '请输入登录密码', trigger: 'blur' },
          {
            min: 6,
            max: 15,
            message: '长度在 6 到 15 个字符',
            trigger: 'blur',
          },
        ],
      },
    }
  },

  methods: {
    // 重置表单
    resetLoginForm() {
      //   console.log(this);
      this.$refs.loginFormRef.resetFields()
    },

    // 表单验证
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        // console.log(valid);
        // 校验结果为false
        if (!valid) return

        // const result = await this.$http.post('login', this.loginForm)
        // 结构出data
        const { data: res } = await this.$http.post('login', this.loginForm)

        // 返回结果为promise，使用async
        // console.log(res);

        if (res.meta.status !== 200) {
          //   console.log("登陆失败");
          this.$message.error('登陆失败')
          return
        }

        // console.log("登录成功");
        this.$message.success('登陆成功')

        /**
         * 将登录成功之后的token保存到客户端的sessionStorage中
         *    项目中出现了登陆之外的api接口，必须在登录成功之后才能访问
         *    token只应在当前网站打开期间生效，所以将token保存在sessionStorage中
         */

        window.sessionStorage.setItem('token', res.data.token)

        // 通过编程式导航跳转到后台主页
        this.$router.push('/home')
      })
    },
  },
}
</script>

<style lang="css" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}

.login_box {
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.avatar_box {
  height: 130px;
  width: 130px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fff;
}

.avatar_box img {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.btns {
  display: flex;
  justify-content: flex-end;
}

.login_form {
  position: absolute;
  width: 100%;
  bottom: 0;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>