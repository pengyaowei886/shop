'use strict';

const Service = require('egg').Service;
const crypto = require('crypto');
const xml2js = require('xml2js');
// const WXBizDataCrypt = require('wxbizdatacrypt');
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

        // const key = Buffer.from(app.config.info.key, 'utf8');//16位 对称公钥
        // const iv = Buffer.from(app.config.info.iv.toString(), 'utf8');  //偏移量

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
        const redis = this.app.redis.get('duanxin');



        function randomStr() {	//产生一个随机字符串	
            var str = "";
            var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];

            for (var i = 1; i <= 6; i++) {
                var random = Math.floor(Math.random() * arr.length);
                str += arr[random];
            }

            return str;

        }
        let code = randomStr();
        let url = "http://v.juhe.cn/sms/send";


        console.log()
        let result = await this.ctx.curl(url, {
            method: "POST",
            dataAsQueryString: true,
            dataType: "json",
            data: {

                "mobile": phone,  // 接受短信的用户手机号码
                "tpl_id": 175967,  // 您申请的短信模板ID，根据实际情况修改
                "tpl_value": `#code#=${code}`,  // 您设置的模板变量，根据实际情况修改
                "key": this.app.config.info.duanxin_key,  // 应用APPKEY(应用详细页查询
                "dtype": "json"
            }
        })
        if (result.data.error_code == 0) {
            let data = {};
            // redis
            await redis.set(`${phone}:code`, code);
            //2分钟过期
            await redis.expire(`${phone}:code`, 60);
            //  console.log(result);
            return data;
        }else{
            return  result.data.reason;
        }

    };
    /**
     * 登陆
     * @param {*} phone 
     * @param {*} password 
     */

    /**
 *  小程序登陆
 * 
 * */
    async login(code, head_pic, nick_name) {//接收客户端发送过来的信息，其中包括code和appid
        /*
        * 首先读取本地 3_rdSession 是否存在，如果存在。判断是否过期。过期再生成一个存放本地（前端做）
        * 如果不存在 往下走
        */
        let handerThis = this;
        const { ctx, app } = handerThis;
        const mysql = this.app.mysql;
        const redis = this.app.redis.get('user');
        const key = Buffer.from(app.config.info.key, 'utf8');//16位 对称公钥
        const iv = Buffer.from(app.config.info.iv.toString(), 'utf8');  //偏移量
        let databack = {};

        //console.log("code:",code);
        let appid = this.app.config.info.appid;
        let secret = this.app.config.info.secret;
        let r_url = "https://api.weixin.qq.com/sns/jscode2session?appid=" + appid + "&secret=" + secret + "&js_code=" + code + "&grant_type=authorization_code";
        let res1 = await ctx.curl(r_url, {
            method: "GET",
            contentType: "json",
            dataType: "json"
        });
        let open_id = res1.data.openid;//open_id
        //判断用户是否存在
        let is_exist = await mysql.select('user', { where: { openid: open_id }, columns: ['id'] });
        if (is_exist.length > 0) {
            //查出token

            let encryptedText = crypto.createCipheriv("aes-128-cbc", key, iv);
            encryptedText.update(open_id);
            let token = encryptedText.final("hex");
            await redis.set(`${token}`, is_exist[0].id);
            databack.uid = is_exist[0].id;
            databack.token = token;
            databack.openid = open_id;
            return databack;
        } else {
            let options = {
                openid: open_id,
                balance: 0,
                wx_pic: head_pic,
                wx_nickname: nick_name,
                status: 1,
                ctime: new Date()
            }
            //插入数据库
            let uid_res = await mysql.insert('user', options);
            //  生成token
            let encryptedText = crypto.createCipheriv("aes-128-cbc", key, iv);
            encryptedText.update(open_id);
            let token = encryptedText.final("hex");

            // let user = await mysql.select('user', { where: { openid: open_id }, columns: ['id'] });
            // let uid = user[0].id;
            let result = await redis.set(`${token}`, uid_res.insertId);
            if (result == "OK") {
                databack.uid = uid_res.insertId;
                databack.token = token;
                databack.openid = open_id;
                return databack;
            } else {
                throw new Error('redis插入失败');
            }
        }
    }
    //查询轮播图
    async query_rotate_map(kind) {
        const mysql = this.app.mysql;
        let result = await mysql.select('rotate_map', {
            where: { status: 1, kind: kind }, columns: ['id', 'url', 'pic'],
            orders: [['ctime', 'desc']]
        });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //用户编辑收藏
    async edit_collation(action, params) {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {
            let is_exist = await mysql.select('collation', {
                where: { uid: params.uid, goods_id: params.id, kind: params.kind }
            })
            if (is_exist.length >= 1) {
                throw new Error("重复收藏");
            } else {
                let result = await mysql.insert('collation', {
                    'goods_id': params.goods_id, "uid": params.uid, "status": 1, ctime: new Date(), kind: params.kind
                })
                if (result.affectedRows === 1) {
                    return return_data;

                } else {
                    throw new Error("增加失败");
                }
            }
        }
        if (action == "delete") {
            let rows = {
                'id': params.id
            }
            let result = await mysql.delete('collation', rows);
            if (result.affectedRows == params.id.length) {
                return return_data;
            } else {
                throw new Error("取消收藏失败");
            }
        }
    }
    //用户查看收藏列表 
    async query_collation(uid, kind) {
        let handerThis = this;
        const { ctx, app } = handerThis;
        const mysql = this.app.mysql;
        let args = [];

        if (kind == 1) { //普通商品

            let sql = "select c.id, c.goods_id,g.head_pic,g.introduce ,s.sell_price,g.status from  collation c left join goods g on "
                + " g.id = c.goods_id  left join specs s on s.goods_id = c.goods_id    where   c.uid= ? and  c.kind=1 and  s.is_default=1";

            args.push(uid);
            let result = await mysql.query(sql, args);

            return result;
        } else {
            let sql = "select c.id,c.goods_id,g.head_pic,s.join_price,s.leader_price,s.join_number,g.introduce,g.status from collation c  left join " +
                "join_goods g  on g.id= c.goods_id  left join join_specs s on c.goods_id=s.goods_id where  c.uid= ? and  c.kind=2  and  s.is_default=1 ";
            args.push(uid);
            let result = await mysql.query(sql, args);
            return result;

        }

    }
    //用户查看浏览历史
    async query_history(uid, kind) {
        let handerThis = this;
        const { ctx, app } = handerThis;
        const mysql = this.app.mysql;
        const redis = this.app.redis.get('history');

        if (kind == 1) { //普通商品

            let goods_id = await redis.lrange(`history:goods:${uid}`, 0, -1);
            let result = await mysql.select('goods', { where: { id: goods_id }, columns: ['id', 'introduce', 'head_pic'] });
            let price = await mysql.select('specs', { where: { goods_id: goods_id, is_default: 1 }, columns: ['goods_id', 'sell_price'] });
            for (let i in result) {
                for (let j in price) {
                    if (result[i].id == price[j].goods_id) {
                        result[i].sell_price = price[j].sell_price;
                        break;
                    }
                }
            }
            return result;
        } else {
            let goods_id = await redis.lrange(`history:join_goods:${uid}`, 0, -1);
            let result = await mysql.select('join_goods', { where: { id: goods_id }, columns: ['id', 'introduce', 'head_pic'] });
            let price = await mysql.select('join_specs', { where: { goods_id: goods_id, is_default: 1 }, columns: ['goods_id', 'leader_price', 'join_number', 'join_price'] });
            for (let i in result) {
                for (let j in price) {
                    if (result[i].id == price[j].goods_id) {
                        result[i].join_number = price[j].join_number;
                        result[i].leader_price = price[j].leader_price;
                        result[i].join_price = price[j].join_price;
                        break;
                    }
                }
            }
            return result;
        }
    }
    //编辑浏览记录
    async edit_history(uid, goods_id, kind) {
        const redis = this.app.redis.get('history');
        let return_data = {};
        let goods_type;
        if (kind == 1) {
            goods_type = "goods"
        }
        if (kind == 2) {
            goods_type = "join_goods"
        }
        //先查链表长度
        let length = await redis.llen(`history:${goods_type}:${uid}`);
        //头元素
        let head = await redis.lindex(`history:${goods_type}:${uid}`, 0);
        if (head == goods_id) {
            return return_data;
        } else {
            if (length < 30) {
                //插入头部
                await redis.lpush(`history:${goods_type}:${uid}`, goods_id);
                return return_data;
            } else {
                //最早的记录出栈
                await redis.rpop(`history:${goods_type}:${uid}`);
                //最新记录进栈
                await redis.lpush(`history:${goods_type}:${uid}`, goods_id);
                return return_data;
            }
        }
    }
    //查询用户基本信息
    async query_user_info(uid) {
        const mysql = this.app.mysql;
        let result = await mysql.select('user', {
            where: { id: uid }, columns: ['wx_pic', 'wx_nickname', 'balance', 'phone']
        });
        if (result.length > 0) {
            return result;
        } else {
            throw new Error(" 查询用户信息失败");
        }
    }
    //用户绑定手机号
    async add_phone(uid, phone, code) {
        const mysql = this.app.mysql;
        const redis = this.app.redis.get('duanxin');
        let result = await mysql.select('user', {
            where: { id: uid }, columns: ['phone']
        });
        if (result[0].phone) {
            throw new Error("已经绑定过");
        } else {
            let re_code=await redis.get(`${phone}:code`);
            if(re_code==code){
                await mysql.update('user', { id: uid, phone: phone });
                return {};
            }else{
                throw new Error("验证码错误");
            }
            
        }
    }

}
module.exports = UserService;