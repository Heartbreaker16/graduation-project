<template>
<div style='padding-top:30rpx;'>
<div v-for="(para,i) in news" :key="i" style="padding-bottom: 20rpx;">
  <div class="para-title" hover-class='fade' hover-stay-time=50 @tap='showOrHide(i)'><div :class="paraHide[i] ? 'right' : 'down'"/>{{para.tags}}</div>
  <div v-if='hhh'>
    <navigator :url="'../newsDetail/main?NSID='+news.NSID+'&type='+type+'&index='+(para.index+j)+'&year='+dateArr[0]+'&month='+dateArr[1]+'&day='+dateArr[2]" 
      class="link" v-for="(news,j) in para.arr" :key="j">\
      <div class="color"/>
      <div class="content">{{news.title}}<img src="/static/imgs/link.png"></div>
    </navigator>
  </div>
  <div v-else-if='!paraHide[i]'>
    <navigator :url="'../newsDetail/main?NSID='+news.NSID+'&type='+type+'&index='+(para.index+j)+'&year='+dateArr[0]+'&month='+dateArr[1]+'&day='+dateArr[2]" 
      class="item" v-for="(news,j) in para.arr" :key="j">
      <!-- <div class="color"/> -->
      <img :src="rootUrl+'news/'+news.NSID+'.jpg'">
      <div class='right'>
        <div class="title">{{news.title}}</div>
        <div class="time">{{news.display_time}}</div>
      </div>
    </navigator>
  </div>
</div>
<div class='nodata' v-if="!loaded && news.length==0"><img class='loadimg' src="/static/imgs/loading.png">运营热点加载中</div>
<div class='nodata' v-else-if="news.length==0">当日暂无日程</div>
</div>
</template>

<script>
export default {
  props: ['date','type'],
  data() {
    return {
      hhh: false,
      news: [],
      dateArr: [],
      paraHide: [],
      loaded: false
    }
  },
  watch:{
    date(){
      this.news = []
      this.loaded = false
      this.dateArr = this.date.split('-').map(Number)
      if(wx.getStorageSync('openid')) this.getNews()
      else this.net.getOpenID(this.rootUrl).then(() => this.getNews())
    }
  },
  methods:{
    getNews(){
      this.net.loadNews(this.dateArr[0],this.dateArr[1],this.dateArr[2],this.type,this.rootUrl).then(res=>{
        this.paraShow = new Array(res.length)
        this.news = res
        wx.setStorageSync(`NewsList_${this.type}`,res)
        wx.hideLoading()
        this.loaded = true
      })
    },
    showOrHide(i){
      this.$set(this.paraHide,i,this.paraHide[i] ? false : true)
      // this.paraShow[i] = this.paraShow[i] ? false : true
    }
  }
}
</script>
<style lang="stylus" scoped>
.para-title
  Flex(flex, , center)
  Font(32rpx, 32rpx, bold)
  color #424242
  margin-top 10rpx
  .right
    margin 0 20rpx
    Triangle(right, 25rpx, 18rpx)
  .down
    margin 0 18rpx
    Triangle(down, 25rpx, 18rpx)
.link
  display flex
  Font(32rpx, 40rpx)
  margin-top 20rpx
  padding-right 10rpx
  .color
    flex none
    margin 10rpx 20rpx 0 20rpx
    Height_Width(20rpx)
    border-radius 50%
    background themeColor
  img
    position relative
    bottom 5rpx
    margin-left 5rpx
    Height_Width(35rpx)
    vertical-align middle
.item
  Flex(flex,,center)
  height 140rpx
  padding 0 20rpx 0 35rpx
  margin-top 20rpx
  img
    Height_Width(140rpx)
    margin-right 20rpx
    flex none
  .right
    Flex(flex,space-between,,column)
    height 120rpx
    flex auto
    .title
      Font(30rpx, 40rpx)
      margin-top -5rpx
    .time
      Font(28rpx, 28rpx)
      color grey

.nodata
  padding 30rpx
  Flex(flex,,center)
  Font(30rpx)
  .loadimg
    Height_Width(30rpx)
    margin-right 10rpx
</style>
