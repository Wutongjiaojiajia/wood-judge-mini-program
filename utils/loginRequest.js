import req from '../request/index.js';
import storageInfo from './storageInfo.js';
import utils from './util.js';

// 登陆系统
const loginSystem = (route)=>{
  wx.showLoading({
    title: '登陆中...',
    mask: true
  });
  wx.login({
    success: res => {
      // 发送 res.code 到后台换取 openId, sessionKey, unionId
      req.wxLoginSystem({code:res.code})
      .then((secRes)=>{
        let { code,info } = secRes.data;
        if(code === 0){
          wx.hideLoading();
          wx.setStorageSync(storageInfo.openid, info.openid);
          wx.setStorageSync(storageInfo.session_key, info.session_key);
          validateUserIsLegal(route);
        }else{
          utils.reLaunchLoginPage(info);
        }
      })
      .catch(()=>{
        utils.reLaunchLoginPage("网络连接超时，请稍后再试")
      })
    }
  })
}

// 校验用户是否存在于系统用户表，
// 若不存在则添加到审核表中
const validateUserIsLegal = (route)=>{
  wx.showLoading({
    title: '校验中...',
    mask: true
  })
  let openid = wx.getStorageSync(storageInfo.openid);
  let userInfo = wx.getStorageSync(storageInfo.userInfo);
  if(openid && userInfo){
    req.validateUserIsLegal({openid})
    .then((res)=>{
      let { code } = res.data;
      // 用户验证成功
      if(code === 1){
        wx.hideLoading();
        wx.setStorageSync(storageInfo.loginStatus, true)
        wx.reLaunch({
          url: route,
        })
      }else{
        let parseUserInfo = JSON.parse(userInfo);
        let pendUserObj = {
          openid,
          nickName:parseUserInfo.nickName,
          isValidate:0
        };
        addUserToPendCheck(pendUserObj);
      }
    })
    .catch(()=>{
      utils.reLaunchLoginPage("网络连接超时，请稍后再试");
    })
  }
}

// 添加用户到待审核表中
const addUserToPendCheck = (userObj)=>{
  req.addUserToPendCheck(userObj)
  .then(()=>{
    utils.reLaunchLoginPage("暂无权限使用本系统，请联系管理员");
  })
  .catch(()=>{
    utils.reLaunchLoginPage("网络连接超时，请稍后再试");
  })
}

export default loginSystem;
