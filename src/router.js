import Vue from 'vue'
import Router from 'vue-router'

import Login from './components/login.vue'
import Home from './components/home.vue'

import Welcome from './components/welcome.vue'

import Users from './components/user/Users.vue'

import Rights from './components/power/rights.vue'

import Roles from './components/power/roles.vue'

import Cate from './components/goods/cate.vue'

import Params from './components/goods/params.vue'

import List from './components/goods/list.vue'

import Add from './components/goods/add.vue'

import Order from './components/order/order.vue'

import Report from './components/report/report.vue'


Vue.use(Router)

const router = new Router({
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    {
      path: '/home', component: Home,
      redirect: '/welcome',
      children: [
        { path: '/welcome', component: Welcome },
        { path: '/users', component: Users },
        { path: '/rights', component: Rights },
        { path: '/roles', component: Roles },
        { path: '/categories', component: Cate },
        { path: '/params', component: Params },
        { path: '/goods', component: List },
        { path: '/goods/add', component: Add },
        { path: '/orders', component: Order },
        { path: '/reports', component: Report },
      ]
    }
  ]
})

// 挂载路由首位
router.beforeEach((to, from, next) => {
  if (to.path == '/login') {
    return next()
  }
  // 获取token
  const tokenStr = window.sessionStorage.getItem("token")
  if (!tokenStr) {
    // 用户未登录
    // 强制跳转到登录页
    return next('/login')
  } else {
    next()
  }
})


export default router