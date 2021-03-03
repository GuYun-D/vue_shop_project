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
      <el-aside :width="isColllapse ? '64px' : '200px'">
        <!-- 侧边栏折叠与展开的按钮 -->
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <!-- 
          collapse: 是否折叠
          collapse-transition：是否启用动画
          router: 为导航开启路由模式，启用该模式会在激活导航时以 index 作为 path 进行路由跳转
                  并将index的值修改为path路径,手动添加/,二级菜单
         -->
        <el-menu
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          :unique-opened="true"
          :collapse="isColllapse"
          :collapse-transition="false"
          :router="true"
        >
          <!-- 一级菜单 -->
          <!-- 
            动态绑定index，不然点击第一个剩下的都跟着动，index接受字符串的值
           -->
          <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
            <!-- 一级菜单的模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconObj[item.id]"></i>
              <span>{{item.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item :index="'/' + subItem.path" :key="subItem.id" v-for="subItem in item.children">
              <!-- 复制一级菜单的模板区域 -->
              <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data() {
    return {
      // 左侧菜单数据
      menulist: [],

      // 一级菜单图标,使用id绑定的方式
      iconObj: {
        '125': 'iconfont icon-user',
        '103': 'iconfont icon-tijikongjian',
        '101': 'iconfont icon-shangpin',
        '102': 'iconfont icon-danju',
        '145': 'iconfont icon-baobiao'
      },

      // 菜单是否折叠
      isColllapse: false
    }
  },
  // 使用生命周期函数
  created() {
    this.getMenuList()
  },
  methods: {
    logout() {
      window.sessionStorage.clear()
      this.$router.push('/login')
    },

    // 获取所有菜单数据
    async getMenuList() {
      // $http.get?
      const { data: res } = await this.$http.get('menus')
      console.log(res)

      // 返回数据res中meta中有
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.menulist = res.data
    },

    // 使用elementui参数
    toggleCollapse(){
      this.isColllapse = !this.isColllapse
    }
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

.el-aside .el-menu{
  border-right: none;
}

.el-main {
  background-color: #eaedf1;
}

.iconfont{
  margin-right: 10px;
}

.toggle-button{
  color: #fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  background-color: #4a5064;
  letter-spacing: 0.2em;
  cursor: pointer;
}
</style>