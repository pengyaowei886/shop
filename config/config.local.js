/* eslint valid-jsdoc: "off" */

'use strict';

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {};
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1557129655272_1836';

  // add your middleware config here
  config.middleware = [];

  //安全设置
  config.security = {
    xframe: {
      enable: false,
    },
    csrf: {
      enable: false,
    }
  };
  config.cors = {
    allowMethods: 'GET,POST,PUT,DELETE,OPTIONS',
    credentials: true,
    origin: '*'
  }
  //redis
  config.redis = {
    clients: {
      customer: {
        host: '154.48.228.16',
        port: '6379',
        password: '159370',
        db: 0,
      },
      business: {
        host: '154.48.228.16',
        port: '6379',
        password: '159370',
        db: 1,
      },
      boss: {
        host: '154.48.228.16',
        port: '6379',
        password: '159370',
        db: 2,
      },
    },
  }
  // config/config.${env}.js
  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '154.48.228.16',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: '159370',
      // 数据库名
      database: 'shop',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };

  // config.mongo = {
  //   clients: {
  //     SSS: {
  //       host: '154.48.228.16',
  //       port: '27019',
  //       name: 'sss',
  //       user: 'sss',
  //       password: 'sss159370',
  //       options: { useNewUrlParser: true },
  //     }
  //   }
  // };




  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1'
    },

  };
  // add your user config here
  config.GOPAY={
    key : '9vApxLk5G3PAsJrM', //16位 对称公钥
    iv : 'FnJL7EDzjqWjcaY9',  //偏移量
 }
   config.info = {
    // myAppName: 'egg',
    appid: "", //appid
    appsecret: "", //秘钥
    key:"9vApxLk5G3PAsJrM",//16位 对称公钥
    iv:"FnJL7EDzjqWjcaY9" //偏移量
  };
  return config;
};
