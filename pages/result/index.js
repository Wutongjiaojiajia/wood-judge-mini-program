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
    qualityStatistics:[
      {title:'A(%)',percentDisplay:''},
      {title:'B(%)',percentDisplay:''},
      {title:'C(%)',percentDisplay:''},
    ],
    // 厚度统计
    thicknessStatistics:[
      {title:'16mm',percentDisplay:''},
      {title:'17mm',percentDisplay:''},
      {title:'18mm',percentDisplay:''},
    ],

    productCost:'', //每立方米木材成本
    productPrice:'',  //每立方米木材出厂价
    profit:'',  //利润
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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})