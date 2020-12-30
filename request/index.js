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
  }),
  //微信登陆
  wxLoginSystem:(data)=>req({
    baseUrl:'wood',
    method:'get',
    url:'external/wxLogin',
    data
  }),
  // 添加用户到待审核用户表
  addUserToPendCheck:(data)=>req({
    baseUrl:'wood',
    method:'post',
    url:'user/addUserToPendCheck',
    data
  }),
  // 校验用户是否存在系统用户表中
  validateUserIsLegal:(data)=>req({
    baseUrl:'wood',
    method:'get',
    url:'user/validateUserIsLegal',
    data
  })
}