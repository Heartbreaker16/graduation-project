<template>
<div>
<div :class='{hide:loaded}' class='LoadingMask' style='z-index: 9;'>
  <img class='loadimg' src="/static/imgs/loading.png">
</div>
<swiper duration=200 :current='index' @animationfinish='change' :circular="type==='likes'">
  <swiper-item class='right' v-if="type!=='likes'">
    <div>→右拉加载更多</div>
  </swiper-item>
  <swiper-item v-for='(v,i) in newsArr' :key='i'>
    <scroll-view scroll-y>
      <img :src="rootUrl+'news/'+v.NSID+'.jpg'" mode='widthFix'>
      <div class='title'>{{v.title}}</div>
      <div class='main'>
        <wxParse :content='v.detail' noData='加载中……'/>
      </div>
      <Share :year='year || v.year' :month='month || v.month-1' :day='day || v.day' :likeStatus='v.likes ? 1:0' @share='showModal=true' @changeLike='changeLike(i)'/>
    </scroll-view>
  </swiper-item>
  <swiper-item v-if='loaded && newsArr.length==0' class='nodata'>
    <img src="data:image/svg+xml;utf8;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTkuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIiB3aWR0aD0iNTEycHgiIGhlaWdodD0iNTEycHgiPgo8cGF0aCBzdHlsZT0iZmlsbDojRURBNzUxOyIgZD0iTTEyOS4wNzUsMjg1LjIxNWM3LjE0My0xOS42MjYsNS4xMjYtNDQuNDg1LTMxLjA3Ni02Mi4wNTRjLTM2LjQ4OC0xNy43MDgtNzAuMDI1LTguMDY1LTkxLjM2NCw3Ljg1MiAgYy01LjI2MSwzLjkyNC03LjcwMywxMC42MzMtNi4xOTUsMTcuMDJjNi4xMTYsMjUuOTA5LDI1LjYwOCw1NC44NTMsNjQuOTQxLDY0Ljc0M0MxMDQuNDA3LDMyMi41ODgsMTIxLjkzMSwzMDQuODQxLDEyOS4wNzUsMjg1LjIxNSAgeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY5MUFCOyIgZD0iTTEuNDY5LDI1MS45NDRjNy4wOTcsMjQuODQ5LDI2LjU0Nyw1MS40MzcsNjMuOTEyLDYwLjgzMmMzMy44MjYsOC41MDUsNTEuNDkyLTMuNjk4LDYwLjI1Mi0xOS44OCAgQzc5LjY5NywyMzQuODk2LDI5LjIsMjQxLjYzNywxLjQ2OSwyNTEuOTQ0eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRURBNzUxOyIgZD0iTTIxNS4yNjEsMjM1LjQ1NWMtMjAuNTY5LTMuNjI3LTQxLjA4OS0xNy44MDMtMzguMjAzLTU3Ljk0ICBjMi45MDktNDAuNDUzLDI4LjAyOC02NC42NzUsNTIuNDgyLTc1LjE5N2M2LjAyOS0yLjU5NCwxMy4wNi0xLjM1NCwxNy44MzgsMy4xNDVjMTkuMzgsMTguMjUxLDM0LjcsNDkuNjA0LDIzLjU5OCw4OC42MTIgIEMyNTkuOTYsMjMyLjc3OSwyMzUuODI5LDIzOS4wODIsMjE1LjI2MSwyMzUuNDU1eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkY5MUFCOyIgZD0iTTI1MC4yNSwxMDguMzFjMTcuOTcxLDE4LjU3LDMxLjI3Myw0OC43MDksMjAuNzI2LDg1Ljc2NmMtOS41NDgsMzMuNTQ3LTI4Ljk0OCw0Mi43NDQtNDcuMzQzLDQyLjI0ICBDMTk2LjM3MiwxNjcuNTM0LDIyNy40NTksMTI3LjE3MywyNTAuMjUsMTA4LjMxeiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojRkZEQzlDOyIgZD0iTTMwMi44NTQsMjA4LjI4MWMzMS44MjQsNTUuMTIxLTguMjEyLDExMC40MjUtNzQuNzkyLDE0OC44NjVzLTEzNC40OTMsNDUuNDYtMTY2LjMxNy05LjY2MSAgcy0zLjY0OC0xMzAuOTY3LDYyLjkzMi0xNjkuNDA3UzI3MS4wMywxNTMuMTYsMzAyLjg1NCwyMDguMjgxeiIvPgo8cGF0aCBzdHlsZT0ib3BhY2l0eTowLjE1O2ZpbGw6I0MxN0EwMDtlbmFibGUtYmFja2dyb3VuZDpuZXcgICAgOyIgZD0iTTY5LjIwMywyMzAuNjUyYy0yMy41NTEsMzcuMTgtMjcuOTY4LDgxLjMxLTcuNDU4LDExNi44MzQgIGMyNy4zNTcsNDcuMzg0LDgxLjM4Miw0OC44NDcsMTM4LjMwNSwyMy45MDZDOTYuNzgzLDM2OS44NTcsNzEuMTc3LDMwMi4zODEsNjkuMjAzLDIzMC42NTJ6Ii8+CjxnPgoJCgkJPGVsbGlwc2UgdHJhbnNmb3JtPSJtYXRyaXgoLTAuNSAtMC44NjYgMC44NjYgLTAuNSAtODUuNTE3NCA1NzkuMzM5MykiIHN0eWxlPSJmaWxsOiNGRjkxQUI7IiBjeD0iMTI0LjQ4IiBjeT0iMzE0LjM1NiIgcng9IjIwLjA3IiByeT0iMjUuMTk5Ii8+CgkKCQk8ZWxsaXBzZSB0cmFuc2Zvcm09Im1hdHJpeCgwLjUgMC44NjYgLTAuODY2IDAuNSAzMzQuNDk1OSAtODcuMjUwNCkiIHN0eWxlPSJmaWxsOiNGRjkxQUI7IiBjeD0iMjQyLjgxIiBjeT0iMjQ2LjA2MSIgcng9IjIwLjA3IiByeT0iMjUuMTk5Ii8+CjwvZz4KPGc+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDk1MDU5OyIgZD0iTTExNy4yMjksMjk2LjgzNWMtMC40ODUsMC0wLjk3LTAuMDE2LTEuNDU0LTAuMDQ3Yy00LjEzMy0wLjI2OC03LjI2Ny0zLjgzNi03LTcuOTY5ICAgYzAuMjY4LTQuMTMzLDMuODQtNy4yNyw3Ljk2OS03YzEuNjQ0LDAuMTA2LDMuNDczLTAuMzY2LDUuMTQ1LTEuMzMxYzEuNjcxLTAuOTY0LDIuOTk0LTIuMzExLDMuNzI0LTMuNzg5ICAgYzEuODM0LTMuNzE0LDYuMzM0LTUuMjM3LDEwLjA0Ni0zLjQwMmMzLjcxNCwxLjgzNSw1LjIzNyw2LjMzMywzLjQwMiwxMC4wNDZjLTIuMDU4LDQuMTY1LTUuNDAzLDcuNjctOS42NzMsMTAuMTM1ICAgQzEyNS41NjUsMjk1LjY4NywxMjEuMzg5LDI5Ni44MzUsMTE3LjIyOSwyOTYuODM1eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzQ5NTA1OTsiIGQ9Ik0yMTAuMTAzLDI0My4yMTZjLTAuNDg2LDAtMC45NzItMC4wMTYtMS40NTgtMC4wNDdjLTQuMTMzLTAuMjY5LTcuMjY3LTMuODM3LTYuOTk4LTcuOTcxICAgYzAuMjY5LTQuMTM0LDMuODMyLTcuMjYyLDcuOTcxLTYuOTk4YzEuNjQ1LDAuMTExLDMuNDcxLTAuMzY2LDUuMTQzLTEuMzMxYzEuNjcxLTAuOTY1LDIuOTk0LTIuMzExLDMuNzI0LTMuNzg4ICAgYzEuODM0LTMuNzEzLDYuMzMzLTUuMjM2LDEwLjA0Ni0zLjQwM2MzLjcxNCwxLjgzNSw1LjIzNyw2LjMzMywzLjQwMywxMC4wNDZjLTIuMDU4LDQuMTY2LTUuNDAyLDcuNjctOS42NzMsMTAuMTM2ICAgQzIxOC40MzcsMjQyLjA2NywyMTQuMjYzLDI0My4yMTYsMjEwLjEwMywyNDMuMjE2eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzQ5NTA1OTsiIGQ9Ik05Mi41NCwzMzcuNjAzYy0xLjk2MiwwLTMuOTIxLTAuNzY1LTUuMzkzLTIuMjg3Yy0yLjg3OS0yLjk3OC0yLjc5OS03LjcyNiwwLjE3OS0xMC42MDUgICBjNS4yNTYtNS4wODIsMTkuMjY4LTE0LjYyOSwyNi45NDctMTcuODA2YzMuODI4LTEuNTgyLDguMjE0LDAuMjM2LDkuNzk3LDQuMDY0cy0wLjIzNiw4LjIxNC00LjA2NCw5Ljc5NyAgIGMtNS44MDcsMi40MDEtMTguMjIxLDEwLjgyOS0yMi4yNTUsMTQuNzI5Qzk2LjI5NiwzMzYuOTAzLDk0LjQxNiwzMzcuNjAzLDkyLjU0LDMzNy42MDN6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDk1MDU5OyIgZD0iTTExNC40MTMsMzU5LjQ2Yy0xLjAwMSwwLTIuMDE4LTAuMjAyLTIuOTk0LTAuNjI3Yy0zLjc5Ny0xLjY1Ni01LjUzMi02LjA3Ni0zLjg3Ni05Ljg3MyAgIGMyLjkyMi02LjcwMSwxMi4yNC0yMC44NjgsMTguMTMxLTI2LjczMWMyLjkzNS0yLjkyMiw3LjY4NC0yLjkxMiwxMC42MDYsMC4wMjRjMi45MjIsMi45MzYsMi45MTEsNy42ODUtMC4wMjQsMTAuNjA3ICAgYy00LjQ1NSw0LjQzNC0xMi43MjIsMTYuOTU2LTE0Ljk2NCwyMi4wOTdDMTIwLjA2MSwzNTcuNzc3LDExNy4zMDUsMzU5LjQ2LDExNC40MTMsMzU5LjQ2eiIvPgoJPHBhdGggc3R5bGU9ImZpbGw6IzQ5NTA1OTsiIGQ9Ik0yNDYuMDIsMjQ2LjkzMWMtMi4yNTEsMC00LjQ3Ni0xLjAwOS01Ljk1My0yLjkzMmMtMi41MjMtMy4yODUtMS45MDYtNy45OTQsMS4zNzktMTAuNTE3ICAgYzYuNTkyLTUuMDYzLDIxLjg2Ni0xMi40MjQsMjguODk1LTE0LjQzNWMzLjk3OS0xLjEzNiw4LjEzNCwxLjE2Nyw5LjI3Myw1LjE0OGMxLjEzOSwzLjk4Mi0xLjE2Niw4LjEzNC01LjE0OCw5LjI3NCAgIGMtNS4zOTMsMS41NDItMTguODk4LDguMDgxLTIzLjg4MiwxMS45MDlDMjQ5LjIyMSwyNDYuNDI1LDI0Ny42MTQsMjQ2LjkzMSwyNDYuMDIsMjQ2LjkzMXoiLz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM0OTUwNTk7IiBkPSJNMjUwLjk3LDI2NS43NThjLTMuMzA1LDAtNi4zMzEtMi4yMDEtNy4yMzYtNS41NDRjLTEuMDgxLTMuOTk5LDEuMjg0LTguMTE2LDUuMjgzLTkuMTk4ICAgYzguMDI1LTIuMTY4LDI0Ljk1LTMuMTUzLDMyLjIxNS0yLjMzNWM0LjExNiwwLjQ2NCw3LjA3Niw0LjE3Nyw2LjYxMiw4LjI5M2MtMC40NjUsNC4xMTctNC4xODQsNy4wNzItOC4yOTQsNi42MTIgICBjLTUuNTczLTAuNjI5LTIwLjU1MiwwLjI2OS0yNi42MTksMS45MTFDMjUyLjI3NywyNjUuNjczLDI1MS42MTgsMjY1Ljc1OCwyNTAuOTcsMjY1Ljc1OHoiLz4KPC9nPgo8Y2lyY2xlIHN0eWxlPSJmaWxsOiNGRjkxQUI7IiBjeD0iMTgwLjQiIGN5PSIyNzQuNTkiIHI9IjcuNTUzIi8+CjxwYXRoIHN0eWxlPSJmaWxsOiM3Njk0RTQ7IiBkPSJNMzc3LjU5MSwyNTIuMTA1YzE1NS40NzYsMTAuNjM5LDE0OS43ODEsOTAuOTk3LDExMi4yMjQsMTMxLjM0OSAgYy0xMC4wMjIsMTAuNzY4LTIzLjI4NiwxNy45NzYtMzcuNjgzLDIwLjk5NmMtNzQuMjY1LDE1LjU3Ni0yMDMuNTEtMC4yMzktMjM4LjE2My05LjQxNWMwLDAtMi44MzMtMzguODI5LDQ1LjcyMy04Ni4wMDUgIEMzMTMuMTY4LDI1Ny4wNzQsMzQzLjc1LDI1MS40MDUsMzc3LjU5MSwyNTIuMTA1eiIvPgo8cGF0aCBzdHlsZT0iZmlsbDojN0NDNUU2OyIgZD0iTTE1OS40MTMsMzc5LjgwOGMyNi44MzEtMzUuMDIsMTA2LjY5OC0xMzAuODQ0LDE3My4xMjQtMTQ3LjI0ICBjNi42NDgtMS42NDEsMTMuNTg4LTEuODQ1LDIwLjI2My0wLjMxNWM4LjA1MywxLjg0NiwxNC40MzEsNC43OSwxOS42MDcsOC41MDVjNi4zMTQsNC41MzIsNi4yODcsMTMuOTEzLTAuMDk0LDE4LjM0OSAgQzMzNi40NTgsMjg0LjAzNiwyNTAuNDk3LDM1OS4yLDIyMy40OSwzOTAuNzI5Yy0yLjU1MywyLjk4MS01LjkwNSw1LjE4Ni05LjY5Myw2LjIxM2MtMTQuNjExLDMuOTU4LTMyLjQzMSw1LjAxMy00OC40NCwwLjcwMiAgQzE1Ny42MDIsMzk1LjU1NSwxNTQuNTI5LDM4Ni4xODMsMTU5LjQxMywzNzkuODA4eiIvPgo8Zz4KCTxwYXRoIHN0eWxlPSJmaWxsOiM0OTUwNTk7IiBkPSJNMzg1LjI4NywyMDkuOTI2aC00MC4xMTljLTQuNjEzLDAtOC43MjktMi45MjgtMTAuMjQxLTcuMjg2cy0wLjA5Ni05LjIwNiwzLjUyNS0xMi4wNjMgICBsMzAuMzM3LTIzLjk1aC0yOC4xMzdjLTQuMTQyLDAtNy41LTMuMzU4LTcuNS03LjVzMy4zNTgtNy41LDcuNS03LjVoNDAuMTE4YzQuNjEyLDAsOC43MjksMi45MjgsMTAuMjQsNy4yODYgICBjMS41MTMsNC4zNTcsMC4wOTcsOS4yMDYtMy41MjQsMTIuMDY0bC0zMC4zMzYsMjMuOTVoMjguMTM3YzQuMTQzLDAsNy41LDMuMzU4LDcuNSw3LjVTMzg5LjQzLDIwOS45MjYsMzg1LjI4NywyMDkuOTI2eiAgICBNMzgwLjc3LDE2Ni42MjZoMC4wMUgzODAuNzd6Ii8+Cgk8cGF0aCBzdHlsZT0iZmlsbDojNDk1MDU5OyIgZD0iTTQ2MS4wMjIsMTc3LjMxMWgtNDAuMTE4Yy00LjYxMywwLTguNzI5LTIuOTI4LTEwLjI0MS03LjI4NmMtMS41MTMtNC4zNTgtMC4wOTctOS4yMDYsMy41MjQtMTIuMDY0ICAgbDMwLjMzNy0yMy45NWgtMjguMTM3Yy00LjE0MywwLTcuNS0zLjM1OC03LjUtNy41czMuMzU3LTcuNSw3LjUtNy41aDQwLjExOGM0LjYxMiwwLDguNzI4LDIuOTI4LDEwLjI0LDcuMjg1ICAgYzEuNTE0LDQuMzU3LDAuMDk4LDkuMjA2LTMuNTIyLDEyLjA2NGwtMzAuMzM5LDIzLjk1MWgyOC4xMzdjNC4xNDIsMCw3LjUsMy4zNTgsNy41LDcuNSAgIEM0NjguNTIyLDE3My45NTMsNDY1LjE2NSwxNzcuMzExLDQ2MS4wMjIsMTc3LjMxMXogTTQ1Ni41MDYsMTM0LjAxMWgwLjAxSDQ1Ni41MDZ6Ii8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" />
    今日暂无活动安排，休息一下……
  </swiper-item>
  <swiper-item class='left' v-if="type!=='likes'">
    <div>←左拉加载更多</div>
  </swiper-item>
