import appenv from './appenv.js';
const env = {
  // 开发环境地址
  dev:{

  },
  // 测试环境地址
  qas:{

  },
  // 正式环境地址
  app:{

  }
};

export default env[appenv];