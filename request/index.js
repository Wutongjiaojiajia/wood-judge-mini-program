import req from './req.js';

export default {
  // 查询价格维护列表信息
  queryPriceMaintainInfo:(data)=>req({
    baseUrl:'wood',
    method:'get',
    url:'priceMaintain/queryList',
    data:data
  }),
}