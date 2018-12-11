// pages/mine/feedback/feedback.js
var request = require('../../../utils/request.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
    qq: '',
    wechat: '',
    content: '',
    contentSize: 0
    // files: []
    // showUploader: true
  },
  //返回事件
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },  
  // chooseImage: function (e) {
  //   var that = this;
  //   wx.chooseImage({
  //     sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
  //     sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
  //     success: function (res) {
  //       // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
  //       if(that.data.files.length === 4){
  //         that.data.showUploader = false
  //       }
  //       that.setData({
  //         files: that.data.files.concat(res.tempFilePaths),
  //         showUploader: that.data.showUploader
  //       });
  //     }
  //   })
  // },
  // previewImage: function (e) {
  //   wx.previewImage({
  //     current: e.currentTarget.id, // 当前显示图片的http链接
  //     urls: this.data.files // 需要预览的图片http链接列表
  //   })
  // },
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

  /**
   * 获取手机号输入的值
   */
  phone: function (e) {
    this.setData({
      phone: e.detail.value
    })
  },

  /**
   * 获取qq号输入的值
   */
  qq: function (e) {
    this.setData({
      qq: e.detail.value
    })
  },

  /**
   * 获取微信号输入的值
   */
  wechat: function (e) {
    this.setData({
      wechat: e.detail.value
    })
  },

  /**
   * 获取问题描述输入的值
   */
  content: function (e) {
    this.setData({
      content: e.detail.value,
      contentSize: e.detail.value.length
    })
  },

  /**
   * 提交
   */
  submitBtn: function () {
    var phone = this.data.phone
    var qq = this.data.qq
    var wechat = this.data.wechat
    var content = this.data.content
    if (!content) {
      wx.showToast({
        title: '请输入问题描述！',
        icon: 'none',
        duration: 2000
      })
      return
    }

    var _this = this
    var url = '/web/mine/feedback';
    var data = {
      phone: phone,
      qq: qq,
      wechat: wechat,
      content: content
    }
    var contentType = 'application/json'
    request.sendRequest(url, 'POST', data, contentType).then(function (resp) {
      if (resp) {
        wx.showToast({
          title: resp.message,
          icon: 'none',
          duration: 2000
        })
        setTimeout(() => {
          wx.switchTab({
            url: '/pages/mine/mine',
          })
        }, 2000)
      }
    })
  }
})