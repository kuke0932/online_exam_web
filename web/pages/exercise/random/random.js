// pages/exercise/random/random.js
var request = require('../../../utils/request.js')
var showCounts = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageNum: 1,
    pageSize: 20,
    pages: 1,
    counts: {
      total: 0,
      correct: 0,
      error: 0
    },
    qesList: [],
    indicatorDots: false,
    autoplay: false,
    interval: 5000,
    duration: 500,
    bottom: '-2rpx',
    showMask: false,
    listHeight: '600rpx',
    clientHeight: '',
    currentId: 0,
    windowHeight: 0,
    checkBoxAns: ''
  },
  //返回事件
  goBack: function () {
    wx.navigateBack({
      delta: 1
    })
  },
  //修改当前题目currentId
  changeSwiper: function (e) {
    var currentId = e.detail.current

    this.setData({
      currentId: currentId
    });

    var pageNum = Math.floor(currentId / this.data.pageSize) + 1
    if (!this.data.qesList[currentId]) {
      this.fetchData(pageNum, this)
      if (currentId % this.data.pageSize === 0) {
        if (!this.data.qesList[currentId - 1]) {
          this.fetchData(pageNum - 1, this)
        }
      }
      if (currentId % this.data.pageSize === this.data.pageSize - 1) {
        if (!this.data.qesList[currentId + 1]) {
          this.fetchData(pageNum + 1, this)
        }
      }
    }
    this.resetClientHeight(currentId)
  },
  //跳到指定题目
  goQuestion: function (e) {
    var currentId = e.target.id
    var _this = this

    this.setData({
      currentId: currentId
    });

    this.upCountList()
  },
  //单选题
  radioChange: function (e) {
    var that = this
    var currentValue = e.detail.value
    var currentId = this.data.currentId
    var qestionList = this.data.qesList[currentId]
    var options = qestionList.questionOptions
    var rightAnswerIds = qestionList.rightAnswerIds
    qestionList.showExplain = true
    //如果回答正确
    qestionList.isRight = currentValue == rightAnswerIds
    //遍历选项 判断回答 设置选项可选与否 //正确选中 错误选中图标设置
    for (var i = 0, len = options.length; i < len; ++i) {
      options[i].isDisable = true
      options[i].checked = options[i].id == currentValue || options[i].id == rightAnswerIds
    }

    //判断回答正误改变题目按钮颜色 回答正误数目显示
    if (currentValue === rightAnswerIds) {
      qestionList.color = '#1AAD19'
      this.data.counts.correct = this.data.counts.correct + 1
    } else {
      qestionList.color = 'red'
      this.data.counts.error = this.data.counts.error + 1

      // 保存错题
      var wrongData = {
        id: qestionList.id,
        name: qestionList.name,
        categoryId: qestionList.categoryId,
        categoryName: qestionList.categoryName,
        questionOptions: qestionList.questionOptions,
        rightAnswerIds: qestionList.rightAnswerIds,
        type: qestionList.type,
        explain: qestionList.explain
      }
      this.saveWronQuestion(wrongData)
    }
    this.setData({
      qesList: this.data.qesList,
      counts: this.data.counts
    }, function () {
      that.resetClientHeight(currentId)
    });
  },
  //多选题
  checkboxChange: function (e) {
    var that = this
    var currentValues = e.detail.value
    var currentId = this.data.currentId
    this.data.qesList[currentId].values = e.detail.value.sort().toString()
    var options = this.data.qesList[currentId].questionOptions

    for (var i = 0, lenI = options.length; i < lenI; ++i) {
      options[i].checked = false;

      for (var j = 0, lenJ = currentValues.length; j < lenJ; ++j) {
        if (options[i].id == currentValues[j]) {
          options[i].checked = true;
          break;
        }
      }
    }
    that.setData({
      qesList: that.data.qesList
    })
  },
  //确认答案
  confirm_ans: function () {
    var that = this
    var currentId = this.data.currentId
    var qestionList = this.data.qesList[currentId]
    //确认答案 选项不可在选
    var options = qestionList.questionOptions
    var rightAnswerIds = qestionList.rightAnswerIds
    rightAnswerIds = ',' + rightAnswerIds + ','
    var values = this.data.qesList[currentId].values
    if (!values) {
      wx.showToast({
        title: '请至少选择一项',
        icon: 'none',
        duration: 1000
      })
    } else {

      for (var i = 0; i < options.length; i++) {
        options[i].isDisable = true
        // 判断该题所有正确的选项，来改变选项的颜色
        options[i].itemIsRight = rightAnswerIds.indexOf(',' + options[i].id + ',') >= 0
        // 判断用户是否选择了正确的答案
        options[i].isRight = options[i].checked ? rightAnswerIds.indexOf(',' + options[i].id + ',') >= 0 ? true : false : false
      }
      //点击确认按钮不可再点
      qestionList.btnDisable = true
      //如果回答正确
      qestionList.isRight = values == rightAnswerIds
      values = ',' + values + ','
      //判断回答正误改变题目按钮颜色 回答正误数目显示
      if (values === rightAnswerIds) {
        qestionList.color = '#1AAD19'
        this.data.counts.correct = this.data.counts.correct + 1
      } else {
        qestionList.color = 'red'
        this.data.counts.error = this.data.counts.error + 1

        // 保存错题
        var wrongData = {
          id: qestionList.id,
          name: qestionList.name,
          categoryId: qestionList.categoryId,
          categoryName: qestionList.categoryName,
          questionOptions: qestionList.questionOptions,
          rightAnswerIds: qestionList.rightAnswerIds,
          type: qestionList.type,
          explain: qestionList.explain
        }
        this.saveWronQuestion(wrongData)
      }
      //确认答案 显示解析
      that.data.qesList[currentId].showExplain = true
      that.data.qesList[currentId].values = ''
      that.setData({
        qesList: that.data.qesList,
        counts: that.data.counts
      }, function () {
        that.resetClientHeight(currentId)
      })
    }
  },
  //点击弹出题目数
  upCountList: function (e) {
    var listHeight = this.data.listHeight;
    if (showCounts === false) {
      this.setData({
        bottom: listHeight,
        showMask: true
      })
      showCounts = true
    } else if (showCounts === true) {
      this.setData({
        bottom: '-1px',
        showMask: false
      })
      showCounts = false
    }
  },
  //重新获取显示高度
  resetClientHeight: function (currentId, id) {

    var that = this

    var callBack = function (that, scrollTop) {
      return function (res) {
        var realHeight = ((res[0].bottom || 0) + (scrollTop || 0))
        var height = realHeight < that.data.windowHeight ? that.data.windowHeight : realHeight
        that.setData({
          clientHeight: height + 40
        })
      }
    }
    //获取滚动高度
    wx.createSelectorQuery().selectViewport().scrollOffset(function (res) {
      var scrollTop = res.scrollTop
      var query = wx.createSelectorQuery()
      if (that.data.qesList[currentId] && that.data.qesList[currentId].showExplain) {
        query.select('#explain' + currentId).boundingClientRect().exec(callBack(that, scrollTop))
      } else {
        query.select('#confirmAns' + currentId).boundingClientRect().exec(callBack(that, scrollTop))
        query.select('#option' + currentId).boundingClientRect().exec(callBack(that, scrollTop))
      }
    }).exec()

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
    // 获取后台数据
    var _this = this
    var url = '/web/question/listByRandom';
    var data = {
      pageNum: this.data.pageNum,
      pageSize: this.data.pageSize
    };
    request.sendRequest(url, 'GET', data, '', false, true).then(function (resp) {
      if (resp) {
        var qesList = resp.data.rows
        var total = resp.data.total
        //题目总数  
        _this.data.counts.total = total
        if (total > _this.data.pageSize) {
          qesList[total - 1] = undefined
        }
        _this.setData({
          qesList: qesList,
          pageNum: resp.data.pageNum,
          pageSize: resp.data.pageSize,
          pages: resp.data.pages,
          counts: _this.data.counts
        }, function () {
          wx.hideLoading()
        })

        wx.getSystemInfo({
          success: function (res) {
            _this.setData({
              windowHeight: res.windowHeight - 80
            })

            var windowHeight = res.windowHeight - 80
            var query = wx.createSelectorQuery();
            query.select('#explain0').boundingClientRect()
            query.exec(function (res) {
              _this.setData({
                clientHeight: res && res[0] ? (res[0].bottom < windowHeight ? windowHeight : res[0].bottom) : windowHeight
              })
            })
          }
        })
      }
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
   * 获取数据
   */
  fetchData: function (pageNum, _this) {
    var url = '/web/question/listByRandom';
    var currentId = _this.data.currentId
    var pageSize = _this.data.pageSize
    var data = {
      pageNum: pageNum,
      pageSize: _this.data.pageSize
    };
    return request.sendRequest(url, 'GET', data, '', false, true).then(function (resp) {
      if (resp) {
        var qesList = resp.data.rows
        var index = (pageNum - 1) * pageSize
        for (var i = 0; i < qesList.length; i++) {
          if (!_this.data.qesList[index]) {
            _this.data.qesList[index] = qesList[i]
          }

          index++
        }
        //题目总数  
        _this.data.counts.total = resp.data.total
        _this.setData({
          qesList: _this.data.qesList,
          pageNum: resp.data.pageNum,
          pageSize: resp.data.pageSize,
          pages: resp.data.pages,
          counts: _this.data.counts
        }, function () {
          _this.resetClientHeight(currentId)
          wx.hideLoading()
        })
      }
    })
  },

  /**
   * 保存错题
   */
  saveWronQuestion: function (question) {
    var url = '/web/question/saveWrongQuestion';
    var contentType = 'application/json'
    return request.sendRequest(url, 'POST', question, contentType, true).then(function (resp) {

    })
  }
})