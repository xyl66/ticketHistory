/**
 * 选择图片
 * @returns {Promise<string>} 数据为图片的base64字符串的Promise
 */
function getImgBase64(){
  return new Promise((resolve,reject)=>{
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths)
          //核心代码
        wx.getFileSystemManager().readFile({
          filePath: res.tempFilePaths[0],
          encoding: 'base64', //编码格式
          success(ans) {
            resolve(ans.data)
          }
        })
      }
    })
  })
}
/**
 * 获取token
 * @returns {Promise<string>} 数据为token的Promise
 */
function getBaiduToken(){
  return new Promise((resolve,reject)=>{
    try {
      var value = wx.getStorageSync('baidu_access_token')
      console.log('缓存token',value)
      if (value) {
        // Do something with return value
        return resolve(value)
      }
      wx.cloud.callFunction({
        name: 'getToken',
        success: res => {
          console.log('结果',res)
          wx.setStorage({
            key:"baidu_access_token",
            data:res.result
          })
          return resolve(res.result)
        },
        fail: err => {
          console.error('[云函数] [getToken] 调用失败：', err)
          reject(err)
        }
      })
    } catch (e) {
      // Do something when catch error
      console.log('错误',e)
      reject(e)
    }
  })
    
}
module.exports={
  getImgBase64,
  getBaiduToken
}