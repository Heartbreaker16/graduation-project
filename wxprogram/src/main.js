import Vue from 'vue'
import App from './App'
import net from './utils/net'
import calendar from './utils/calendar'

Vue.config.productionTip = false
App.mpType = 'app'

Vue.mixin({
  data() {
    return {
      net: null, //网络服务接口
      calendar: null, //日历函数
      rootUrl: 'http://207.148.90.74:3000/' //服务器
    }
  },
  created() {
    this.net = net
    this.calendar = calendar
  }
})
const app = new Vue(App)
app.$mount()

wx.setEnableDebug({
  enableDebug: true
})
