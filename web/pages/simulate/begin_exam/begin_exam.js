// pages/exam/begin_exam/begin_exam.js
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examId: 0,
    exam: {},
    userName: ''
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 拿到专题id
    this.setData({
      examId: options.examId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var user = wx.getStorageSync('user')
    if (!user) {
      wx.showToast({
        title: '用户尚未登录或登录超时，请重新登录！',
        icon: 'none',
        duration: 2000
      })
      setTimeout(() => {
        wx.redirectTo({
          url: '/pages/login/login',
        })
      }, 2000)
      return
    }

    this.setData({
      userName: user.userName
    })
    this.fetchData()
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
   * 获取数据
   */
  fetchData: function () {
    var _this = this
    var url = '/web/exam/getExamById';
    var data = {
      examId: this.data.examId
    };
    request.sendRequest(url, 'GET', data, '', false, true).then(function (resp) {
      if (resp) {
        _this.setData({
          exam: resp.data
        }, function () {
          wx.hideLoading()
        })
      }
    })
  },

  beginExam: function () {
    var _this = this
    wx.reLaunch({
      url: '../simulate_test/simulate_test?examId=' + _this.data.examId +
      '&minutesLength=' + _this.data.exam.minutesLength
    })
  }
})