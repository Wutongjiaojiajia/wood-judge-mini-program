import pubSub from './utils/pubSub.js';
import loginSystem from './utils/loginRequest';
App({
  globalData:{
    StatusBar:'', 
    Custom:'',
    CustomBar:'',
    userInfo:null
  },
  pubSub:new pubSub(),
  /**
   * 当小程序初始化完成时，会触发 onLaunch（全局只触发一次）
   */
  onLaunch(options) {
    console.log("options",options);
    this.getSystemDeviceInfo();
    let { path } = options;
    let fullPath = "";
    switch (path) {
      // login页
      case "pages/login/index":
        fullPath = "pages/calc/index";
        break;
      // result页
      case "pages/result/index":
        fullPath = `pages/result/index?result=${options.query.result}`;
        break;
      default:
        fullPath = path;
        break;
    }
    this.getUserInfoAndLogin(`/${fullPath}`)
  },

  // 获取用户信息并登录
  getUserInfoAndLogin(route){
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: res => {
              this.globalData.userInfo = res.userInfo;
              wx.setStorageSync('userInfo', JSON.stringify(res.userInfo));
              loginSystem(route);
            }
          })
        }
      }
    })
  },
  // 获取系统设备信息
  getSystemDeviceInfo(){
    wx.getSystemInfo({
      success:e=>{
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
  },
  /**
   * 当小程序启动，或从后台进入前台显示，会触发 onShow
   */
  onShow(options) {

  },

  /**
   * 当小程序从前台进入后台，会触发 onHide
   */
  onHide: function () {
    
  },

  /**
   * 当小程序发生脚本错误，或者 api 调用失败时，会触发 onError 并带上错误信息
   */
  onError: function (msg) {
    
  }
})
