const app = getApp();
import loginSystem from '../../utils/loginRequest';
import routeInfo from '../../utils/routeInfo';
import storageInfo from '../../utils/storageInfo';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
  },
  // 获取用户信息
  getUserInfo(e){
    app.globalData.userInfo = e.detail.userInfo;
    wx.setStorageSync(storageInfo.userInfo, JSON.stringify(e.detail.userInfo));
    // 如果从登录页进入则默认计算页
    loginSystem(`/${routeInfo.calcPage}`);
  },
  //分享
  onShareAppMessage(){
    let shareObj = {
      title:'系统登录',
      path:`/${routeInfo.loginPage}`,  
      imageUrl:'/icons/login_share.png',
      success:(res)=>{}
    }
    return shareObj;
  }
})