<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt="" />
        <span>电商后台管理系统</span>
      </div>
      <el-button @click="logout" type="info">退出</el-button>
    </el-header>
    <!-- 页面主题区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside width="200px">
        <!-- 侧边栏菜单区域 -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i class="el-icon-location"></i>
              <span>导航一</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item index="1-4-1">
              <!-- 复制一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-location"></i>
                <span>导航一</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.el-container {
  height: 100%;
}
.el-header {
  /* 使用flex布局 */
  background-color: #373d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  /* 
    为什么添加之后，按钮本来是贴着上面的变成不贴了？
  */
  align-items: center;
  color: #fff;

  font-size: 20px;
}

.el-header div {
  display: flex;
  align-items: center;
}

.el-header span {
  margin-left: 15px;
}

.el-aside {
  background-color: #333744;
}

.el-main {
  background-color: #eaedf1;
}
</style>