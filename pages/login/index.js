// pages/login/index.js
const app = getApp();
import loginSystem from '../../utils/loginRequest';
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
    wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
    // 如果从登录页进入则默认计算页
    loginSystem('/pages/calc/index');
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
})