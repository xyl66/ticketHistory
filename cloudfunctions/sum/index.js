// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  try {
    // 查询token
    const res = await onQuery()
    console.log(res)
    if(res.data.length){
      // TODO:待校验有效期
      return res.data[0].data.access_token
    }
    // 新增token
    const tokenObj = await onAdd(res.data)
    console.log('结果',tokenObj)
    if (tokenObj) {
      return tokenObj
    }
  } catch (err) {
    console.log('新增token', err)
  }
}


function onAdd() {
  return new Promise(async (resolve, reject) => {
    const axios = require('axios')
    const params = {
    'grant_type': 'client_credentials',
    'client_id': 'ba2qf8mgs17cXPa2e7M7RGmp',
    'client_secret': 'XmkWT3hKe4G4REOAlZcYL1nPrS0LprHP'
  };
    const res = await axios.get('https://aip.baidubce.com/oauth/2.0/token', {
      params
    });
    if (res.status !== 200) {
      reject('获取token失败')
    }
    const db = cloud.database()
    db.collection('counters').add({
      data: {
        data: res.data,
        _id: 'baidu_access_token',
      }
    }).then(res=>resolve(res.data.access_token))
  })
}

function onQuery() {
  return new Promise(async (resolve, reject) => {
    const db = cloud.database()
    // 查询当前用户所有的 counters
    try {


      const res = await db.collection('counters').where({_id:'baidu_access_token'}).get()
      resolve(res)
    } catch (error) {
      console.log('出错了')
    }
  })
}