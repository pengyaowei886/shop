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
}
module.exports = UserService;