<template>
  <div class="monthView">
    <Title mode='month' @change='change' ref='monthView'/>
    <div class="calendar-head">
      <div>日</div>
      <div>一</div>
      <div>二</div>
      <div>三</div>
      <div>四</div>
      <div>五</div>
      <div>六</div>
    </div>
    <div class="view">
      <div :class="[{day: v.date!=''},{red: v.date===day},{today: v.isToday}]" @tap="tapDay(v)" v-for="(v,i) in days_of_month" :key="i">
        <div class='date'>{{v.date}}</div>
        <div class='mark'>{{v.mark}}</div>
      </div>
    </div>
  <News :date="year+'-'+month+'-'+day" type='month'/>
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
  components:{ News, Title, Share, ShareMenu },
  data() {
    return {
      year: 0, //year,month,day是当前设置的目标查看时间
      month: 0,
      day: 0,
      days_of_month: [],
      showModal: false
    }
  },
  methods: {
    // 点击切换天
    tapDay(v) {
      if (v.date != this.day && v != '') {
        this.day = v.date
        // 传递给Title组件，使其改变日期
        this.$refs.monthView.tapDay(this.day)
      }
    },
    // 建立日历视图
    changeMonthView(){
      let monthArray = Array.from(
        new Array(new Date(this.year, this.month + 1, 0).getDate()),
        (v, i) => {
          const dayObj = this.calendar(this.year, this.month, i + 1)
          return {
            date: i + 1, 
            mark: dayObj.holidayMark ? dayObj.holidayMark : dayObj.IDayCn, 
            isToday: dayObj.isToday
          }
        }
      )
      this.days_of_month = [
        ...new Array(new Date(this.year, this.month, 1).getDay()).fill(''),
        ...monthArray
      ]
    },
    // Title向上冒泡的change
    change(year,month,day){
      const oldYear = this.year
      const oldMonth = this.month
      this.year = year
      this.month = month
      this.day = day
      if(oldYear != year || oldMonth != month)
        this.changeMonthView()
    },
    shareImg(){
      const url = `../canvas/main?type=month&year=${this.year}&month=${this.month}&day=${this.day}`
      wx.navigateTo({ url })
    }
  },
  mounted(){
    // 同dateView
    const data = this.$root.$mp.query
    if(data.year){
      this.$refs.monthView.loadDate(`${data.year}-${parseInt(data.month)+1}-${data.day}`)
    } else {
      this.$refs.monthView.loadDate()
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
.monthView
  position absolute
  width 100%
  min-height 100%
.calendar-head
  display flex
  div
    width calc((100% / 7))
    text-align center
    Font(30rpx, 80rpx, bold)
    &:nth-child(1), &:nth-child(7)
      color themeColor
.view
  display flex
  flex-wrap wrap
  width 100%
  // background #F6F5FA
  padding 20rpx 0 0 0
  // BorderBox()
  >div
    height 90rpx
    width calc(100%/7 - 12rpx)
    margin 6rpx
    Flex(flex,center,center,column)
    Font(34rpx)
    border-radius 22rpx
    BorderBox()
  .day
    // Font(30rpx, 80rpx)
    // box-shadow 0 0 10rpx #DDD
    // BorderBox()
    // text-align center
    background white
  .red
    color white
    background themeColor
  .today
    border 1rpx solid themeColor
  .date
    // Font(30rpx)
    margin-bottom 10rpx
  .mark
    Font(22rpx)
</style>
