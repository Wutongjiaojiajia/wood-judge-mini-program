// pages/price/index.js
import req from '../../request/index.js';
import utils from '../../utils/util.js';
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
    /** 提示组件信息 */
    topTipsMsg:"",
    topTipsType:"", //warn-警告 success-成功 error-错误
    topTipsShow:false,
    /** 提示组件信息 */
    formData:[],  //列表数据
    slideButtons:[
      {text:'删除',type:'warn'}
    ],
    selectRowData:null,  //选中行下标
    totalPage:0,  //总页数
    pageNumber:0, //第x页
    pageSize:100,  //每次查询数量
    finished:true,  //是否已经结束调用接口
    pullDownLoading:false, //下拉刷新状态
    /** 确认操作弹框 */
    confirmDialogShow:false,  //是否显示弹框
    confirmDialogContent:'',  //弹框文字信息
    confirmDialogButton:[
      {text:'确定'},
      {text:'取消'}
    ],
    /** 新增&编辑弹框 */
    popupShow:false,
    popupTitle:"新增板价",
    popupType:null, //弹框类型
    thickness:'', //拼板厚度
    APrice:'',  //AA板价钱
    BPrice:'',  //AB板价钱
    CPrice:'',  //CC板价钱
  },
  // 刷新列表
  refreshList(){
    this.setData({
      pageNumber:0,
      totalPage:0
    })
    this.initList();
  },
  // 查询列表数据（初始化列表数据）
  initList(){
    let obj = {
      currentPage:this.data.pageNumber + 1, // 第x页
      pageSize:this.data.pageSize,  // 每页大小
      orderBy:'thickness' //厚度升序
    }
    wx.showLoading({
      title: '查询中...',
      mask: true
    });
    this.setData({
      pullDownLoading:true
    })
    req.queryPriceMaintainInfo(obj)
    .then(res=>{
      wx.hideLoading();
      let { code,rows,total } = res.data;
      this.setData({
        pullDownLoading:false
      })
      if(code === 1 && rows.length !== 0){
        let originData = rows.splice(0);
        originData.forEach(item => {
          item.showSlideView = false;
        });
        let totalPage = Math.floor(total/this.data.pageSize);
        let actualTotalPage = total%this.data.pageSize === 0?totalPage:totalPage+1; //实际总页数
        console.log("actualTotalPage",actualTotalPage);
        this.setData({
          formData:originData,
          totalPage:actualTotalPage
        })
        if(actualTotalPage > 1){
          this.setData({
            pageNumber:this.data.pageNumber + 1,
            finished:false
          })
        }
      }else{
        this.setData({
          formData:[],
          totalPage:1
        })
      }
    })
    .catch(()=>{
      wx.hideLoading();
      this.setData({
        pullDownLoading:false
      })
      this.setData({
        formData:[],
        totalPage:1
      })
    })
  },
  // 上拉加载列表
  pullupLoadList(){
    if(this.data.finished){
      return;
    }
    let obj = {
      currentPage:this.data.pageNumber + 1, //第X页
      pageSize:this.data.pageSize,  //每页大小
      orderBy:'thickness' //厚度升序
    };
    req.queryPriceMaintainInfo(obj)
    .then((res)=>{
      let { code,total,rows } = res.data;
      if(code === 1 && total > 0){
        let originData = rows.splice(0);
        originData.forEach(item => {
          item.showSlideView = false;
        });
        this.setData({
          formData:this.data.formData.concat(originData),
          pageNumber:this.data.pageNumber + 1
        })
        if(this.data.pageNumber >= this.data.totalPage){
          this.setData({
            finished:true
          })
        }
      }
    })
  },
  // 隐藏其他侧滑
  hideOtherSlideView(e){
    let currentIndex = e.target.dataset.index;
    this.data.formData.forEach((item,index) => {
      let showSlideView = `formData[${index}].showSlideView`;
      if(index !== currentIndex){
        this.setData({
          [showSlideView]:false
        })
      }
    });
  },
  // 选中需要删除的行
  selectDeleteRow(e){
    console.log("eeeee",e);
    let { item } = e.target.dataset;
    this.setData({
      selectRowData:item,
      confirmDialogShow:true,
      confirmDialogContent:'确认删除当前行吗？'
    })
  },
  // 关闭操作弹框方法
  async closeConfirmDialog(e){
    let buttonIndex = e.detail.index; //弹框按钮下标
    switch (buttonIndex) {
      // 确定
      case 0:
        try {
          let msg = await this.deleteRowData();
          this.setData({
            topTipsMsg:msg,
            topTipsType:'success',
            topTipsShow:true,
            selectRowData:null
          })
          this.refreshList();
        } catch (error) {
          this.setData({
            topTipsMsg:msg,
            topTipsType:'error',
            topTipsShow:true,
            selectRowData:null
          })
        }
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
  // 删除表格行数据
  deleteRowData(){
    return new Promise((resolve,reject)=>{
      let obj = {
        thickness:this.data.selectRowData.thickness
      };
      wx.showLoading({
        title: '删除中...',
        mask: true
      });
      req.deletePriceMaintainInfo(obj)
      .then((res)=>{
        wx.hideLoading();
        let { code,info } = res.data;
        if(code === 1){
          resolve("删除成功");
        }else{
          reject(info);
        }
      })
      .catch(()=>{
        wx.hideLoading();
        reject(err.response.data.info);
      })
    })
  },
  // 打开新增/编辑弹框
  openAddOrEditDialog(e){
    let { type,item } = e.currentTarget.dataset;
    switch (type) {
      case 'add':
        this.setData({
          popupTitle:'新增板价',
          popupShow:true,
          popupType:type,
          thickness:'', //厚度
          APrice:'',  //AA价
          BPrice:'',  //AB价
          CPrice:'' //CC价
        })
        break;
      case 'edit':
        this.setData({
          popupTitle:'编辑板价',
          popupShow:true,
          popupType:type,
          thickness:item.thickness, //厚度
          APrice:item.A,  //AA价
          BPrice:item.B,  //AB价
          CPrice:item.C //CC价
        })
        break;
    }
  },
  // 关闭新增/编辑弹框
  closeAddOrEditDialog(){
    this.setData({
      thickness:'',
      APrice:'',
      BPrice:'',
      CPrice:'',
      popupShow:false
    })
  },
  // 保存新增/编辑弹框
  saveAddOrEditDialog(){
    let msg =  "";
    switch (true) {
      case this.data.thickness === "":
        msg = "请输入拼板厚度";
        break;
      case this.data.APrice === "":
        msg = "请输入对应厚度AA板的价钱"
        break;
      case !utils.validateCorrectMoney(Number(this.data.APrice)):
        msg = "请输入正确的AA板价钱";
        break;
      case this.data.BPrice === "":
        msg = "请输入对应厚度AB板的价钱"
        break;
      case !utils.validateCorrectMoney(Number(this.data.BPrice)):
        msg = "请输入正确的AB板价钱";
        break;
      case this.data.CPrice === "":
        msg = "请输入对应厚度CC板的价钱"
        break;
      case !utils.validateCorrectMoney(Number(this.data.CPrice)):
        msg = "请输入正确的CC板价钱";
        break;
    }
    if(msg !== ""){
      this.setData({
        topTipsMsg:msg,
        topTipsType:'error',
        topTipsShow:true,
      })
      return;
    }
    switch (this.data.popupType) {
      case 'add':
        this.addThicknessAndPrice();
        break;
      case 'edit':
        this.editThicknessAndPrice();
        break;
    }
  },
  // 新增板价信息
  addThicknessAndPrice(){
    let obj = {
      thickness:this.data.thickness,  //厚度
      A:this.data.APrice, //AA板价钱
      B:this.data.BPrice, //AA板价钱
      C:this.data.CPrice, //AA板价钱
    };
    wx.showLoading({
      title: '新增中...',
      mask: true
    });
    req.insertPriceMaintainInfo(obj)
    .then(res=>{
      wx.hideLoading();
      let { code,info } = res.data;
      if(code === 1){
        this.setData({
          topTipsMsg:info,
          topTipsType:'success',
          topTipsShow:true,
        })
        this.closeAddOrEditDialog();
        this.refreshList();
      }else{
        this.setData({
          topTipsMsg:info,
          topTipsType:'error',
          topTipsShow:true,
        })
      }
    })
    .catch(err=>{
      wx.hideLoading();
      this.setData({
        topTipsMsg:err.response.data.info,
        topTipsType:'error',
        topTipsShow:true,
      })
    })
  },
  // 编辑板价信息
  editThicknessAndPrice(){
    let obj = {
      thickness:this.data.thickness,  //厚度
      A:this.data.APrice, //AA板价钱
      B:this.data.BPrice, //AA板价钱
      C:this.data.CPrice, //AA板价钱
    };
    wx.showLoading({
      title: '编辑中...',
      mask: true
    });
    req.updatePriceMaintainInfo(obj)
    .then(res=>{
      wx.hideLoading();
      let { code,info } = res.data;
      if(code === 1){
        this.setData({
          topTipsMsg:info,
          topTipsType:'success',
          topTipsShow:true,
        })
        this.closeAddOrEditDialog();
        this.refreshList();
      }else{
        this.setData({
          topTipsMsg:info,
          topTipsType:'error',
          topTipsShow:true,
        })
      }
    })
    .catch(err=>{
      wx.hideLoading();
      this.setData({
        topTipsMsg:err.response.data.info,
        topTipsType:'error',
        topTipsShow:true,
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.refreshList();
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