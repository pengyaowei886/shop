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
    
    //redis
    config.redis = {
        clients: {
            customer: {
                host: '154.48.228.16',
                port: '6379',
                password: '',
                db: 0,
            },
            business: {
                host: '154.48.228.16',
                port: '6379',
                password: '',
                db: 1,
            },
            boss: {
                host: '154.48.228.16',
                port: '6379',
                password: '',
                db: 2,
            },
        },
    }


    config.mongo = {
        clients: {
          SSS: {
            host: '154.48.228.16',
            port: '27019',
            name: 'sss',
            user: 'sss',
            password: 'sss159370',
            options: {useNewUrlParser: true},
          }
        }
      };

    // add your user config here
    const userConfig = {
        // myAppName: 'egg',
    };
    return {
        ...config,
        ...userConfig,
    };
};
