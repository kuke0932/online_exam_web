// pages/exercise/random/random.js
var request = require('../../../utils/request.js')
var time = require('../../../utils/util.js')
var showCounts = false
Page({
  /**
   * 页面的初始数据
   */
  data: {
    counts: {
      total: 0,
      correct: 0,
      error: 0
    },
    qesList: [],
    isReady: false,
    examId: 0,
    startTime: '',
    minutesLength: '',
    countDown: '--',
    indicatorDots: false,
    autoplay: false,
    duration: 500,
    bottom: '-2rpx',
    showMask: false,
    listHeight: '600rpx',
    clientHeight: '',
    currentId: 0,
    windowHeight: 0,
    checkBoxAns: ''
  },
  //修改当前题目currentId
  changeSwiper: function (e) {
    var currentId = e.detail.current

    this.setData({
      currentId: currentId
    });

    this.resetClientHeight(currentId)
  },
  //跳到指定题目
  goQuestion: function (e) {
    var currentId = parseInt(e.target.id)
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
    // 拿到考试id
    this.setData({
      examId: options.examId,
      minutesLength: options.minutesLength
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var socketOpen = false, _this = this
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

    wx.onSocketOpen(function (res) {
      socketOpen = true
      var data = {
        examId: _this.data.examId,
        minutesLength: _this.data.minutesLength,
        userId: user.id
      }
      sendSocketMessage(JSON.stringify(data))
    })

    wx.onSocketError(function (res) {
      console.log('WebSocket连接失败')
    })

    function sendSocketMessage(msg) {
      if (socketOpen) {
        wx.sendSocketMessage({
          data: msg,
        })
      }
    }

    wx.onSocketMessage(function (res) {
      if (res.data === '0') {
        _this.autoSubmitAnswers()
      } else {
        _this.setData({
          countDown: res.data
        })
      }
    })

    wx.showLoading({
      title: '页面加载中...',
      mask: true
    })
    // 获取后台数据
    var url = '/web/exam/listSimulateQuestions';
    var data = {
      examId: this.data.examId
    };
    request.sendRequest(url, 'GET', data, '', false, true).then(function (resp) {
      if (resp) {
        var qesList = resp.data
        _this.data.counts.total = resp.data.length
        _this.setData({
          qesList: qesList,
          counts: _this.data.counts,
          isReady: true
        })

        wx.getSystemInfo({
          success: function (res) {
            var windowHeight = res.windowHeight - 80
            var query = wx.createSelectorQuery();
            query.select('#explain0').boundingClientRect()
            query.exec(function (res) {
              _this.setData({
                windowHeight: windowHeight,
                clientHeight: res && res[0] ? (res[0].bottom < windowHeight ? windowHeight : res[0].bottom) : windowHeight
              }, function () {
                wx.hideLoading()
                wx.connectSocket({
                  url: 'wss://exam.sjzdaj.com/system/webSocket'
                  // url: 'ws://10.10.0.3:8081/system/webSocket',
                })
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
    if (this.data.isReady) {
      wx.connectSocket({
        url: 'wss://exam.sjzdaj.com/system/webSocket'
        // url: 'ws://10.10.0.3:8081/system/webSocket',
      })
    }
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    wx.closeSocket()
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
   * 返回按钮
   */
  quitBtn: function () {
    var _this = this
    wx.showModal({
      title: '提示',
      content: '确认要退出吗？',
      success: function (res) {
        if (res.confirm) {
          wx.closeSocket()

          wx.reLaunch({
            url: '/pages/index/index'
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 提交答案
   */
  submitAnswers: function () {
    var _this = this
    wx.showModal({
      title: '提示',
      content: '确认提交考试吗？',
      success: function (res) {
        if (res.confirm) {
          wx.closeSocket()

          var answerList = []
          _this.data.qesList.forEach(function (v) {
            var options = [], answer = {}
            v.questionOptions.forEach(function (o) {
              if (o.checked) {
                options.push(o.id)
              }
            })
            answer.questionId = v.id
            answer.rightAnswerIds = v.rightAnswerIds
            answer.userAnswerIds = options.join(',')
            answerList.push(answer)
          })

          var url = '/web/exam/submitAnswer?examId=' + _this.data.examId;
          var contentType = 'application/json'
          request.sendRequest(url, 'POST', answerList, contentType).then(function (resp) {
            if (resp) {
              if (resp.status === 200) {
                wx.setStorageSync('score', resp.data)
                wx.redirectTo({
                  url: '../../simulate/grade/grade',
                })
              }
            }
          })
        } else if (res.cancel) {

        }
      }
    })
  },

  /**
   * 到时间以后自动提交
   */
  autoSubmitAnswers: function () {
    wx.closeSocket()

    var _this = this
    var answerList = []
    _this.data.qesList.forEach(function (v) {
      var options = [], answer = {}
      v.questionOptions.forEach(function (o) {
        if (o.checked) {
          options.push(o.id)
        }
      })
      answer.questionId = v.id
      answer.rightAnswerIds = v.rightAnswerIds
      answer.userAnswerIds = options.join(',')
      answerList.push(answer)
    })

    var url = '/web/exam/submitAnswer?examId=' + _this.data.examId;
    var contentType = 'application/json'
    request.sendRequest(url, 'POST', answerList, contentType).then(function (resp) {
      if (resp) {
        if (resp.status === 200) {
          wx.setStorageSync('score', resp.data)
          wx.redirectTo({
            url: '../../simulate/grade/grade',
          })
        }
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