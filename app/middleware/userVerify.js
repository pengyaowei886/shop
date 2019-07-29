
let userVerify = function (options) {
    return async function loginVerify(ctx, next) {


        //解析token 获得uid
        let redis = ctx.app.redis.get('user');//获取数据库实例
        let token = ctx.request.header.token;
        console.log(token)
        let result = await redis.get(token);
        console.log(result)
        if (result) {
            next();
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
        next();
    }
}
module.exports = userVerify