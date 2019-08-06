'use strict';

/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {

  const { router, controller, middleware } = app;
  //let userVerify = middleware.userVerify({})//token 验证


  //tools工具类api***************tools工具类api
  //上传图片
  router.post('/zlpt/tools/upload', controller.tools.uoloadImg);
  //请求短信验证码
  router.get('/zlpt/tools/duanxin', controller.user.req_dx);
  //查询物流
  router.post('/zlpt/tools/wuliu', controller.tools.get_path);

  //获取后台设置的参团协议
  router.get('/zlpt/tools/xieyi/query', controller.tools.get_xieyi);
  //获取后台设置的公告
  router.get('/zlpt/tools/gonggao/query', controller.tools.get_gonggao);
  //获取后台设置的公告
  router.get('/zlpt/tools/new/query', controller.tools.get_join_team);
  //获取后台设置的客服二维码
  router.get('/zlpt/tools/erweima/query', controller.tools.get_erweima);


  //小程序登陆
  router.post('/zlpt/wx/login', controller.user.login);


  //添加手机号
  router.post('/zlpt/wx/add/phone', controller.user.add_phone);

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
  //用户继续支付拼团
  router.get('/zlpt/app/user/team/pay/again', controller.team.open_team_again);
  //支付拼团回调
  router.get('/zlpt/app/user/team/return', controller.team.open_pay_return);

  //用户参加拼团
  router.get('/zlpt/app/user/team/join', controller.team.join_team);
  //支付参团回调
  router.get('/zlpt/app/user/team/join/return', controller.team.join_pay_return);
  //用户查询能否补差额
  router.get('/zlpt/app/user/team/self/query', controller.team.query_join_self);
  //用户为自己的团支付剩余余额
  router.get('/zlpt/app/user/team/self', controller.team.join_self);
  //b补差价回调
  router.get('/zlpt/app/user/team/self/return', controller.team.join_myself_return);
  //用户查询拼团列表

  //用户查询我的拼团
  router.get('/zlpt/app/user/team/list', controller.team.query_user_team);
  //用户检索相同拼团
  router.get('/zlpt/app/user/team/query/same', controller.team.query_same_team);

  //用户购买普通商品
  router.post('/zlpt/app/user/goods/pay', controller.order.trolley_pay);
  //用户继续购买普通商品
  router.post('/zlpt/app/user/goods/pay/again', controller.order.trolley_pay_again);
  //回调
  router.get('/zlpt/app/user/team/pay/return', controller.order.goods_pay_return);

  //查看订单角标
  router.get('/zlpt/app/user/order/num', controller.order.query_order_num);
  //查看订单列表
  router.post('/zlpt/app/user/order/list', controller.order.query_order_list);

  //用户编辑订单
  router.post('/zlpt/app/user/order/edit', controller.order.confire_order);

  //用户查看商品评价
  router.get('/zlpt/app/user/evaluate/order/query', controller.evaluate.query_self_evaluate);
  //用户查看订单评价
  router.get('/zlpt/app/user/evaluate/goods/query', controller.evaluate.query_goods_evaluate);

  //用户发表评价
  router.post('/zlpt/app/user/evaluate/edit', controller.evaluate.edit_evaluate);


  //用户查看分享
  router.get('/zlpt/app/user/team/fenxiang', controller.team.query_fenxiang);


};

