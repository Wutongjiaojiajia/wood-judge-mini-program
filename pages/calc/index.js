// pages/calc/index.js
import req from '../../request/index.js';
import utils from '../../utils/util.js';
const app = getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    /** 提示信息 */
    /** 提示组件信息 */
    topTipsMsg:"",
    topTipsType:"", //warn-警告 success-成功 error-错误
    topTipsShow:false,
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
    levelIndex:0, // 木材等级选中下标
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
    /** 计算结果开始 */
    percentOfOutput:"", //出材率
    productCost:'', //每立方米木材成本
    productPrice:'',  //每立方米木材出厂价
    profit:'',  //利润
    /** 计算结果结束 */
    /** 板材价钱 */
    panelPrice:[]
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
    .then(res=>{
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
          thicknessList:thicknessList, //厚度列表
          panelPrice:originData
        })
        this.changeWoodStandardValue();
      }else{
        this.setData({
          originWoodList:[],  //价格数据
          originThicknessList:[], //完整厚度列表
          thicknessList:[], //厚度列表
          panelPrice:[]
        })
        this.showTopTips('error','木材价格维护列表为空');
      }
    })
    .catch(()=>{
      wx.hideLoading();
      this.setData({
        originWoodList:[],  //价格数据
        originThicknessList:[], //完整厚度列表
        thicknessList:[], //厚度列表
        panelPrice:[]
      })
      this.showTopTips('error','查询失败，请联系管理员');
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
      standardIndex:Number(e.detail.value)
    })
    this.changeWoodStandardValue();
  },
  // 改变木材等级下标值
  changeLevelSelect(e){
    this.setData({
      levelIndex: Number(e.detail.value)
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
  /** 计算 */
  goToNextPage(){
    let msg = "";
    switch (true) {
      case this.data.standardIndex === '':
        msg = "请选择木材厚度标准";
        break;
      case this.data.levelIndex === '':
        msg = "请选择木材等级";
        break;
      case this.data.woodCost === '':
        msg = "请输入木材成本";
        break;
      case !utils.validateCorrectMoney(Number(this.data.woodCost)):
        msg = "请输入正确的木材成本";
        break;
      case this.data.fixedCost === '':
        msg = "请输入固定成本";
        break;
      case !utils.validateCorrectMoney(Number(this.data.fixedCost)):
        msg = "请输入正确的固定成本";
        break;
      case this.data.shavingPrice === '':
        msg = "请输入刨花价钱";
        break;
      case !utils.validateCorrectMoney(Number(this.data.shavingPrice)):
        msg = "请输入正确的刨花价钱";
        break;
      case this.data.thicknessStatistics.length === 0:
        msg = "木材厚度统计至少要有一条记录";
        break;
    }
    if(msg !== ""){
      this.showTopTips('warn',msg);
      return;
    }
    // 厚度统计
    switch (this.data.thicknessStatisticsState) {
      // 数量统计
      case 0:
        let thicknessStatisticsTotal = 0;
        this.data.thicknessStatistics.forEach(item => {
          thicknessStatisticsTotal += item.total;
        });
        if(thicknessStatisticsTotal === 0){
          msg = "请完善木材厚度统计信息";
        }
        break;
      // 百分比统计
      case 1:
        let thicknessStatisticsPercentTotal = 0;
        for (let i = 0; i < this.data.thicknessStatistics.length; i++) {
          let item = this.data.thicknessStatistics[i];
          if(item.percentDisplay === ""){
            msg = "请完善木材厚度统计信息";
            break;
          }
          thicknessStatisticsPercentTotal += Number(item.percentDisplay);
          if(i === this.data.thicknessStatistics.length - 1){
            if(thicknessStatisticsPercentTotal !== 100){
              msg = "木材厚度百分比相加不为100";
            }
          }
        }
        break;
    }
    if(msg !== ""){
      this.showTopTips('warn',msg);
      return;
    }
    // 质量统计
    switch (this.data.qualityStatisticsState) {
      // 数量统计
      case 0:
        let qualityStatisticsTotal = 0;
        this.data.qualityStatistics.forEach((item) => {
          qualityStatisticsTotal += item.total;
        });
        if(qualityStatisticsTotal === 0){
          msg = "请完善木材质量统计信息";
        }
        break;
      // 百分比统计
      case 1:
        let qualityStatisticsPercentTotal = 0;
        for (let i = 0; i < this.data.qualityStatistics.length; i++) {
          let item = this.data.qualityStatistics[i];
          if(item.percentDisplay === ""){
            msg = "请完善木材质量统计信息";
            break;
          }
          qualityStatisticsPercentTotal += Number(item.percentDisplay);
          if(i === this.data.qualityStatistics.length - 1){
            if(qualityStatisticsPercentTotal !== 100){
              msg = "木材ABC质量百分比相加不为100";
            }
          }
        }
        break;
    }
    if(msg !== ""){
      this.showTopTips('warn',msg);
      return;
    }
    switch (this.data.thicknessStatisticsState) {
      case 0:
        this.calculatePercentOfThicknessOrQuality(0);  //计算厚度各占百分比
        break;
      case 1:
        this.exchangePercentOfThicknessOrQuality(0); //切换小数位
        break;
    }
    switch (this.data.qualityStatisticsState) {
      case 0:
        this.calculatePercentOfThicknessOrQuality(1); //计算ABC各占百分比
        break;
      case 1:
        this.exchangePercentOfThicknessOrQuality(1);  //切换小数位
        break;
    }
    this.calculatePercentOfOutput();  //计算出材率
    this.calculateProductCost();  //计算成本
    this.calculateProductPrice(); //计算出厂价
    this.calculateProfit(); //计算利润
    let obj = {
      percentOfOutput:this.data.percentOfOutput,  //出材率
      qualityStatistics:this.data.qualityStatistics,  //质量统计
      thicknessStatistics:this.data.thicknessStatistics,  //厚度统计
      productCost:this.data.productCost,  //成本
      productPrice:this.data.productPrice,  //出厂价
      profit:this.data.profit
    }
    wx.navigateTo({
      url: `/pages/result/index?result=${JSON.stringify(obj)}`,
    })
  },
  /** 计算结果 */
  // 计算厚度或质量百分比
  calculatePercentOfThicknessOrQuality(type){
    // type 0-厚度 1-质量
    let statisticsTotal = 0;
    switch (type) {
      case 0:
        this.data.thicknessStatistics.forEach((item)=>{
          statisticsTotal += Number(item.total);
        })
        this.data.thicknessStatistics.forEach((item,index)=>{
          let total = Number(item.total);
          let percent = `thicknessStatistics[${index}].percent`;
          let percentDisplay = `thicknessStatistics[${index}].percentDisplay`;
          this.setData({
            [percent]: (total / statisticsTotal).toFixed(4),
            [percentDisplay]: ((total / statisticsTotal)*100).toFixed(2)
          })
        })
        break;
      case 1:
        this.data.qualityStatistics.forEach((item)=>{
          statisticsTotal += Number(item.total);
        })
        this.data.qualityStatistics.forEach((item,index)=>{
          let total = Number(item.total);
          let percent = `qualityStatistics[${index}].percent`;
          let percentDisplay = `qualityStatistics[${index}].percentDisplay`;
          this.setData({
            [percent]: (total / statisticsTotal).toFixed(4),
            [percentDisplay]: ((total / statisticsTotal)*100).toFixed(2)
          })
        })
        break;
    }
  },
  // 切换厚度或质量百分比
  exchangePercentOfThicknessOrQuality(type){
    // type 0-厚度 1-质量
    switch (type) {
      case 0:
        this.data.thicknessStatistics.forEach((item,index)=>{
          let percent = `thicknessStatistics[${index}].percent`;
          let percentDisplay = `thicknessStatistics[${index}].percentDisplay`;
          this.setData({
            [percent]:Number(item.percent).toFixed(4),
            [percentDisplay]:Number(item.percentDisplay).toFixed(2)
          })
        })
        break;
      case 1:
        this.data.qualityStatistics.forEach((item,index)=>{
          let percent = `qualityStatistics[${index}].percent`;
          let percentDisplay = `qualityStatistics[${index}].percentDisplay`;
          this.setData({
            [percent]:Number(item.percent).toFixed(4),
            [percentDisplay]:Number(item.percentDisplay).toFixed(2)
          })
        })
        break;
    }
  },
  // 计算出材率
  calculatePercentOfOutput(){
    let averageThickness = 0;
    this.data.thicknessStatistics.forEach(item => {
      let thickness = Number(item.thickness) * Number(item.percent);
      averageThickness += thickness;
    });
    let standardValue = this.data.standardList[this.data.standardIndex].value;
    let levelValue = this.data.levelList[this.data.levelIndex].value;
    let percentOfOutput = ((averageThickness / (25.4 * standardValue)) * levelValue).toFixed(4);
    this.setData({
      percentOfOutput
    })
  },
  // 计算成本
  calculateProductCost(){
    let woodCost = Number(this.data.woodCost);
    let percentOfOutput = Number(this.data.percentOfOutput);
    let fixedCost = Number(this.data.fixedCost);
    let productCost = ((woodCost / percentOfOutput) + fixedCost).toFixed(2);
    this.setData({
      productCost
    })
  },
  // 计算出厂价
  calculateProductPrice(){
    let thicknessPerPrice = {};
    this.data.thicknessStatistics.forEach((item) => {
      let panel = this.data.panelPrice.filter(pItem=>pItem.thickness === item.thickness);
      let perPanelPrice = panel[0];
      let APrice = Number(perPanelPrice.A) * Number(this.data.qualityStatistics[0].percent);
      let BPrice = Number(perPanelPrice.B) * Number(this.data.qualityStatistics[1].percent);
      let CPrice = Number(perPanelPrice.C) * Number(this.data.qualityStatistics[2].percent);
      thicknessPerPrice[item.thickness] = (APrice + BPrice + CPrice)*Number(item.percent);
    });
    let totalPrice = 0;
    for(let key in thicknessPerPrice){
      totalPrice += Number(thicknessPerPrice[key]);
    }
    let productPrice = (totalPrice + Number(this.data.shavingPrice)).toFixed(2);
    this.setData({
      productPrice
    })
  },
  // 计算利润
  calculateProfit(){
    let profit = (Number(this.data.productPrice) - Number(this.data.productCost)).toFixed(2);
    this.setData({
      profit
    })
  },
  // 显示toptips
  showTopTips(type,msg){
    this.setData({
      topTipsShow:true,
      topTipsType:type,
      topTipsMsg:msg,
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