const Subscription = require('egg').Subscription;

class Access extends Subscription {
    // 通过 schedule 属性来设置定时任务的执行间隔等配置
    static get schedule() {
        return {
            interval: '1h', // 1 小时间隔
            type: 'worker', // 指定随机一个worker 都需要执行
            immediate: 'true',//配置了该参数为 true 时，这个定时任务会在应用启动并 ready 后立刻执行一次这个定时任务。
            // disable:'true',//配置该参数为 true 时，这个定时任务不会被启动
            env: ['prod']//仅在指定的环境下才启动该定时任务。
        };
    }

    // subscribe 是真正定时任务执行时被运行的函数
    async subscribe() {
        //获取access_token

        const redis = this.app.redis.get('access_token');
        let appid = this.app.config.info.appid;
        let secret = this.app.config.info.secret;
        let url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${appid}&secret=${secret}`
        let res = await this.ctx.curl(url, {
            dataType: 'json',
        });
        await redis.set("access_token", res.data.access_token);


    }
}

module.exports = Access;