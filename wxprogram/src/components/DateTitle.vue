<template>
<div class="fix-bar">
  <div class="left" @tap="loadDate(-1)" hover-class="left-hover"><div/>{{mode=='date'?'前一天':'上一月'}}</div>
  <picker @tap="red=true" @cancel="red=false" @change="pickerConfirm" :class="{'red-text':red}" mode="date"
    :value="year + '-' + (month+1)+ '-'+ day">
    <div class="picker-box">
      <div hover-class="red-text" v-if='loaded'>{{year || '0'}}年{{month + 1 || '0'}}月{{day || '0'}}日</div>
      <div hover-class="red-text" v-else>2018年1月1日</div>
      <div style='margin-left: 15rpx;' :class="red ? 'triangle-color':'triangle'"/>
    </div>
  </picker>
  <div class="right" @tap="loadDate(1)" hover-class="right-hover">{{mode=='date'?'后一天':'下一月'}}<div/></div>
</div>
</template>

<script>
export default {
  props: ['mode'],
  data() {
    return {
      year: 0,
      month: 0,
      day: 0,
      red: false,
      loaded: false
    }
  },
  methods: {
    loadDate(arg) {
      const [oldyear,oldmonth,oldday] = [this.year, this.month, this.day]
      let targetDate
      // 日(月)视图的前一天(月)/后一天(月)操作, 参数为 +1 / -1
      if (typeof arg == 'number') { 
        if (this.mode == 'date') {
          targetDate = new Date(this.year, this.month, this.day + arg)
          this.day = targetDate.getDate()
        } else {
          targetDate = new Date(this.year, this.month + arg, 1)
          if (this.day > new Date(this.year, this.month + arg + 1, 0).getDate()) {
            this.day = new Date(this.year,this.month + arg + 1,0).getDate()
          }
        }
      // 分享页进入特定日期或选择器选择某一日期, 参数为日期字符串
      } else if (typeof arg == 'string') {
        const dateArr = arg.split('-').map(Number)
        targetDate = new Date(dateArr[0],dateArr[1]-1,dateArr[2])
        this.day = targetDate.getDate()
      // 不指定参数，默认加载今天
      } else {
        targetDate = new Date()
        this.day = targetDate.getDate()
      }
      this.year = targetDate.getFullYear()
      this.month = targetDate.getMonth()
      this.loaded = true
      // 向父组件(日月视图页面)冒泡日期改变事件
      if(oldyear != this.year || oldmonth != this.month || oldday != this.day){
        this.$emit('change', this.year,this.month,this.day)
      }
    },
    pickerConfirm(e) {
      this.red = false
      this.loadDate(e.mp.detail.value)
    },
    tapDay(day){
      this.day = day
    }
  }
}
</script>
<style lang="stylus" scoped>
.fix-bar
  Height_Width(100rpx, 100%)
  Flex(flex, space-between, center)
  Font(30rpx)
  Border(1rpx, 0, 1rpx, 0)
  >div
    Flex(flex, , center)
    height 100%
    img
      Height_Width(30rpx)
  .left
    color #777
    padding 0 20rpx 0 10rpx
    div
      Triangle(left, 30rpx, 18rpx)
      margin-right 15rpx
  .right
    color #777
    padding 0 10rpx 0 20rpx
    div
      Triangle(right, 30rpx, 18rpx)
      margin-left 15rpx
  .triangle
    Triangle(down, 24rpx, 14rpx)
picker
  height 100rpx
  Font(35rpx, 50rpx, bold)
  .picker-box
    height 100rpx
    Flex(flex, , center)
.left-hover
  color themeColor !important
  div
    border-right-color themeColor !important
.right-hover
  color themeColor !important
  div
    border-left-color themeColor !important
.triangle-color
  Triangle(up, 24rpx, 14rpx, themeColor)
</style>
