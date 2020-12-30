import appenv from './appenv.js';
const env = {
  // 开发环境地址
  dev:{
    wood:'http://localhost:3000/',   //木材计算正式地址
  },
  // 测试环境地址
  qas:{
    wood:'https://back.wutongjiaojiajia.cn/',   //木材计算正式地址
  },
  // 正式环境地址
  app:{
    wood:'https://back.wutongjiaojiajia.cn/',   //木材计算正式地址
  }
};

export default env[appenv];