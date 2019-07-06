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
      user: {
        host: '129.28.167.17',
        port: '6379',
        password: 'zlpt123456',
        db: 0,
      },
      trolley: { //购物车
        host: '129.28.167.17',
        port: '6379',
        password: 'zlpt123456',
        db: 1,
      },
      history: {
        host: '129.28.167.17',
        port: '6379',
        password: 'zlpt123456',
        db: 2,
      },
    },
  }

  config.mysql = {
    // 单数据库信息配置
    client: {
      // host
      host: '129.28.167.17',
      // 端口号
      port: '3306',
      // 用户名
      user: 'root',
      // 密码
      password: 'zlptpyw',
      // 数据库名
      database: 'zlpt',
    },
    // 是否加载到 app 上，默认开启
    app: true,
    // 是否加载到 agent 上，默认关闭
    agent: false,
  };




  config.cluster = {
    listen: {
      port: 7001,
      hostname: '127.0.0.1'
    },

  };
  config.info = {
    // myAppName: 'egg',
    appid: "", //appid
    appsecret: "", //秘钥
    key: "9vApxLk5G3PAsJrM",//16位 对称公钥
    iv: "FnJL7EDzjqWjcaY9" //偏移量
  };
  return config;
};
