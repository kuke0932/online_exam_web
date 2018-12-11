// pages/simulate/grade/grade.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    grade:{
      time: 0,
      rank: 0,
      score: 0,
      right: 0,
      wrong: 0
    }
  },
  //返回事件
  goBack: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
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
    var score = wx.getStorageSync('score')
    var usedTimes = score.usedTimes
    var used
    if (usedTimes % 60 === 0) {
      used = usedTimes / 60 + '分'
    } else {
      if (Math.floor(usedTimes / 60) === 0) {
        used = usedTimes + '秒'
      } else {
        used = Math.floor(usedTimes / 60) + '分' + usedTimes % 60 + '秒'
      }
    }
    this.data.grade.time = used
    this.data.grade.rank = score.rank
    this.data.grade.score = score.totalScore
    this.data.grade.right = score.rightAnswerCount
    this.data.grade.wrong = score.wrongAnswerCount
    this.setData({
      grade: this.data.grade
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
  
  }
})