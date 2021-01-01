import req from '../request/index.js';

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
        wx.hideLoading();
        let { code,info } = secRes.data;
        if(code === 0){
          wx.setStorageSync('openid', info.openid);
          wx.setStorageSync('session_key', info.session_key);
          validateUserIsLegal(route);
        }else{
          wx.showModal({
            showCancel:false,
            content:info,
          })
        }
      })
      .catch((error)=>{
        wx.hideLoading();
        wx.showModal({
          showCancel:false,
          content:"网络连接超时，请稍后再试",
        })
      })
    }
  })
}

// 校验用户是否存在于系统用户表，
// 若不存在则添加到审核表中
const validateUserIsLegal = (route)=>{
  wx.showLoading({
    title: '校验中...',
  })
  let openid = wx.getStorageSync('openid');
  let userInfo = wx.getStorageSync('userInfo');
  if(openid && userInfo){
    req.validateUserIsLegal({openid})
    .then((res)=>{
      let { code } = res.data;
      // 用户验证成功
      if(code === 1){
        wx.hideLoading();
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
      wx.hideLoading();
      wx.showModal({
        showCancel:false,
        content: '网络连接超时，请稍后再试',
      })
    })
  }
}

// 添加用户到待审核表中
const addUserToPendCheck = (userObj)=>{
  req.addUserToPendCheck(userObj)
  .then((res)=>{
    wx.hideLoading();
    wx.showModal({
      showCancel:false,
      content:'暂无权限使用本系统，请联系管理员',
    })
    wx.switchTab({
      url: '/pages/login/index',
    })
  })
  .catch(()=>{
    wx.hideLoading();
    wx.showModal({
      showCancel:false,
      content:'网络连接超时，请稍后再试',
    })
    wx.switchTab({
      url: '/pages/login/index',
    })
  })
}

export default loginSystem;
