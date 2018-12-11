// pages/mine/mine.js
var request = require('../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mineInfro: {
      imgUrl: '/images/header_pic.png',
      name: ''
    },
    logined: false
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
    var user = wx.getStorageSync('user')
    this.setData({
      mineInfro: {
        imgUrl: 'http://exam.sjzdaj.com/header.jpg',
        name: user.userName
      },
      logined: !!wx.getStorageSync('x-auth-token') 
    })  
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
   * 退出登录
   */
  logout: function () {
    wx.showModal({
      title: '提示',
      content: '确定退出吗？',
      success: function (res) {
        if (res.confirm) {
          var url = '/web/logout';
          request.sendRequest(url, 'POST').then(function (resp) {
            if (resp) {
              wx.clearStorageSync()
              wx.showToast({
                title: resp.message,
                icon: 'none',
                duration: 2000
              })
              setTimeout(() => {
                wx.reLaunch({
                  url: '/pages/login/login',
                })
              }, 2000)
            }
          })
        }
      }
    })
  }
})