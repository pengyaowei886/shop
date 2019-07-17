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

    //小程序登陆
    router.post('/zlpt/wx/login', controller.user.login);
    //查询轮播图
    router.get('/zlpt/app/rotate_map/query', controller.user.query_rotate_map);
    //查看商品列表（名称，分类检索）
    router.get('/zlpt/app/goods/query', controller.goods.query_goods);
    //查询分类 
    router.get('/zlpt/app/class/query', controller.class.query_class);
    //查询推荐商品
    router.get('/zlpt/app/goods/hot/query', controller.goods.query_hot_goods);
    //查看商品具体属性
    router.get('/zlpt/app/goods/info', controller.goods.query_goods_info);
    //查看拼团商品列表
    router.get('/zlpt/app/join_goods/query', controller.goods.query_join_goods);
    //查看拼团商品具体详情
    router.get('/zlpt/app/join_goods/info', controller.goods.query_join_goods_info);

    //查看用户具体信息
    router.get('/zlpt/app/user/info', controller.user.query_user_info);
    //查询用户收获地址
    router.get('/zlpt/app/user/address/query', controller.address.query_address);
    //编辑用户收货地址
    router.post('/zlpt/app/user/address/edit', controller.address.edit_address);

    // 用户查看我的收藏
    router.get('/zlpt/app/user/collation/query', controller.user.query_collation);
    //用户编辑我的收藏
    router.post('/zlpt/app/user/collation/edit', controller.user.edit_collation);
    //用户查看我的购物车
    router.get('/zlpt/app/user/trolley/query', controller.trolley.query_trolley);
    //用户编辑购物车
    router.post('/zlpt/app/user/trolley/edit', controller.trolley.edit_trolley);
    //用户查看我的浏览历史
    router.get('/zlpt/app/user/history/query', controller.user.query_history);
    //用户编辑我的浏览历史
    router.post('/zlpt/app/user/history/edit', controller.user.edit_history);

    //用户发起拼团
    router.post('/zlpt/app/user/team/start', controller.team.start_team);

    //用户支付拼团
    router.get('/zlpt/app/user/team/pay', controller.team.open_team_pay);
    //支付拼团回调
    router.get('/zlpt/app/user/team/return', controller.team.open_pay_return);

    //用户参加拼团
    router.get('/zlpt/app/user/team/join', controller.team.join_team);
    //支付拼团回调
    router.get('/zlpt/app/user/team/join/return', controller.team.join_pay_return);
    //用户为自己的团支付剩余余额

    //用户查询拼团列表

    //用户查询我的拼团






    // //用户查看我的评价
    // router.get('/zlpt/app/user/evaluate/query', controller.user.query_evaluate);
    // //用户发表评价
    // router.post('/zlpt/app/user/evaluate/exit', controller.user.edit_evaluate);







    //*******************       拼团商品订单 ***********************/


    //*******************       商城商品订单 ***********************/



    //用户发起拼团

    //用户参加拼团

    //用户获得拼团所用金币


    //用户请求购买商品

    //用户完成购买商品

    //用户请求退款

    //查看我的订单

    //查看我的通知消息

    //查看我的分销
};
