// components/halfScreenDialog/index.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 弹框显隐
    show:{
      type:Boolean
    },
    // 弹框标题
    title:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },
  /**
   * 组件的方法列表
   */
  methods: {
    closeDialog(){
      this.triggerEvent("closeDialog",false);
    }
  },
  options:{
    multipleSlots:true
  }
})
