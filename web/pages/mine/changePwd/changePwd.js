// pages/mine/changePwd/changePwd.js
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  //返回事件
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
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

  /**
   * 获取原密码输入的值
   */
  oldPassword: function (e) {
    this.setData({
      oldPassword: e.detail.value
    })
  },

  /**
   * 获取新密码输入的值
   */
  newPassword: function (e) {
    this.setData({
      newPassword: e.detail.value
    })
  },

  /**
   * 获取确认新密码输入的值
   */
  confirmPassword: function (e) {
    this.setData({
      confirmPassword: e.detail.value
    })
  },

  submitBtn: function () {
    var oldPassword = this.data.oldPassword
    var newPassword = this.data.newPassword
    var confirmPassword = this.data.confirmPassword
    if (!oldPassword) {
      wx.showToast({
        title: '请输入原密码！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!newPassword) {
      wx.showToast({
        title: '请输入新密码！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (!confirmPassword) {
      wx.showToast({
        title: '请输入确认新密码！',
        icon: 'none',
        duration: 2000
      })
      return
    }
    if (newPassword != confirmPassword) {
      wx.showToast({
        title: '新密码与确认密码不一致！',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var _this = this
    var url = '/web/updatePassword';
    var data = {
      oldPassword: oldPassword,
      newPassword: newPassword,
      confirmPassword: confirmPassword
    }
    request.sendRequest(url, 'POST', data).then(function (resp) {
      if (resp) {
        wx.clearStorageSync()
        wx.showToast({
          title: resp.message,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.redirectTo({
            url: '/pages/login/login',
          })
        }, 2000)
      }
    })
  }
})