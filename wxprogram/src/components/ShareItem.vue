<template>
  <div class='share'>
    <div class='left'>
      <div class='up'>
          <div class='date'>{{month+1 || '0'}}-{{day || '0'}}</div>
          <div class='year-lunar'>
          <div class='year'>{{year || '0'}}年 {{Week_Lunar.ncWeek}}</div>
          <div class='lunar'>农历{{Week_Lunar.IMonthCn + Week_Lunar.IDayCn}}</div>
          </div>
      </div>
      <div class='slogan'>运营日历——运趋势热点，营人心人性</div>
    </div>
    <!-- <div v-if='likeStatus>-1' class='button like' @tap='changeLike' hover-class='fade'><img :src="'/static/imgs/'+(likeStatus?'like_on':'like')+'.png'"></div>
    <div class='button _share' @tap='share' hover-class='fade'><img src='/static/imgs/share.png'></div> -->
    <img class='_share' v-if='likeStatus>-1' @tap='changeLike' :src="'/static/imgs/'+(likeStatus?'like':'like_grey')+'.png'">
    <img class='like' @tap='share' src='/static/imgs/share.png'>
    
  </div>
</template>

<script>
export default {
  props:['year','month','day','likeStatus'],
  computed:{
    Week_Lunar(){
      return this.calendar(this.year,this.month,this.day)
    }
  },
  methods:{
    changeLike(){
      this.$emit('changeLike')
    },
    share(){
      this.$emit('share')
    }
  }
}
</script>
<style lang="stylus" scoped>
.share
  Flex(flex, flex-end, center)
  padding 0 30rpx 30rpx 30rpx
  margin 60rpx 0 20rpx 0
  .left
    margin 0 auto 0 0
    .up
      Flex(flex, , center)
      .date
        Font(58rpx)
      .year-lunar
        height 50rpx
        margin-left 10rpx
        Flex(flex, space-between, , column)
        Font(26rpx)
    .slogan
      Font(27rpx)
      margin-top 16rpx
      color gray
  ._share
    Height_Width(60rpx)
    margin-right 15rpx
  .like
    Height_Width(50rpx)

  // .button
  //   Height_Width(70rpx)
  //   Flex(flex,center,center)
  //   margin-left 10rpx
  //   border-radius 50%
  //   background themeColor
  //   &._share img
  //     Height_Width(50rpx)
  //     margin-right 5rpx
  //   &.like img
  //     Height_Width(40rpx)

</style>
