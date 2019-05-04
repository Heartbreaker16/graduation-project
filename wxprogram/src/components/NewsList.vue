<template>
<div>
<div v-for="(para,i) in news" :key="i" style="padding-bottom: 20rpx;">
  <div class="para-title"><div/>{{para.tags}}</div>
  <navigator :url="'../newsDetail/main?NSID='+news.NSID+'&type='+type+'&index='+(para.index+j)+'&year='+dateArr[0]+'&month='+dateArr[1]+'&day='+dateArr[2]" 
    class="link" v-for="(news,j) in para.arr" :key="j">
    <div class="color"/>
    <div class="content">{{news.title}}<img src="/static/imgs/link.png"></div>
  </navigator>
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
      news: [],
      dateArr: [],
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
        this.news = res
        wx.setStorageSync(`NewsList_${this.type}`,res)
        wx.hideLoading()
        this.loaded = true
      })
    }
  }
}
</script>
<style lang="stylus" scoped>
.para-title
  Flex(flex, , center)
  Font(32rpx, 32rpx, bold)
  margin 32rpx 0 20rpx 0
  color #424242
  div
    margin-right 20rpx
.link
  display flex
  Font(32rpx, 40rpx)
  margin-top 12rpx
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
.nodata
  padding 30rpx
  Flex(flex,,center)
  Font(30rpx)
  .loadimg
    Height_Width(30rpx)
    margin-right 10rpx
</style>
