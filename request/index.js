import req from './req.js';

export default {
  // 查询价格维护列表信息
  queryPriceMaintainInfo:(data)=>req({
    baseUrl:'wood',
    method:'get',
    url:'priceMaintain/queryList',
    data
  }),
  // 新增价格维护信息
  insertPriceMaintainInfo:(data)=>req({
    baseUrl:'wood',
    method:'post',
    url:'priceMaintain/addData',
    data
  }),
  // 编辑价格维护信息
  updatePriceMaintainInfo:(data)=>req({
    baseUrl:'wood',
    method:'post',
    url:'priceMaintain/updateData',
    data
  }),
  // 删除价格维护信息
  deletePriceMaintainInfo:(data)=>req({
    baseUrl:'wood',
    method:'post',
    url:'priceMaintain/deleteData',
    data
  })
}