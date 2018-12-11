// pages/mine/score/rank.js
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    examId: 0,
    pageNum: 1,
    pageSize: 20,
    pages: 1,
    rankList: []
  },
  //返回事件
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      examId: options.examId
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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
    this.setData({
      pageNum: 1,
      pageSize: 20,
      pages: 1,
      rankList: []
    }, function () {
      this.fetchData()
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    if (this.data.pageNum < this.data.pages) {
      this.setData({
        pageNum: this.data.pageNum + 1
      })
      this.fetchData()
    } else {
      wx.showToast({
        title: '暂无更多数据！',
        icon: 'none',
        duration: 2000
      })
    }
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
    var user = wx.getStorageSync('user')

    var url = '/web/exam/listScoreByExamId';
    var data = {
      examId: this.data.examId,
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    };
    request.sendRequest(url, 'GET', data).then(function (resp) {
      if (resp) {
        var score,rank
        var rankList = resp.data.rows
        rankList.forEach(function (v) {
          if (v.sysUserId === user.id) {
            v.color = '#F05D49'
            score = v.totalScore
            rank = v.rank
          }
        })

        var list = _this.data.rankList.concat(rankList)
        _this.setData({
          rankList: list,
          pageNum: resp.data.pageNum,
          pageSize: resp.data.pageSize,
          pages: resp.data.pages,
          score: score,
          rank: rank
        })
      }
    })
  }
})