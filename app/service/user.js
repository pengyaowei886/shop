'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');

class UserService extends Service {

    /**
   * 用户完成注册
   * @param {*手机号} phone 
   * @param {*密码} password 
   * @param {*昵称} name 
   */
    async register(phone, password, param) {
        let handerThis = this;
        const { ctx, app } = handerThis;


        const redis = this.app.redis.get('customer');
        const mysql = this.app.mysql;
        let data = {};

        let res_exit = await mysql.select('user', { where: { phone: phone } });
        if (res_exit.length > 0) {
            throw new Error("该手机号已注册")
        } else {
            let code = await redis.get(`${phone}:code`);
            if (code === param) {
                await mysql.insert('user', {
                    phone: phone,
                    password: password,//暂不加密密码
                    balance: 0,//余额
                    name: "",
                    ctime: new Date(),
                    status: 1,
                    referee: "",//推荐人
                    nick_name: "",
                    integral: 0, //积分
                    head_pic: ""
                })
                return data;
            } else {
                throw new Error("验证码错误")
            }
        }
    }
    /**
     * 用户注册请求短信验证码
     * @param {手机号} phone 
     */
    async req_dx(phone) {
        let handerThis = this;
        const { ctx, app } = handerThis;
        const redis = this.app.redis.get('customer');

        let data = {};
        //接入第三方短信验证码接口
        let params = "123456";
        // redis
        await redis.set(`${phone}:code`, params);
        //2分钟过期
        await redis.expire(`${phone}:code`, 120);
        //  console.log(result);
        return data;

    };
    /**
     * 登陆
     * @param {*} phone 
     * @param {*} password 
     */
    async login(phone, password) {
        const key = Buffer.from(this.app.config.info.key, 'utf8');//16位 对称公钥
        const iv = Buffer.from(this.app.config.info.iv.toString(), 'utf8');  //偏移量
        const mysql = this.app.mysql;
        const redis = this.app.redis.get('customer');
        let data = {};
        let encryptedText = crypto.createCipheriv("aes-128-cbc", key, iv);
        encryptedText.update(password);
        let result = await mysql.get('user', { phone: phone, password: password })
        if (result) {
            let token = encryptedText.final("hex");
            await redis.set(`${phone}:token`, token);
            data.token = token;
            return data;
        } else {
            throw new Error("账号或者密码错误")
        }


    }
    /**
 *  小程序登陆
 * 
 * */
    async LoginCode(code, userInfo) {//接收客户端发送过来的信息，其中包括code和appid
        /*
        * 首先读取本地 3_rdSession 是否存在，如果存在。判断是否过期。过期再生成一个存放本地（前端做）
        * 如果不存在 往下走
        */
        let handerThis = this;
        const { ctx, app } = handerThis;
        const mysql = this.app.mysql;
        let databack = 0;
        let code = userInfo.code;
        //console.log("code:",code);
        let appid = app.config.app.game.game_appid;
        let secret = app.config.app.game.game_appid;
        let r_url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code";
        let res1 = await ctx.curl(r_url, {
            method: "GET",
            contentType: "json",
            dataType: "json"
        });
        //用户服务器返回的数值
        //console.log("微信返回的信息：",res1.body);
        let session_key = JSON.parse(res1.body).session_key;//session_key
        let open_id = JSON.parse(res1.body).open_id;//open_id
        /*
         ** 拿到session_key和open_id，3_rdSession（随机生成）为key，session_key和open_id为value 存入微信小游戏缓存目录，下次登录直接读取，要设置有效期
         */

        //解密用户信息
        let signature2 = sha1(body.userInfo.rawData + session_key);
        if (body.userInfo.signature != signature2) {
            return res.json("数据签名校验失败");
        }
        // 解密
        let pc = new WXBizDataCrypt(appid, sessionkeyList[i]);
        let data = pc.decryptData(body.userInfo.encryptedData, body.userInfo.iv);
        //待补充
        await mysql.insert('user', { openid: open_id, data: data });
    }
    //用户编辑收藏
    async exit_collation() {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {

            let result = await mysql.insert('collation', {
                'goods_id': params.goods_id, "status": 1, ctime: new Date()
            })
            if (result.affectedRows === 1) {

                return return_data;

            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "delete") {
            let rows = {
                'id': params.id}
            let result = await mysql.delete('goods', rows);
            if (result.affectedRows === params.id.length) {
                return return_data;
            } else {
                throw new Error("取消收藏失败");
            }
        }
    }
    //用户查看收藏列表 
    async query_collation() {
        let handerThis = this;
        const { ctx, app } = handerThis;
        const mysql = this.app.mysql;

   let sql = "select g.id,g.head_pic,g.sell_price,g.introduce,g.status from goods g left join collation c on g.goods_id = c.goods_id " ;
     
        let result = await mysql.query(sql, args);
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
}
module.exports = UserService;