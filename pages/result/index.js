const app = getApp();
import routeInfo from '../../utils/routeInfo';
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

    fullPath:'',  //完整路径
  },
  backToCalc(){
    wx.switchTab({
      url: `/${routeInfo.calcPage}`
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let obj = JSON.parse(options.result);
    let { percentOfOutput,qualityStatistics,thicknessStatistics,productCost,productPrice,profit } = obj;
    this.setData({
      fullPath:`/${routeInfo.resultPage}?result=${options.result}`, //完整路径
      percentOfOutput,  //出材率
      qualityStatistics,  //质量统计
      thicknessStatistics,  //厚度统计
      productCost,  //成本
      productPrice, //出厂价
      profit  //利润
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage(res) {
    let shareObj = {
      title:'计算结果',
      path:this.data.fullPath,
      imageUrl:'/icons/result_share.png',
      success:(res)=>{}
    }
    return shareObj;
  }
})