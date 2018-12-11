// pages/login/login.js
var request =require('../../utils/request.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    password: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  },
  // 获取输入账号 
  phoneInput: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  // 获取输入密码 
  passwordInput: function (e) {
    this.setData({
      password: e.detail.value
    })
  },


  // 登录 
  login: function () {
    if (this.data.phone.length == 0) {
      wx.showToast({
        title: '账号不能为空',
        icon: 'none',
        duration: 2000
      })
    } 
    else if(this.data.password.length == 0) {
      wx.showToast({
        title: '密码不能为空',
        icon: 'none',
        duration: 2000
      })
    } 
    else {
      // 这里修改成跳转的页面 
      var _this = this;
      var url = '/web/login';
      var data = {
        username: this.data.phone,
        password: this.data.password
      };
      request.sendRequest(url, 'POST', data, null, true).then(function(resp) {
        if (resp) {
          wx.setStorageSync('x-auth-token', resp.data)
          _this.getUserInfo().then(function(resp) {
            if (resp) {
              wx.setStorageSync('user', resp.data)
              wx.switchTab({
                url: '../index/index'
              })
            }
          })
        }
      })
    }
  },

  getUserInfo: function() {
    var url = '/web/getUserInfo';
    return request.sendRequest(url, 'GET');
  },

  forgetPassword: function() {
    wx.showToast({
      title: '请联系管理员重置密码！',
      icon: 'none',
      duration: 2000
    })
  }
})