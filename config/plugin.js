'use strict';

// had enabled by egg
// exports.static = true;
  //参数验证插件
  exports.validate = {
    enable: true,
    package: 'egg-validate',
  };
  exports.cors = {
    enable: true,
    package: 'egg-cors',
  };
  exports.mongo = {
    enable: true,
    package: 'egg-mongo-native'
  }

  exports.redis = {
    enable: true,
    package: 'egg-redis'
  }
  exports.mysql = {
    enable: true,
    package: 'egg-mysql'
  }
  // exports.io = {
  //   enable: true,
  //   package: 'egg-socket.io'
  // };
