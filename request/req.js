import env from './env.js';
export default request=({
  baseUrl = "", //基础路径
  url = "", //接口路径
  method = "GET", //请求方法
  data = {},  //接口传参
  header = {},  //接口请求头
  timeout = 200000, //响应时间
  dataType = "json",  // 返回的数据格式
  enableCache = false,  //是否允许缓存
})=>{
  return new Promise((resolve,reject)=>{
    let config = {
      url:env[baseUrl]+url, //完整接口路径
      method,
      data,
      header,
      timeout,
      dataType,
      enableCache,
      success: (result) => {
        resolve(result);
      },
      fail: (error) => {
        reject(error)
      },
      complete: (res) => {},
    }
    // 微信请求
    wx.request(config);
  })
}