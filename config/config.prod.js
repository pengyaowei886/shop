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
    const userConfig = exports = {};
    // use for cookie sign key, should change to your own and keep security
    config.keys = appInfo.name + '_1557129655272_1836';

    // add your middleware config here
    config.middleware = [];
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

    // //mysql配置
    // config.mysql = {
    //     // database configuration
    //     client: {
    //         host: '154.48.228.16',
    //         port: '3306',
    //         user: 'root',
    //         password: '159370',
    //         database: 'shop',
    //     }
    // };


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

    config.redis = {
        clients: {
            user: {
                host: '129.28.167.17',
                port: '6379',
                password: 'zlpt123456',
                db: 0,
            },
            trolley: {
                host: '129.28.167.17',
                port: '6379',
                password: 'zlpt123456',
                db: 1,
            },
            history: {
                host: '129.28.167.17',
                port: '6379',
                password: 'zlpt123456',
                db: 2
            }
        }
    }
    config.cluster = {
        listen: {
            port: 8443,
            hostname: '172.30.0.2',
            https:{
                key:"C:/soft/workface/https/https.key",
                cert:"C:/soft/workface/https/https.pem"
            }
        },

    };
    // add your user config here
    // add your user config here
    userConfig.info= {
        // myAppName: 'egg',
        appid: "wxd83411d563dc2ac9", //appid
        appsecret: "459b7e46d08cfad301ad6da6f01f5671" ,//密钥
        mch_id:"1543200511",//商户号
        business_secret:"GY32mgLScDLvLmJOfZFz74vmXorfULvr",
        web:"https://caoxianyoushun.cn:8443/"//
     } 
    return {
        ...config,
        ...userConfig,
    };
};
