export default { loadNews, getOpenID }

function getOpenID(rootUrl) {
  return new Promise( resolve => {
    wx.login({
      success: res => {
        wx.request({
          url: 'https://api.weixin.qq.com/sns/jscode2session',
          data: {
            js_code: res.code,
            appid: 'wx664c5691c59f352a',
            secret: '91ab0902a42dff6e8b5cd3c9c7a3cc53',
            grant_type: 'authorization_code'
          },
          success: e => {
            wx.setStorageSync('openid',e.data.openid)
            register(rootUrl).then(e => resolve(true))
          },
          fail: err => {
            resolve(false)
          }
        })
      },
      fail: res => {
        resolve(false)
      }
    })
  })
}
function register(rootUrl){
  return new Promise(resolve => {
    wx.request({
      url: rootUrl + 'register',
      data:{ openid: wx.getStorageSync('openid') },
      success: res => {
        if(res.data === 'ok') resolve('ok')
      }
    })
  })
}
function correctTime(timeStr, format='date'){
  const twoNum = num => {return ('0'+num).slice(-2)}
  const tArr = timeStr.split(/\D+/).map(Number)
  switch(tArr.length){
    case 5: tArr.push(0);break;
    case 4: tArr.push(0,0);break;
    case 3: tArr.push(-8,0,0);break;
    case 2: tArr.push(1,-8,0,0);break;
    case 1: tArr.push(1,1,-8,0,0);break;
    default: break;
  }
  const myDate = new Date(tArr[0],tArr[1]-1,tArr[2],tArr[3]+8,tArr[4],tArr[5])
  switch(format){
    case 'date': return `${myDate.getFullYear()}-${twoNum(myDate.getMonth()+1)}-${twoNum(myDate.getDate())}`
    case 'full': return `${myDate.getFullYear()}-${twoNum(myDate.getMonth()+1)}-${twoNum(myDate.getDate())} ${twoNum(myDate.getHours())}:${twoNum(myDate.getMinutes())}`
    case 'DateObj': return myDate
  }
}
function loadNews(year, month, day, type, rootUrl) {
  return new Promise(resolve => {
    const openid = wx.getStorageSync('openid')
    if(openid)
      wx.request({
        url: rootUrl + 'getNewsByDate',
        data: {
          date: `${year}-${('0' + (month+1)).slice(-2)}-${('0' + day).slice(-2)}`,
          openid
        },
        success: res => {
          let news = []
          let object = {}
          // 日视图和月视图的缓存分开，便于管理，优化速度
          wx.setStorageSync(`DailyNews_${type}`, res.data)
          res.data.forEach((v, index) => {
            if (v.name != object.tags) {
              news.push(object)
              object = {
                tags: v.name,
                index,
                arr: [v]
              }
            } else {
              object.arr.push(v)
            }
          })
          news.push(object)
          news.splice(0, 1)
          resolve(news)
        }
      })
    else getOpenid(rootUrl).then(() => loadNews(year, month, day, type, rootUrl).then(e => resolve(e)))
  })
}