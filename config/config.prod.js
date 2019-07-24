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
            },
            access_token: {
                host: '129.28.167.17',
                port: '6379',
                password: 'zlpt123456',
                db: 3
            },
            pay: {
                host: '129.28.167.17',
                port: '6379',
                password: 'zlpt123456',
                db: 4
              }
        }
    }
    config.bodyParser = {
        enable: true,
        encoding: 'utf8',
        formLimit: '100kb',
        jsonLimit: '100kb',
        strict: true,
        queryString: {
          arrayLimit: 100,
          depth: 5,
          parameterLimit: 1000,
        },
        enableTypes: ['json', 'form', 'text'],
        extendTypes: {
          text: ['text/xml', 'application/xml'],
        },
      };
    config.cluster = {
        listen: {
            port: 443,
            hostname: '172.30.0.2',
            https: {
                key: "C:/soft/workface/https/https.key",
                cert: "C:/soft/workface/https/https.pem"
            }
        },

    };
    // add your user config here
    // add your user config here
    config.info = {
        appid: "wxd83411d563dc2ac9", //appid
        secret: "459b7e46d08cfad301ad6da6f01f5671",//密钥
        mch_id: "1543200511",//商户号
        web: "https://caoxianyoushun.cn:8443/",
        openid: "oKvMN5Ef0LijcwlVkiLEOtv4urfg",
        business_secret: "GY32mgLScDLvLmJOfZFz74vmXorfULvr",//商户支付密钥
        key: "9vApxLk5G3PAsJrM",//16位 对称公钥
        iv: "FnJL7EDzjqWjcaY9" //偏移量
    }
    return {
        ...config
    };
};
