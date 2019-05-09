RootUrl = 'http://101.132.123.189:3000/'

removeBlank = str => {
  return str.replace(/(^\s*)|(\s*$)/g, '')
}
getQueryObject = () => {
  var url = window.location.search
  var theRequest = {}
  if (url.indexOf('?') != -1) {
    var str = url.substr(1)
    strs = str.split('&')
    for (var i = 0; i < strs.length; i++) {
      theRequest[strs[i].split('=')[0]] = decodeURIComponent(strs[i].split('=')[1])
    }
  }
  return theRequest
}
