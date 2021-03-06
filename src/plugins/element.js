import Vue from 'vue'
import Element, { Message, MessageBox } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

Vue.use(Element)

// 全局挂载
Vue.prototype.$message = Message

// 全局挂载消息弹窗
Vue.prototype.$confirm = MessageBox.confirm