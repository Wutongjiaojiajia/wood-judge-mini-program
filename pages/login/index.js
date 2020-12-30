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
            this.validateUserIsLegal();
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
  // 校验用户是否存在于系统用户表，
  // 若不存在则添加到审核表中
  validateUserIsLegal(){
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
          wx.switchTab({
            url: '/pages/calc/index',
          })
        }else{
          let parseUserInfo = JSON.parse(userInfo);
          let pendUserObj = {
            openid,
            nickName:parseUserInfo.nickName
          };
          this.addUserToPendCheck(pendUserObj);
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
  },
  // 添加用户到待审核表中
  addUserToPendCheck(userObj){
    req.addUserToPendCheck(userObj)
    .then((res)=>{
      wx.hideLoading();
      wx.showModal({
        showCancel:false,
        content:'暂无权限使用本系统，请联系管理员',
      })
    })
    .catch(()=>{
      wx.hideLoading();
      wx.showModal({
        showCancel:false,
        content:'网络连接超时，请稍后再试',
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(wx.getStorageSync('userInfo') && wx.getStorageSync('openid')){
      this.validateUserIsLegal();
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
})