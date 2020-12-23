const app = getApp();
// components/toptips/toptips.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    // 组件显示
    show:{
      type:Boolean,
      observer(){
        if(this.data.show){
          setTimeout(() => {
            this.setData({
              show:false
            })
          }, this.data.delay);
        }
      }
    },
    // 提示文字
    msg:{
      type:String
    },
    // 延迟
    delay:{
      type:Number,
      value:2000
    },
    // 类型
    type:{
      type:String
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    CustomBar: app.globalData.CustomBar,
  },

  /**
   * 组件的方法列表
   */
  methods: {
    
  }
})
