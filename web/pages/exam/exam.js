// pages/exam/exam.js
var request = require('../../utils/request.js')
var time = require('../../utils/util.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 20,
    pages: 1,
    list: [],
    message: ''
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
      list: []
    }, function() {
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
    var url = '/web/exam/list';

    var user = wx.getStorageSync('user')
    if(!user) {
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
    user.departments.forEach(function(val) {
      departmentIds.push(val.departmentId)
    })
    
    var data = {
      examType: 1,
      departmentIds: departmentIds.join(','),
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    };
    request.sendRequest(url, 'GET', data).then(function (resp) {
      if (resp.data) {
        var examList = resp.data.rows
        examList.forEach(function(val) {
          val.publishTime = time.formatTime(val.publishTime)
          val.endTime = time.formatTime(val.endTime)
        })
        var list = _this.data.list.concat(examList)
        _this.setData({
          list: list,
          pageNum: resp.data.pageNum,
          pageSize: resp.data.pageSize,
          pages: resp.data.pages
        })
      } else {
        _this.setData({
          message: '- ' + resp.message + '-'
        })
      }
    })
  }
})