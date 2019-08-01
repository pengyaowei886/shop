const Subscription = require('egg').Subscription;

class Order extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '5m', // 1 小时间隔
      type: 'worker', // 指定随机一个worker 都需要执行
      immediate: 'true',//配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
      // disable:'true',//配置该参数为 true 时，这个定时任务不会被启动
      env: ['local']//仅在指定的环境下才启动该定时任务。
    };
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    //清理未支付订单
    await this.ctx.service.tools.pay_order();
    //清理代收货时间
    await this.ctx.service.tools.shouhuo_order();
    //自动评价
    await this.ctx.service.tools.pingjia_order();
    //清除规定时间未拼成的团
    await this.ctx.service.tools.team_order();

  }
}

module.exports = Order;