</swiper>

<ShareMenu v-if='showModal' @shareImg='shareImg' @cancel='showModal=false'/>
<div v-if='shifting' class='LoadingMask'>
  <div v-if='index==0' class='shift'>
    <div class='text'>前一天的运营热点也有料</div>
    <div class='line-scale-pulse-out-rapid'><div/><div/><div/><div/><div/></div>
  </div>
  <div v-else-if='newsArr.length>0 && index==newsArr.length+1' class='shift'>
    <div class='text'>后一天的运营热点更精彩</div>
    <div class='line-scale-pulse-out-rapid'><div/><div/><div/><div/><div/></div>
  </div>
  <div v-else-if='newsArr.length==0 && index==2' class='shift'>
    <div class='text'>后一天的运营热点更精彩</div>
    <div class='line-scale-pulse-out-rapid'><div/><div/><div/><div/><div/></div>
  </div>
</div>

<div v-if='showTip' class='tip' @tap='hideTip'>
  <span>←</span>
  <span>左右滑动可以翻页</span>
  <span>→</span>
</div>
</div>
</template>

<script>
import wxParse from 'mpvue-wxparse'
import Share from '@/components/ShareItem'
import ShareMenu from '@/components/ShareMenu'
export default {
  components: { wxParse, Share, ShareMenu },
  data() {
    return {
      newsArr: [],
      index: -1,
      year: 0,
      month: 0,
      day: 0,
      showModal: false,
      loaded: false,
      shifting: false,
      shift: 0,
      showTip: false,
      type: '',
      handling: false
    }
  },
  methods: {
    // 页面首次加载，从缓存中获得新闻列表 
    loadNews(data) {
      const arr =  wx.getStorageSync(`DailyNews_${data.type}`)
      // 若缓存不存在或与首页日期不一致，则重新加载
      if (arr.length == 0 || data.NSID != arr[this.index-1].NSID) {
        this.net.loadNews(this.year, this.month, this.day, data.type,this.rootUrl).then(() => {
          this.newsArr = wx.getStorageSync(`DailyNews_${data.type}`)
          this.index = this.id2Index(data.NSID,this.newsArr) + 1
          console.log(this.index)
          this.loadWatcher()
          wx.hideLoading()
        })
      } else {
        this.newsArr = arr
        this.loadWatcher()
      }
    },
    loadLikesNews(data){
      const arr =  wx.getStorageSync('DailyNews_likes')
      // 若缓存不存在或与首页日期不一致，则等待
      if (arr.length == 0 || data.NSID != arr[this.index].NSID) {
        setTimeout(() => this.loadLikesNews(data), 80)
      } else {
        this.newsArr = arr
        this.loadWatcher()
      }
    },
    // 监听滑动切换事件
    change(e) {
      this.index = e.mp.detail.current
      if(this.type === 'likes') return
      // 边界状态，此时开始切换前一天/后一天新闻
      if (this.index == 0) {
        this.dayShift(-1)
      } else if (this.newsArr.length>0 && this.index == this.newsArr.length + 1) {
        this.dayShift(1)
      } else if (this.newsArr.length==0 && this.index == 2) {
        this.dayShift(1)
      }
    },
    // 用于控制详情页左右滑动切换前一天/后一天新闻时的页面状态
    loadWatcher(){
      if(this.newsArr.length > 0){
        if(this.shift != 0){
          this.index = this.shift == 1 ? 1 : this.newsArr.length + (this.type === 'likes' ? -1 : 0)
        }
        setTimeout(()=> this.loaded = true, 300)
      }else{
        this.index = 1 + (this.type === 'likes' ? -1 : 0)
        this.loaded = true
      }
    },
    // 切换前一天/后一天新闻
    dayShift(num) {
      this.shifting = true
      this.loaded = false
      this.shift = num
      const dateObj = new Date(this.year, this.month, this.day + num)
      this.net.loadNews(dateObj.getFullYear(), dateObj.getMonth(), dateObj.getDate(), this.type,this.rootUrl).then(() => {
        this.newsArr = []
        this.newsArr = wx.getStorageSync(`DailyNews_${this.type}`)
        this.shifting = false
        this.year = dateObj.getFullYear()
        this.month = dateObj.getMonth()
        this.day = dateObj.getDate()
        this.loadWatcher()
      })
      wx.setNavigationBarTitle({title: `${dateObj.getFullYear()}-${dateObj.getMonth()+1}-${dateObj.getDate()}`})
    },
    shareImg() {
      const index = this.index + (this.type === 'likes' ? 0 : -1)
      const url = `../canvas/main?type=${this.type}&index=${index}&year=${this.year || this.newsArr[index].year}&month=${this.month || this.newsArr[index].month-1}&day=${this.day || this.newsArr[index].day}`
      wx.navigateTo({ url })
    },
    changeLike(i){
      if(this.handling) return
      this.handling = true
      const news = this.newsArr[i]
      wx.request({
        url: this.rootUrl + 'changeLike',
        data:{
          openid: wx.getStorageSync('openid'),
          targetStatus: news.likes ? 0 : 1,
          NSID: news.NSID
        },
        success: res => {
          if(res.data === 'ok') {
            this.$set(this.newsArr[i], 'likes', news.likes ? 0 : 1)
            wx.setStorageSync(`DailyNews_${this.type}`,this.newsArr)
            if(this.type !== 'day') wx.removeStorageSync('DailyNews_day')
            if(this.type !== 'month') wx.removeStorageSync('DailyNews_month')
            if(this.type !== 'likes') wx.removeStorageSync('DailyNews_likes')
          }
          this.handling = false
        }
      })
    },
    hideTip(){
      this.showTip = false
      wx.setStorageSync('showTip',false)
    },
    id2Index(id, newsArr){
      const length = newsArr.length
      for(let i = 0; i < length; i++){
        if(newsArr[i].NSID == id){
          return i
        }
      }
    }
  },
  onLoad() {
    if(wx.getStorageSync('showTip')){
      this.showTip = true
    }
    this.handling = false
    this.showModal = false
    const data = this.$root.$mp.query
    console.log(data);
    this.type = data.type
    if(this.type === 'likes'){
      this.index = parseInt(data.index)
      wx.setNavigationBarTitle({title: '我的点赞'})
      this.loadLikesNews(data)
    } else {
      [this.year,this.month,this.day] = [data.year,data.month,data.day].map(Number)
      if(data.index) this.index = parseInt(data.index) + 1
      wx.setNavigationBarTitle({title: `${this.year}-${this.month+1}-${this.day}`})
      this.loadNews(data)
    }
  },
  onShareAppMessage() {
    return {
      title: this.newsArr[this.index-1].title,
      imageUrl: this.newsArr[this.index-1].img,
      path: `${this.$mp.page.route}?type=${this.type}&NSID=${this.newsArr[this.index-1].NSID}&year=${this.year}&month=${this.month}&day=${this.day}`
    }
  },
  onUnload() {
    this.loaded = false
    this.shift = 0
    this.index = -1
    this.newsArr = []
    this.year = 0
    this.month = 0
    this.day = 0
    this.type = ''
    this.showModal = false
    this.shifting = false
  }
}
</script>
<style lang="stylus" scoped>
swiper
  position absolute
  top 0
  left 0
  Height_Width(100%)
