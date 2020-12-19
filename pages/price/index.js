// pages/price/index.js
import req from '../../request/index.js';
Page({

  /**
   * 页面的初始数据
   */
  data: {
    /** 提示组件信息 */
    topTipsMsg:"",
    topTipsType:"", //info-警告 success-成功 error-错误
    topTipsShow:false,
    /** 提示组件信息 */
    formData:[],  //列表数据
    slideButtons:[
      {text:'删除',type:'warn'}
    ],
    selectRowData:null,  //选中行下标
    totalPage:0,  //总页数
    pageNumber:0, //第x页
    pageSize:20,  //每次查询数量
    /** 确认操作弹框 */
    confirmDialogShow:false,  //是否显示弹框
    confirmDialogContent:'',  //弹框文字信息
    confirmDialogButton:[
      {text:'确定'},
      {text:'取消'}
    ],
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
    req.queryPriceMaintainInfo(obj)
    .then(res=>{
      wx.hideLoading();
      let { code,rows,total } = res.data;
      if(code === 1 && rows.length !== 0){
        let originData = rows.splice(0);
        originData.forEach(item => {
          item.showSlideView = false;
        });
        let totalPage = Math.floor(total/this.data.pageSize);
        let actualTotalPage = total%this.data.pageSize === 0?totalPage:totalPage+1; //实际总页数
        this.setData({
          formData:originData,
          totalPage:actualTotalPage
        })
        if(actualTotalPage > 1){
          this.setData({
            pageNumber:this.data.pageNumber + 1
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
        formData:[],
        totalPage:1
      })
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
            topTipsShow:true
          })
        } catch (error) {
          this.setData({
            topTipsMsg:msg,
            topTipsType:'error',
            topTipsShow:true
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