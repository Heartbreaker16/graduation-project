import Vue from 'vue'
import App from './App'
import net from './utils/net'
import calendar from './utils/calendar'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.mixin({
  data() {
    return {
      net: '', //网络服务接口
      calendar: '', //日历函数
      rootUrl: 'http://localhost:3000/' //日历函数
    }
  },
  created() {
    this.net = net
    this.calendar = calendar
  }
})
const app = new Vue(App)
app.$mount()
