'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

    const { router, controller, middleware } = app;
    let loginVerify = middleware.loginVerify({})//用户身份验证


    //tools工具类api***************tools工具类api
    //上传图片
    router.post('/zlpt/tools/upload', controller.tools.uoloadImg);

    //商家api****************************商家api
    //管理员登陆
    router.get('/zlpt/web/admin/login', controller.admin.login);
    //查看管理员
    router.get('/zlpt/web/admin/query', controller.admin.query_admin);
    //编辑管理员
    router.post('/zlpt/web/admin/edit', controller.admin.edit_admin);
    //查询轮播图
    router.get('/zlpt/web/rotate_map/query', controller.admin.query_rotate_map);
    //编辑轮播图
    router.post('/zlpt/web/rotate_map/edit', controller.admin.rotate_map_edit);
    //查看商品列表
    router.get('/zlpt/web/goods/query', controller.goods.query_goods);
    //查看商品具体属性
    router.get('/zlpt/web/goods/info', controller.goods.query_goods_info);
    //编辑商品
    router.post('/zlpt/web/goods/edit', controller.goods.edit_goods);
    //编辑商品规格
    router.post('/zlpt/web/goods/spec', controller.goods.edit_goods_spec);
    //查看用户列表（按条件检索）
    router.get('/zlpt/web/user/query', controller.admin.query_user);
    //查看用户具体信息
    router.get('/zlpt/web/user/info', controller.admin.query_user_info);
    //编辑用户
    router.post('/zlpt/web/user/edit', controller.admin.user_info_edit);



    //查看订单
    //编辑订单
    //查看用户
    //查看拼团订单
    //编辑拼团订单
    //发布拼团订商品
    //编辑拼团商品
    //编辑商品
    //编辑分类
    //查看交易金额



    //用户api


    //用户注册请求短信验证码
    router.get('/zlpt/app/user/register/duanxin', controller.user.req_dx);
    //用户完成注册（并验证短信验证码）
    router.post('/zlpt/app/user/register', controller.user.register);
    //用户登陆
    router.get('/zlpt/app/user/login', controller.user.login);

};
