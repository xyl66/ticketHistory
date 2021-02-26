// pages/addFunction/addFunction.js

const code = `// 云函数入口函数
exports.main = (event, context) => {
  console.log(event)
  console.log(context)
  return {
    sum: event.a + event.b
  }
}`

Page({

  data: {
    result: '',
    canIUseClipboard: wx.canIUse('setClipboardData'),
    imgUrl: '',
  },

  onLoad: function (options) {

  },

  copyCode: function () {
    wx.setClipboardData({
      data: code,
      success: function () {
        wx.showToast({
          title: '复制成功',
        })
      }
    })
  },

  async testFunction() {
    const {getBaiduToken}=require('../../utils/index.js')
    try {
      const res = await getBaiduToken()
      this.setData({
        result: JSON.stringify(res)
      })
    } catch (error) {
      console.log(error)
    }
  },
  async imgFunction() {
    const {
      getImgBase64
    } = require('../../utils/index.js')
    try {
      const res = await getImgBase64()
      this.setData({
        imgUrl: 'data:image/png;base64,' + res
      })
      wx.showLoading({
        title: '识别中'
      })
      wx.request({
        url: 'https://aip.baidubce.com/rest/2.0/ocr/v1/general_basic?access_token=' + this.data.result,
        method: 'POST',
        header: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: {
          image: res,
        },
        success(_res) {
          wx.hideLoading();
          console.log('识别结果',_res)
        },
        fail(err) {
          wx.hideLoading();
          wx.showToast({
            title: '请求出错',
          })
          console.log('识别结果错误',err)
        }
      })
    } catch (error) {

    }
  }

})