swiper-item
  position relative
  overflow scroll
scroll-view
  height 100%
  overflow-y scroll
  img
    width 100%
  div
    padding 0 20rpx
    text-align justify
  .title
    Font(38rpx, 50rpx, bold)
    padding 20rpx
  .main
    Font(30rpx, 60rpx)
    color #777
  .link
    Font(35rpx)
    margin 20rpx 0 0 20rpx
    color blue
.left, .right
  Flex(flex, , center)
  Font(35rpx, 40rpx)
  color #777
  div
    width 40rpx
.right
  justify-content flex-end
.nodata
  Flex(flex, center, center, column)
  Font(35rpx)
  img 
    Height_Width(250rpx)
    margin-bottom 30rpx

.LoadingMask
  position fixed
  Flex(flex, center, center)
  background white
  Height_Width(100%)
  z-index 99999
  .loadimg
    Height_Width(50rpx)
.tip
  position fixed
  Height_Width(100%)
  Flex(flex, space-between, center)
  Font(40rpx)
  color grey
  background white
  opacity .9

.shift
  position fixed
  Height_Width(100%)
  Flex(flex,center,center,column)
  .text
    Font(30rpx,35rpx)
    color #777
    margin-bottom 20rpx
    width 40rpx
@-webkit-keyframes line-scale-pulse-out-rapid
  0%
    transform scaley(1)
  80%
    transform scaley(.3)
  90%
    transform scaley(1)
.line-scale-pulse-out-rapid > div
  background #279fcf
  Height_Width(35px,4px)
  border-radius 2px
  margin 2px
  animation-fill-mode both
  display inline-block
  cubic-bezier(.11, .49, .38, .78)
  animation line-scale-pulse-out-rapid .9s 0s infinite
  cubic-bezier(.11, .49, .38, .78)
.line-scale-pulse-out-rapid > div:nth-child(2), .line-scale-pulse-out-rapid > div:nth-child(4)
  animation-delay .25s !important
.line-scale-pulse-out-rapid > div:nth-child(1), .line-scale-pulse-out-rapid > div:nth-child(5)
  animation-delay .5s !important
</style>
