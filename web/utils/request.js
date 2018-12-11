var sendRequest = function (url, method, data, contentType, noneLoading, noAutoCloseLoading) {
  var promise = new Promise(function (resolve, reject) {
    var token = wx.getStorageSync('x-auth-token')
    if (!contentType) {
      contentType = 'application/x-www-form-urlencoded;charset=utf-8'
    }
    if (!noneLoading) {
      wx.showLoading({
        title: '页面加载中...',
        mask: true
      })
    }
    wx.request({
      url: 'https://exam.sjzdaj.com/system' + url,
      // url: 'http://10.10.0.3:8081/system' + url,
      data: data,
      method: method,
      header: {
        'x-auth-token': token,
        'content-type': contentType
      },
      success: resolve,
      fail: reject
    })
  }).then(resp => {
    if (resp.statusCode >= 200 && resp.statusCode <= 302) {
      if (!noneLoading && !noAutoCloseLoading) {
        wx.hideLoading()
      }
      return resp.data
    } else {
      return Promise.reject(resp)
    }
  }).catch(e => {
    if (!noneLoading) {
      wx.hideLoading()
    }
    if (e.data && e.data.status === 401) {
      wx.clearStorageSync()
      wx.showToast({
        title: e.data.message,
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.reLaunch({
          url: '/pages/login/login',
        })
      }, 2000)
    } else {
      var message = (e.data && e.data.message)
      if (!message) {
        if (e.errMsg.indexOf('time') > 0) {
          message = '请求超时！'
        } else {
          message = '请求失败！'
        }
      }
      wx.showToast({
        title: message,
        icon: 'none',
        duration: 2000
      })
    }
  });
  return promise;
};

module.exports.sendRequest = sendRequest