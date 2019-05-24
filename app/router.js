'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

const { router, controller, middleware } = app;
// let loginVerify=middleware.loginVerify({})//用户身份验证
//用户注册请求短信验证码
router.get('/pdyg/app/user/register/duanxin',controller.user.req_dx);
//用户完成注册（并验证短信验证码）
router.post('/pdyg/app/user/register',controller.user.register);
router.get('/pdyg/app/user/login',controller.user.login);
};
