<template>
<div class='share'>
    <div class='mask' :class="{'hide-mask':mode=='homepage'}" catchtouchmove='a' @tap.stop='cancel'/>
    <div class='model' :class="{down:down, border: mode=='homepage'}">
        <button @tap='raiseCall' open-type='share' hover-class='hover'>分享</button>
        <button @tap='shareImg' hover-class='hover'>生成我的运营日历海报</button>
        <button @tap='exit' hover-class='hover' style='border-bottom:none;border-top:9rpx solid #EEE;'>取消</button>
    </div>
</div>
</template>

<script>
export default {
  props: ['mode'],
  data() {
    return {
      down: false
    }
  },
  methods:{
    shareImg() {
      this.exit()
      this.$emit('shareImg')
    },
    cancel(){
      this.$emit('cancel')
    },
    exit(){
      this.down = true
      setTimeout(()=>{
        this.cancel()
      },0)
    },
    raiseCall(){
      this.exit()
      this.net.raiseCallNum()
    },
    a(){
      console.log('a')
      return false
    }
  }
}
</script>
<style lang="stylus" scoped>
.mask
  Height_Width(100%)
  position fixed
  top 0
  left 0
  background rgba(0, 0, 0, 0.5)
  z-index 8000
.hide-mask
  background none
.border
    Border(1rpx,0,0,0)
.model
  position fixed
  bottom 0
  width 100%
  z-index 9000
  -webkit-animation _up .15s ease
  background white
  button
    border none
    Height_Width(100rpx, 100%)
    Font(35rpx, 100rpx)
    border-radius 0
    background white
    Border(0,0,1rpx,0)
    &::after
      border none
.down
  -webkit-animation _down .1s ease

@-webkit-keyframes _up
  0%
    transform translateY(100%)
  100%
    transform translateY(0)

@-webkit-keyframes _down
  0%
    transform translateY(0)
  100%
    transform translateY(100%)
</style>
