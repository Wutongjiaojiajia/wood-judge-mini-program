// components/stepper/stepper.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    num:{
      type:Number,
      value:0
    }
  },
  /**
   * 组件的初始数据
   */
  data: {
    // num:0, // 输入框值默认是0
    disabledStatus:true,  //按钮禁用状态
    plusFocusStatus:false,  //加号聚焦状态
    minusFocusStatus:false, //减号聚焦状态
    interval:null //间隔器
  },
  /**
   * 组件的方法列表
   */
  methods: {
    // 点击减号
    bindMinus(){
      let num = this.data.num;
      if(num > 0){
        num --;
      }
      // 小于等于0的时候为disabled状态
      let disabledStatus = num <= 0 ? true:false;
      this.setData({
        num,
        disabledStatus
      })
      this.valueChange();
    },
    // 点击加号
    bindPlus(){
      let num = this.data.num;
      num ++;
      let disabledStatus = num <= 0? true:false;
      this.setData({
        num,
        disabledStatus
      })
      this.valueChange();
    },
    // 输入框事件
    bindManual(e){
      let { value } = e.detail;
      if(!isNaN(value) && Number(value) >= 1){
        this.setData({
          num: parseInt(Number(value)),
          disabledStatus:false
        })
      }else{
        this.setData({
          num:0,
          disabledStatus:true
        })
      }
      this.valueChange();
    },
    // 开始触摸
    startTouchButton(e){
      let { type } = e.target.dataset;
      switch (type) {
        //点击加号
        case 'plus':
          this.setData({
            plusFocusStatus:true
          })
          break;
        // 点击减号
        case 'minus':
          if(!this.data.disabledStatus){
            this.setData({
              minusFocusStatus:true
            })
          }
          break;
      }
    },
    // 结束触摸
    endTouchButton(e){
      this.setData({
        plusFocusStatus:false,
        minusFocusStatus:false
      })
      clearInterval(this.data.interval);
    },
    // 长按按钮
    longpressButton(e){
      let { type } = e.target.dataset;
      switch (type) {
        // 长按加号
        case 'plus':
          this.setData({
            plusFocusStatus:true
          })
          this.data.interval = setInterval(() => {
            let num = this.data.num + 1;
            let disabledStatus = num <= 0? true:false;
            this.setData({
              disabledStatus,
              num
            })
            this.valueChange();
          }, 200);
          break;
        case 'minus':
          if(!this.data.disabledStatus){
            this.setData({
              minusFocusStatus:true
            })
            this.data.interval = setInterval(() => {
              if(this.data.num > 0){
                let num = this.data.num - 1;
                this.setData({
                  num,
                  disabledStatus:false
                })
                this.valueChange();
              }else{
                this.setData({
                  minusFocusStatus:false,
                  disabledStatus:true
                })
              }
            }, 200);
          }
          break;
      }
    },
    valueChange(){
      this.triggerEvent('valueChange',this.data.num);
    }
  },
})
