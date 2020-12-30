// pages/login/index.js
const app = getApp();
import req from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    userInfo: null,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  // 登陆系统
  loginSystem(){
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
            wx.switchTab({
              url: '/pages/calc/index',
            })
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
  },
  // 获取用户信息
  getUserInfo(e){
    app.globalData.userInfo = e.detail.userInfo;
    wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
    this.loginSystem();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('userInfo') && wx.getStorageSync('openid')){
      wx.switchTab({
        url: '/pages/calc/index',
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
})