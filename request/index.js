import req from './req.js';

export default {
  // 例子
  test:(data)=>req({
    baseUrl:'test',
    method:'get',
    url:'test/test',
    data:data
  })
}