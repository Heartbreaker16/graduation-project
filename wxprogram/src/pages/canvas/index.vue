<template>
<div class='container'>
  <canvas :style="styleWidth + styleHeight" canvas-id='firstCanvas'/>
  <div style='width:100%;height:90rpx;'/>
  <cover-view v-if='loaded' class='button' @tap='save' hover-class='press'>保存到相册</cover-view>
</div>
</template>

<script>
export default {
  data() {
    return {
      img: '',
      styleWidth: 'width:400px;',
      styleHeight: 'height:8000px;',
      callNum: 0,
      content: [],
      title: '',
      date: '',
      year: '',
      week: '',
      lunar: '',
      tempFilePath: '',
      loaded: false,
      screenWidth: 0,
      type: ''
    }
  },
  methods: {
    justifyString(ctx, str, canvasWidth) {
      let lineWidth = ctx.measureText(str).width
      while (canvasWidth - lineWidth > this.rpx2px(12)) {
        let lastStr = str
        str = str.replace(/[”.。,，、；;:：？?!！ ]/g, '$& ').replace('“',' “').replace(/[+-]/g,' $& ').replace(/(\s*$)/g, '')
        if (str == lastStr) { break }
        lineWidth = ctx.measureText(str).width
      }
      while (canvasWidth < lineWidth) {
        let lastStr = str
        if(str.replace('  ',' ').length == lastStr.length){
          str = str.replace(' ','')
        }else{
          str = str.replace('  ', ' ')//优先替换连续空格
        }
        if (str == lastStr) { break }
        lineWidth = ctx.measureText(str).width
      }
      return str
    },
    drawText(ctx, str, curHeight, lineHeight, paddingleft, canvasWidth) {
      let lineWidth = 0
      let lastSubStrIndex = 0 //每次开始截取的字符串的索引
      const mark = new RegExp(/["”.,;?!:，。？！；：、]/)
      for (let i = 1; i <= str.length; i++) {
        lineWidth = ctx.measureText(str.substring(lastSubStrIndex, i)).width
        if (lineWidth > canvasWidth) {
          const currentSubStrIndex = mark.test(str[i - 1]) ? i - 2 : i - 1
          ctx.fillText(this.justifyString(ctx, str.substring(lastSubStrIndex, currentSubStrIndex), canvasWidth), paddingleft, curHeight)
          curHeight += lineHeight //字体的高度 (行高)
          lineWidth = 0
          lastSubStrIndex = currentSubStrIndex
        }
        if (i == str.length) { //绘制剩余部分
          ctx.fillText(str.substring(lastSubStrIndex, i), paddingleft, curHeight)
          curHeight += lineHeight
        }
      }

      return curHeight
    },
    drawFoot(ctx, curHeight, canvasWidth) {
      ctx.setTextBaseline('top')
      this.setFontStyle(this.rpx2px(128),'#000',ctx, true)
      ctx.fillText(this.date, this.rpx2px(30) , curHeight)//绘制截取部分
      const width = ctx.measureText(this.date).width
      this.setFontStyle(26,'#000',ctx, false)
      ctx.fillText(`${this.year}年 ${this.week}`, this.rpx2px(40) + width , curHeight + this.rpx2px(10))
      ctx.fillText(`农历${this.lunar}`, this.rpx2px(40) + width , curHeight + this.rpx2px(38))
      this.setFontStyle(28,'#777',ctx, false)
      ctx.fillText('运营日历——运趋势热点，营人心人性', this.rpx2px(30) , curHeight + this.rpx2px(80))
      ctx.fillText(`已助力 ${this.callNum}次运营`, this.rpx2px(30) , curHeight + this.rpx2px(110))
      this.styleHeight = `height:${curHeight + this.rpx2px(200)}px;`
      ctx.drawImage('/static/imgs/qrcode.jpg', canvasWidth - this.rpx2px(190), curHeight - this.rpx2px(10), this.rpx2px(160), this.rpx2px(160))
      return curHeight + this.rpx2px(200)
    },
    // 详情页生成图片
    DrawNewsDetail(w) {
      const ctx = wx.createCanvasContext('firstCanvas')
      this.blankCanvas(w,10000,ctx,'#fff')
      ctx.drawImage(this.img, 0, 0, w, w)
      let curHeight = this.rpx2px(70) + w //绘制字体距离canvas顶部初始的高度

      this.setFontStyle(36,'#000',ctx, true)
      curHeight = this.drawText(ctx, this.title, curHeight, this.rpx2px(60), this.rpx2px(30), w - this.rpx2px(60)) + this.rpx2px(20)// 调用行文本换行函数

      this.setFontStyle(30,'#777',ctx, false)
      this.content.forEach(v => curHeight = this.drawText(ctx, v, curHeight, this.rpx2px(50), this.rpx2px(30), w - this.rpx2px(60)))

      curHeight = this.drawFoot(ctx, curHeight + this.rpx2px(20), w)

      this.canvasToTempFile(w,curHeight,ctx,'firstCanvas')
    },
    // Tab页生成图片
    DrawDailyNews(w, height=0) {
      const ctx = wx.createCanvasContext('firstCanvas')
      this.blankCanvas(w, height > 0 ? height + this.rpx2px(220) : 30000, ctx,'#f6f6f6')
      this.roundRect(ctx, this.rpx2px(30), this.rpx2px(30), w-this.rpx2px(60), height > 0 ? height : 8000, this.rpx2px(20))
      ctx.drawImage('/static/imgs/sharebg.jpg', 0, 0, w, parseInt((w) * 6.1 / 16))
      let curHeight = parseInt((w) * 6.1 / 16) + this.rpx2px(60)
      const newsList = wx.getStorageSync(`NewsList_${this.type}`)

      newsList.forEach(v=>{
        this.setFontStyle(34,'#000',ctx, true)
        curHeight = this.drawText(ctx, v.tags, curHeight, this.rpx2px(60), this.rpx2px(60), w - this.rpx2px(120))
        v.arr.forEach(v1 => {
          ctx.beginPath()
          ctx.arc(this.rpx2px(70), curHeight-this.rpx2px(12), this.rpx2px(8), 0, 2 * Math.PI)
          ctx.setFillStyle('#DF4E2F')
          ctx.fill()
          ctx.closePath()
          this.setFontStyle(30,'#000',ctx, false)
          curHeight = this.drawText(ctx, v1.body, curHeight, this.rpx2px(50), this.rpx2px(100), w - this.rpx2px(160)) + this.rpx2px(20)
        })
      })
      if(height == 0){
        this.DrawDailyNews(w,curHeight)
      }else{
        this.setFontStyle(34,'#fff',ctx, false)
        ctx.fillText('运营日历', this.rpx2px(60), this.rpx2px(100))
        ctx.fillText(this.week, this.rpx2px(60), parseInt((w) * 6.1 / 16)-50)
        ctx.fillText(`${this.year}-${this.date}`, this.rpx2px(60), parseInt((w) * 6.1 / 16)-20)
        let slogan = '运趋势热点，营人心人性'
        let paddingleft = parseInt(w - ctx.measureText(slogan).width - 30)
        ctx.fillText(slogan, paddingleft, parseInt((w) * 6.1 / 16)-20)
        ctx.restore()
        ctx.save()
        ctx.beginPath()
        ctx.setFillStyle('white')
        ctx.shadowBlur = 10
        ctx.shadowColor = '#CCC'
        ctx.arc(w/2 , curHeight + this.rpx2px(30), this.rpx2px(70), 0, 2 * Math.PI)
        ctx.fill()
        ctx.closePath()
        ctx.shadowBlur = 0
        ctx.clip()
        ctx.drawImage('/static/imgs/qrcode.jpg', w/2 - this.rpx2px(60), curHeight - this.rpx2px(30), this.rpx2px(120), this.rpx2px(120))
        ctx.restore()
        this.setFontStyle(30,'grey',ctx, false)
        slogan = '长按识别，进入运营日历'
        paddingleft = parseInt((w - ctx.measureText(slogan).width)/2)
        ctx.fillText(slogan, paddingleft, curHeight + this.rpx2px(150))
        slogan = `已助力 ${this.callNum}次运营`
        paddingleft = parseInt((w - ctx.measureText(slogan).width)/2)
        ctx.fillText(slogan, paddingleft, curHeight + this.rpx2px(190))
        this.styleHeight = `height:${curHeight + this.rpx2px(220)}px;`
        this.canvasToTempFile(w,curHeight + this.rpx2px(220),ctx,'firstCanvas')
      }
    },
    rpx2px(rpx){
      return parseInt(rpx * this.screenWidth / 750)
    },
    roundRect(ctx, x, y, w, h, r) {
      ctx.save()
      ctx.beginPath()
      ctx.setFillStyle('white')
      ctx.shadowBlur = 10
      ctx.shadowColor = '#CCC'
      // 左上角
      ctx.arc(x + r, y + r, r, Math.PI, Math.PI * 1.5)
      
      // border-top
      ctx.moveTo(x + r, y)
      ctx.lineTo(x + w - r, y)
      ctx.lineTo(x + w, y + r)
      // 右上角
      ctx.arc(x + w - r, y + r, r, Math.PI * 1.5, Math.PI * 2)
      
      // border-right
      ctx.lineTo(x + w, y + h - r)
      ctx.lineTo(x + w - r, y + h)
      // 右下角
      ctx.arc(x + w - r, y + h - r, r, 0, Math.PI * 0.5)
      
      // border-bottom
      ctx.lineTo(x + r, y + h)
      ctx.lineTo(x, y + h - r)
      // 左下角
      ctx.arc(x + r, y + h - r, r, Math.PI * 0.5, Math.PI)
  
      // border-left
      ctx.lineTo(x, y + r)
      ctx.lineTo(x + r, y)

      ctx.fill()
      // ctx.stroke()
      ctx.closePath()
      ctx.clip()
      ctx.shadowBlur = 0
    },
    blankCanvas(width,height,ctx,bgcolor){ //新建空白画布
      ctx.fillStyle = bgcolor
      ctx.fillRect(0, 0, width, height)
      ctx.moveTo(0, 0)
    },
    setFontStyle(fontsize_rpx, color, ctx, ifbold){
      ctx.font = `normal ${ifbold ? 'bold ':''}${this.rpx2px(fontsize_rpx)}px sans-serif`
      ctx.fillStyle = color
    },
    canvasToTempFile(width,height,ctx,canvasId){
      wx.nextTick(() => {
        ctx.draw(false, () => {
          setTimeout(() => {
            wx.canvasToTempFilePath({
              canvasId,
              quality: 1,
              fileType: 'jpg',
              width,
              height,
              success: res => {
                this.tempFilePath = res.tempFilePath
                wx.hideLoading()
                this.loaded = true
              }
            }, this)}, 1000)
        })
      })
    },
    // 获取新闻标题、正文、图片等
    getNewsPageQuery(pageData) {
      return new Promise(resolve => {
        this.getHomePageQuery(pageData).then(res=>{
          if(res=='ok'){
            const newsData = wx.getStorageSync(`DailyNews_${this.type}`)[pageData.index]
            this.title = newsData.title
            this.content = newsData.detail.split('</p>').map(v =>v.replace(/(<p>)|(<br>)|(<[/]*strong>)|(&[a-z]+sp;)|(<[a-z]+ [^>=]+=[^>]+>)|(<\/[a-z]+>)/g, ''))
            // 需要调用该接口下载新闻头图才能生成图片
            wx.getImageInfo({
              src: this.rootUrl + 'news/'+ newsData.NSID + '.jpg',
              success: res => {
                this.img = res.path
                resolve('ok')
              },
              fail:res =>{
                wx.hideLoading()
                wx.showModal({title:'生成失败',content:'图片地址未配置SSL安全协议,请开启调试模式后再生成图片!',showCancel:false})
              }
            })
          }
        })
      })
    },
    // 获取日期等基本数据并raiseCallNum
    getHomePageQuery(pageData){
      return new Promise(resolve=>{
        this.year = pageData.year
        this.date = `${parseInt(pageData.month)+1}-${pageData.day}`
        const dateObj = this.calendar(pageData.year,pageData.month,pageData.day)
        this.week = dateObj.ncWeek
        this.lunar = dateObj.IMonthCn + dateObj.IDayCn
        this.type = pageData.type
        resolve('ok')
        // this.net.raiseCallNum().then(res=>{
        //   this.callNum = res
        //   resolve('ok')
        // })
      })
    },
    save() {
      wx.saveImageToPhotosAlbum({
        filePath: this.tempFilePath,
        success: res => {
          wx.navigateBack({
            delta: 1
          })
        }
      })
    }
  },
  onLoad() {
    wx.showLoading({ title: '正在生成' })
    wx.getSystemInfo({
      success: res1 => {
        this.screenWidth = res1.screenWidth
        const data = this.$root.$mp.query
        // 新闻详情页生成图片
        if(data.index){
          const canvasWidth = parseInt(res1.windowWidth * .94)
          this.styleWidth = `width:${canvasWidth}px;margin-left:3%;`
          this.getNewsPageQuery(data).then(res2 => {
            if (res2 == 'ok') {
              this.DrawNewsDetail(canvasWidth,0)
            }
          })
        // Tab页生成图片
        }else{
          const canvasWidth = parseInt(res1.windowWidth)
          this.styleWidth = `width:${canvasWidth}px;`
          this.getHomePageQuery(data).then(res=>{
            if(res == 'ok'){
              this.DrawDailyNews(canvasWidth)
            }
          })
        }
      }
    })
  },
  onUnload() {
    this.loaded = false
  }
}
</script>
<style lang='stylus' scoped>
.container
  position absolute
  // Height_Width(100%)
  width 100%
  min-height 100%
  Background()
  .button
    position fixed
    bottom 0
    width 100%
    text-align center
    letter-spacing 4rpx
    Font(38rpx, 90rpx)
    color white
    background #E64340
    // box-shadow inset 0px 30rpx 20rpx -30rpx #111 !important
  .press
    background #F3D2D1
</style>
