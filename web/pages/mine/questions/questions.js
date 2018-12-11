// pages/mine/questions/questions.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    questions:[
      {
        url: 'details/details?from=1',
        title: '如何查询考试成绩？'
      },
      {
        url: 'details/details?from=2',
        title: '考试的相关事项！'
      }
    ]
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
  
  }
})