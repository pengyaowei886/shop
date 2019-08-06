
let userVerify = function (options) {
    return async function loginVerify(ctx, next) {


        //解析token 获得uid

        let token = ctx.header.token;


        let keys = ctx.app.config.keys;



        if (token == keys) {
            await next()
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