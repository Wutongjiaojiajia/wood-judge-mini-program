// pages/calc/index.js
import req from '../../request/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    errorMsg:'',  //顶部提示错误信息
    /** 木材规格开始 */
    standardList:[
      {text:'4/8',value:0.5},
      {text:'5/8',value:0.625},
      {text:'6/8',value:0.75},
      {text:'7/8',value:0.875}
    ],  // 木材厚度标准列表
    standardIndex:0,  // 厚度标准选中下标

    levelList:[
      {text:'AB(0.95)',value:0.95},
      {text:'C(0.92)',value:0.92}
    ],  // 木材等级列表
    levelIndex:"0", // 木材等级选中下标
    /** 木材规格结束 */

    /** 成本开始 */
    woodCost:'',  // 木材成本
    fixedCost:'700', // 固定成本
    shavingPrice:'130', // 刨花价钱
    /** 成本结束 */

    /** 厚度统计开始 */
    originWoodList:[], // 原始木材列表数据
    /** 厚度统计结束 */ 

    /** 质量统计开始 */
    qualityStatistics:[
      {recordTitle:'A(条)',resultTitle:'A(%)',quality:'A',total:12,percent:'',percentDisplay:''},
      {recordTitle:'B(条)',resultTitle:'B(%)',quality:'B',total:0,percent:'',percentDisplay:''},
      {recordTitle:'C(条)',resultTitle:'C(%)',quality:'C',total:0,percent:'',percentDisplay:''},
    ],  //质量统计
    /** 质量统计结束 */
  },
  // 查询价格维护信息
  queryPriceMaintainInfo(){
    let obj = {
      orderBy:'thickness',    //厚度升序
    }
    wx.showLoading({
      title: '查询中...',
      mask: true
    });
    req.queryPriceMaintainInfo(obj)
    .then((res=>{
      wx.hideLoading();
      let { code,rows } = res.data;
      if(code === 1 && rows.length !== 0){
        let originData = rows.splice(0);
        this.setData({
          originWoodList:originData
        })
      }else{
        this.setData({
          originWoodList:[],
          errorMsg:'木材价格维护列表为空'
        })
      }
    }))
    .catch(()=>{
      wx.hideLoading();
      this.setData({
        originWoodList:[],
        errorMsg:'查询失败，请联系管理员'
      })
    })
  },
  // 改变厚度标准下标值
  changeStandardSelect(e){
    this.setData({
      standardIndex:e.detail.value
    })
  },
  // 改变木材等级下标值
  changeLevelSelect(e){
    this.setData({
      levelIndex:e.detail.value
    })
  },

  //
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.queryPriceMaintainInfo();
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