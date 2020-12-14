// pages/calc/index.js
import req from '../../request/index.js';
Page({
  /**
   * 页面的初始数据
   */
  data: {
    /** 提示信息 */
    errorMsg:'',  //顶部提示错误信息
    /** 警示弹框 */
    alertDialogShow:false, //是否显示弹框
    alertDialogContent:'', //弹框文字信息
    alertDialogButton:[
      {text:'确定'}
    ],
    /** 确认操作弹框 */
    confirmDialogShow:false,  //是否显示弹框
    confirmDialogContent:'',  //弹框文字信息
    confirmDialogButton:[
      {text:'确定'},
      {text:'取消'}
    ],
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
    thicknessStatisticsState:0, //0-条数统计 1-百分比统计
    thicknessStatisticsSlideButtons:[
      {text:"删除",type:'warn'}
    ],
    thicknessStatistics:[
      // {thickness:18,resultTitle:'18mm',total:0,percent:'',percentDisplay:''}
    ], // 厚度统计列表
    originWoodList:[], // 原始木材列表数据
    originThicknessList:[
      // {text:'16mm',value:16}
    ], //原始厚度选择列表
    thicknessList:[
      // {text:'16mm',value:16}
    ],  //过滤厚度选择列表
    thicknessStatisticsIndex:null,  //操作下标
    /** 厚度统计结束 */ 

    /** 质量统计开始 */
    qualityStatisticsState:0, //0-条数统计 1-百分比统计
    qualityStatistics:[
      {recordTitle:'A（条）',resultTitle:'A（%）',quality:'A',total:0,percent:'',percentDisplay:''},
      {recordTitle:'B（条）',resultTitle:'B（%）',quality:'B',total:0,percent:'',percentDisplay:''},
      {recordTitle:'C（条）',resultTitle:'C（%）',quality:'C',total:0,percent:'',percentDisplay:''},
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
        let thicknessList = [];
        originData.forEach(item => {
          let thicknessObj = {
            text:`${item.thickness}mm`,
            value:Number(item.thickness)
          }
          thicknessList.push(thicknessObj);
        });
        this.setData({
          originWoodList:originData,  //价格数据
          originThicknessList:thicknessList,  //完整厚度列表
          thicknessList:thicknessList //厚度列表
        })
        this.changeWoodStandardValue();
      }else{
        this.setData({
          originWoodList:[],  //价格数据
          originThicknessList:[], //完整厚度列表
          thicknessList:[], //厚度列表
          errorMsg:'木材价格维护列表为空'
        })
      }
    }))
    .catch(()=>{
      wx.hideLoading();
      this.setData({
        originWoodList:[],  //价格数据
        originThicknessList:[], //完整厚度列表
        thicknessList:[], //厚度列表
        errorMsg:'查询失败，请联系管理员'
      })
    })
  },
  // 木材规格-厚度标准选中变化
  changeWoodStandardValue(){
    let tempArr = [];
    let standardValue = this.data.standardList[this.data.standardIndex].value;
    switch (standardValue) {
      case 0.5:
        tempArr = this.data.originThicknessList.filter((item)=>Number(item.value)>=16 && Number(item.value)<=24);
        break;
      case 0.625:
        tempArr = this.data.originThicknessList.filter((item)=>Number(item.value)>24 && Number(item.value)<=30);
        break;
      default:
        tempArr = JSON.parse(JSON.stringify(this.data.originThicknessList));
        break;
    }
    this.setData({
      thicknessList:tempArr
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
  /** 厚度统计 */
  //  切换厚度统计方式
  changeTicknessStatisticsState(){
    this.setData({
      thicknessStatisticsState:this.data.thicknessStatisticsState === 0?1:0
    })
    this.data.thicknessStatistics.forEach((item,index)=>{
      let total = `thicknessStatistics[${index}].total`;
      let percent = `thicknessStatistics[${index}].percent`;
      let percentDisplay = `thicknessStatistics[${index}].percentDisplay`;
      this.setData({
        [total]:0,
        [percent]:'',
        [percentDisplay]:''
      })
    })
  },
  // 点击加号添加木材厚度统计行
  addWoodThicknessRow(){
    if(this.data.thicknessStatistics.length+1>this.data.thicknessList.length){
      this.setData({
        alertDialogShow:true,
        alertDialogContent:`当前不能继续新增行,因为厚度统计行大于厚度记录行`
      })
      return;
    }
    let recordArr = []; //  获取thicknessList的value
    let statisticsArr = []; //  获取thicknessStatistics的thickness
    this.data.thicknessList.forEach(item=>{
      recordArr.push(item.value);
    })
    this.data.thicknessStatistics.forEach(item=>{
      statisticsArr.push(item.thickness);
    })
    // 差集 = 并集-交集 去除两个数组相同的元素
    let differenceArr = recordArr.filter(item=>!statisticsArr.includes(item));
    let obj = {
      thickness:differenceArr[0],
      resultTitle:`${differenceArr[0]}mm`,
      total:0,
      percent:'',
      percentDisplay:''
    };
    this.data.thicknessStatistics.push(obj);
    this.setData({
      thicknessStatistics:this.data.thicknessStatistics
    })
  },
  // 木材厚度选择变化
  woodThicknessSelectChange(e){
    let { detail,target } = e;
    let { value } = detail; //选中厚度值下标
    let { index } = target.dataset; //厚度统计行下标
    let thickness = `thicknessStatistics[${index}].thickness`;
    let resultTitle = `thicknessStatistics[${index}].resultTitle`;
    this.setData({
      [thickness]:this.data.thicknessList[Number(value)].value,
      [resultTitle]:this.data.thicknessList[Number(value)].text
    })
  },
  // 删除木材厚度统计行
  deleteWoodThicknessRow(){

  },
  // 关闭操作弹框方法
  closeConfirmDialog(e){
    let buttonIndex = e.detail.index; //弹框按钮下标
    switch (buttonIndex) {
      // 确定
      case 0:
        this.data.thicknessStatistics.splice(this.data.thicknessStatisticsIndex,1);
        this.setData({
          thicknessStatistics:this.data.thicknessStatistics
        })
        break;
      // 取消
      case 1:

        break;
    }
    this.setData({
      confirmDialogShow:false,
      confirmDialogContent:'',
      thicknessStatisticsIndex:null
    })
  },
  // 关闭警示弹框方法
  closeAlertDialog(){
    this.setData({
      alertDialogShow:false,
      alertDialogContent:''      
    })
  },
  // 点击滑动按钮
  thicknessStatisticsSlideButtonTap(e){
    let slideButtonIndex = e.detail.index;  //点击侧滑按钮下标
    let thicknessStatisticsIndex = e.target.dataset.index;
    switch (slideButtonIndex) {
      case 0:
        this.setData({
          confirmDialogShow:true,
          confirmDialogContent:'确定删除吗？',
          thicknessStatisticsIndex:thicknessStatisticsIndex
        })
        break;
    }
  },
  // 厚度统计条数改变
  thicknessPieceValueChange(e){
    let { detail,target } = e;
    let { index } = target.dataset;
    let evalTarget = `thicknessStatistics[${index}].total`; 
    this.setData({
      [evalTarget]:detail
    })
  },
  // 厚度统计百分比改变
  thicknessPercentChange(e){
    let { detail,target } = e;
    let { index } = target.dataset;
    let { value } = detail;
    let percent = '';
    if(!isNaN(value) && Number(value)>=0){
      percent = Number(value)/100;
    }else{
      value = "";
    }
    let evalTarget = `thicknessStatistics[${index}].percentDisplay`;
    let calcTarget = `thicknessStatistics[${index}].percent`;
    this.setData({
      [evalTarget]:value, //显示的百分比
      [calcTarget]:percent, //实际的百分比
    })
  },
  /** 质量统计 */
  // 切换条数或者百分比统计
  changeQualityStatisticsState(){
    this.setData({
      qualityStatisticsState:this.data.qualityStatisticsState === 0?1:0
    })
    this.data.qualityStatistics.forEach((item,index)=>{
      let total = `qualityStatistics[${index}].total`;
      let percent = `qualityStatistics[${index}].percent`;
      let percentDisplay = `qualityStatistics[${index}].percentDisplay`;
      this.setData({
        [total]:0,
        [percent]:'',
        [percentDisplay]:''
      })
    })
  },
  // 质量统计值改变
  qualityPieceValueChange(e){
    let { detail,target } = e;
    let { index } = target.dataset;
    let evalTarget = `qualityStatistics[${index}].total`; 
    this.setData({
      [evalTarget]:detail
    })
  },
  //质量百分比改变
  qualityPercentChange(e){
    let { detail,target } = e;
    let { index } = target.dataset;
    let { value } = detail;
    let percent = '';
    if(!isNaN(value) && Number(value)>=0){
      percent = Number(value)/100;
    }else{
      value = "";
    }
    let evalTarget = `qualityStatistics[${index}].percentDisplay`;
    let calcTarget = `qualityStatistics[${index}].percent`;
    this.setData({
      [evalTarget]:value, //显示的百分比
      [calcTarget]:percent, //实际的百分比
    })
  },
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