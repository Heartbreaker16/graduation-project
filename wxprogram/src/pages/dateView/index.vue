<template>
<div class="dateView">
  <Title mode='date' @change='change' ref='dateView'/>
  <div class="view">
    <div class="left"><div>{{month+1}}月<div v-if='today'>今天</div></div></div>
    <div class="middle">{{day}}</div>
    <div class="right">
      <div>{{mark}}</div>
      <span>{{week}}</span>
    </div>
  </div>
  <News :date="year+'-'+month+'-'+day" type='day'/>
  <Share :year='year' :month='month' :day='day' likeStatus=-1 @share='showModal=true'/>
  <ShareMenu mode='homepage' v-if='showModal' @shareImg='shareImg' @cancel='showModal=false'/>
</div>
</template>

<script>
import News from '@/components/NewsList'
import Title from '@/components/DateTitle'
import Share from '@/components/ShareItem'
import ShareMenu from '@/components/ShareMenu'
export default {
  components: { News, Title, Share, ShareMenu },
  data() {
    return {
      year: 0,
      month: 0,
      day: 0,
      week: '',
      mark: '',
      today: false,
      showModal: false,
    }
  },
  methods: {
    // Title组件内完成日期改变时，冒泡change事件，从而改变其他组件的日期状态
    change(year,month,day){
      this.year = year
      this.month = month
      this.day = day
      
      const res = this.calendar(this.year,this.month,this.day)
      this.week = res.ncWeek
      this.mark = res.holidayMark ? res.holidayMark : '农历' + res.IMonthCn + res.IDayCn
      this.today = res.isToday
    },
    shareImg(){
      const url = `../canvas/main?type=day&year=${this.year}&month=${this.month}&day=${this.day}`
      wx.navigateTo({ url })
    }
  },
  mounted(){
    const data = this.$root.$mp.query
    if(data.year){
      // 从分享的页面进入该页面，定位到特定的一天，传递给Title组件
      this.$refs.dateView.loadDate(`${data.year}-${parseInt(data.month)+1}-${data.day}`)
    } else {
      // 使Title组件默认加载今天
      this.$refs.dateView.loadDate()
    }
  },
  onShareAppMessage() {
    return {
      title: `${parseInt(this.month)+1}月${this.day}日运营热点`,
      path: `${this.$mp.page.route}?year=${this.year}&month=${this.month}&day=${this.day}`
    }
  }
}
</script>
<style lang="stylus" scoped>
.dateView
  position absolute
  width 100%
  min-height 100%
.view
  Height_Width(300rpx, 100%)
  Flex(flex, center, center)
  background #F6F5FA
  .left
    width 200rpx
    Flex(flex, flex-end)
    Font(50rpx, 50rpx, bold)
    >div
      Flex(flex, , center, column)
      >div
        Font(27rpx, 35rpx)
        border-radius 15rpx
        border 1px solid themeColor
        color themeColor
        padding 0 10rpx
        margin-top 10rpx
  .middle
    Font(170rpx, 170rpx, bold)
    margin 0 40rpx
  .right
    width 200rpx
    Font(30rpx)
    color #999
    div
      margin-bottom 10rpx
</style>
