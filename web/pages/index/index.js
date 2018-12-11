// pages/index/index.js
var request = require('../../utils/request.js')
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    imgUrls: [
      'http://exam.sjzdaj.com/1.jpg',
      'http://exam.sjzdaj.com/2.jpg',
      'http://exam.sjzdaj.com/3.jpg'
    ],
    indicatorDots: true,
    autoplay: true,
    interval: 5000,
    duration: 1000,
    examList: [],
    singleCount: 0,
    multipleCount: 0,
    judgeCount: 0
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
    var _this = this
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
    var departmentIds = []
    user.departments.forEach(function (val) {
      departmentIds.push(val.departmentId)
    })
    var data = {
      departmentIds: departmentIds.join(',')
    };

    var url = '/web/getIndexInfo';
    return request.sendRequest(url, 'GET', data).then(function (resp) {
      var examList = resp.data.examList
      var singleCount = resp.data.singleCount
      var multipleCount = resp.data.multipleCount
      var judgeCount = resp.data.judgeCount

      examList.forEach(function (val) {
        val.publishTime = time.formatTime(val.publishTime)
      })
      _this.setData({
        examList: examList,
        singleCount: singleCount,
        multipleCount: multipleCount,
        judgeCount: judgeCount
      })
    })
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
  goExercise: function() {
    wx.switchTab({
      url: '../exercise/exercise',
    })
  },
  goSimulate: function() {
    wx.switchTab({
      url: '../simulate/simulate',
    })
  },
  goExam: function() {
    wx.switchTab({
      url: '../exam/exam',
    })
  },

  goWrongQuestions: function () {
    var total = this.data.singleCount + this.data.multipleCount + this.data.judgeCount
    if (total > 0) {
      wx.navigateTo({
        url: '../wrong/wrong_questions?type=0',
      })
    } else {
      wx.showToast({
        title: '您还没有错题！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  goSingleQuestions: function () {
    if (this.data.singleCount > 0) {
      wx.navigateTo({
        url: '../wrong/wrong_questions?type=1',
      })
    } else {
      wx.showToast({
        title: '您还没有该类错题！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  goMultipleQuestions: function () {
    if (this.data.multipleCount > 0) {
      wx.navigateTo({
        url: '../wrong/wrong_questions?type=2',
      })
    } else {
      wx.showToast({
        title: '您还没有该类错题！',
        icon: 'none',
        duration: 2000
      })
    }
  },
  goJudgeQuestions: function () {
    if (this.data.judgeCount > 0) {
      wx.navigateTo({
        url: '../wrong/wrong_questions?type=3',
      })
    } else {
      wx.showToast({
        title: '您还没有该类错题！',
        icon: 'none',
        duration: 2000
      })
    }
  }
})