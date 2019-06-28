'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

    const { router, controller, middleware } = app;
    // let adminVerify = middleware.loginVerify({})//管理员权限验证


    //tools工具类api***************tools工具类api
    //上传图片
    router.post('/zlpt/tools/upload', controller.tools.uoloadImg);
    //请求短信验证码
    router.get('/zlpt/tools/duanxin', controller.user.req_dx);

    //商家api****************************商家api

    //*******************      管理员 ***********************/

    // //管理员登陆
    // router.get('/zlpt/web/admin/login', controller.admin.login);
    // //查看管理员
    // router.get('/zlpt/web/admin/query', controller.admin.query_admin);
    // //编辑管理员
    // router.post('/zlpt/web/admin/edit', controller.admin.edit_admin);
    // //查询权限列表
    // router.get('/zlpt/web/admin/role/query', controller.admin.query_admin_role);
    // //为其他管理员授权
    // router.post('/zlpt/web/admin/role/edit', controller.admin.edit_admin_role);

    // //*******************       轮播图 ***********************/

    // //查询轮播图
    // router.get('/zlpt/web/rotate_map/query', controller.admin.query_rotate_map);
    // //编辑轮播图
    // router.post('/zlpt/web/rotate_map/edit', controller.admin.rotate_map_edit);

    // //*******************       商城商品 ***********************/
    //查看商品列表（名称，分类检索）
    router.get('/zlpt/web/goods/query', controller.goods.business_query_goods);
       //查询分类 
       router.get('/zlpt/app/class/query', controller.class.query_class);
       //查询推荐商品
       router.get('/zlpt/app/goods/hot/query', controller.goods.query_hot_goods);
    // //查看商品具体属性
    // router.get('/zlpt/web/goods/info', controller.goods.query_goods_info);
    // //编辑商品
    // router.post('/zlpt/web/goods/edit', controller.goods.edit_goods);


    // //*******************       拼团商品 ***********************/
    // //查看拼团商品列表
    // router.get('/zlpt/web/join_goods/query', controller.goods.query_join_goods);
    // //查看拼团商品具体详情
    // router.get('/zlpt/web/join_goods/info', controller.goods.query_join_goods_info);
    // //编辑拼团商品
    // router.post('/zlpt/web/join_goods/edit', controller.goods.edit_join_goods);
    // //编辑商品规格(两种商品都适用)
    // router.post('/zlpt/web/goods/spec', controller.goods.edit_goods_spec);


    // //*******************       用户 ***********************/
    // //查看用户列表（按条件检索）
    // router.get('/zlpt/web/user/query', controller.admin.query_user);
    // //查看用户具体信息
    // router.get('/zlpt/web/user/info', controller.admin.query_user_info);
    // //编辑用户
    // router.post('/zlpt/web/user/edit', controller.admin.user_info_edit);


    // //*******************       收获地址 ***********************/
    // //查询用户收获地址
    // router.get('/zlpt/web/user/address/query', controller.user.query_user_info);
    // //编辑用户收获地址
    // router.post('/zlpt/web/user/address/edit', controller.user.user_info_edit);


    //*******************       商品分类 ***********************/
 
    // //编辑分类
    // router.get('/zlpt/app/class/exit', controller.class.exit_class);


    //*******************       拼团商品订单 ***********************/


    //*******************       商城商品订单 ***********************/







    //用户api****************************用户api
    /*******************       登陆和注册 ***********************/

    // //用户完成注册（并验证短信验证码）
    // router.post('/zlpt/app/user/register', controller.user.register);
    // //用户登陆
    // router.get('/zlpt/app/user/login', controller.user.login);
    // //用户查看个人基本信息
    // router.get('/zlpt/app/user/info', controller.user.query_user_info);
    // //用户查看商品列表
    // router.get('/zlpt/app/user/goods/info', controller.user.user_query_goods_info);
    // //用户查看商品具体详情
    // router.get('/zlpt/app/user/goods/info', controller.user.user_query_goods_info);

    //用户查看拼团商品具体详情

    //用户发起拼团

    //用户参加拼团

    //用户获得拼团所用金币

    //用户查看我的收藏
    // router.get('/zlpt/app/user/collation/query', controller.user.query_collation);
    // //用户编辑我的收藏
    // router.post('/zlpt/app/user/collation/query', controller.user.exit_collation);
    // //用户查看我的购物车
    // router.get('/zlpt/app/user/trolley/query', controller.user.query_trolley);
    // //用户编辑购物车
    // router.post('/zlpt/app/user/trolley/query', controller.user.exit_trolley);
    // //用户查看我的浏览历史
    // router.get('/zlpt/app/user/history/query', controller.user.query_history);
    // //用户查看我的评价
    // router.get('/zlpt/app/user/evaluate/query', controller.user.query_evaluate);
    // //用户发表评价
    // router.post('/zlpt/app/user/evaluate/exit', controller.user.exit_evaluate);
    //用户请求购买商品

    //用户完成购买商品

    //用户佣金提现

    //用户请求退款

    //查看我的订单

    //查看我的通知消息

    //查看我的分销
};
