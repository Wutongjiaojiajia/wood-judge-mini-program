// pages/result/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    // 计算结果
    percentOfOutput:'', //出材率
    // 质量统计
    qualityStatistics:[],
    // 厚度统计
    thicknessStatistics:[],

    productCost:'', //每立方米木材成本
    productPrice:'',  //每立方米木材出厂价
    profit:'',  //利润
  },
  backToCalc(){
    wx.switchTab({
      url: '/pages/calc/index'
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = JSON.parse(options.result);
    let { percentOfOutput,qualityStatistics,thicknessStatistics,productCost,productPrice,profit } = obj;
    this.setData({
      percentOfOutput,  //出材率
      qualityStatistics,  //质量统计
      thicknessStatistics,  //厚度统计
      productCost,  //成本
      productPrice, //出厂价
      profit  //利润
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})