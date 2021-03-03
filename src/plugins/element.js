import Vue from 'vue'
import Element, { Message } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

// 全局挂载
Vue.prototype.$message = Message