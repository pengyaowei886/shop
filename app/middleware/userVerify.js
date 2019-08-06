
let userVerify = function (options) {
    return async function loginVerify(ctx, next) {


        //解析token 获得uid
        let redis = ctx.app.redis.get('access_token');//获取数据库实例



        let access_token = await redis.get("access_token");

        let url = `https://api.weixin.qq.com/cgi-bin/getcallbackip?access_token=${access_token}`;

        let res = await ctx.curl(url, {
            method: "get",
            dataType: 'json'
        });
        let ip = ctx.host;
        let list = res.data.ip_list;

        if (list.indexOf(ip) != -1) {
            await next();
        } else {
            function error(desc) {
                ctx.status = 200;
                let msg = desc;
                ctx.body = {
                    code: 1000,
                    msg: msg,
                    data: null,
                };
            }
            return error("认证失败")
        }





        //判断请求是否来自微信
    }
}
module.exports = userVerify