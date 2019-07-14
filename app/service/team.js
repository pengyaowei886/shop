
const Service = require('egg').Service;
const xml2js = require('xml2js');
const fxp = require("fast-xml-parser");
class TeamService extends Service {

    //用户发起拼团
    async start_team(uid, goods_id, spec) {
        const mysql = this.app.mysql;
        let data = {};
        //判断库存
        let repertory = await mysql.select('join_spec', { where: { id: spec, status: 1 }, columns: ['repertory', 'leader_price', 'join_xianjin', 'spec'] });
        if (repertory[0].repertory > 0) {
            //查询积分余额
            let balance = await mysql.select('user', { where: { id: uid }, columns: ['balance'] });
            if (balance[0].balance >= repertory[0].leader_price) {
                //查询用户收货地址
                let address = await mysql.select('address', { where: { uid: uid, is_default: 1 } });
                //查询商品基本信息
                let goods_info = await mysql.select('join_goods', { where: { id: goods_id, status: 1 }, columns: ['introduce', 'head_pic'] });
                data.join_price = repertory[0].join_price;
                data.join_xianjin = repertory[0].join_xianjin;
                data.introduce = goods_info[0].introduce;
                data.head_pic = goods_info[0].head_pic;
                data.address = address;
                return data;
            } else {
                throw new Error("积分余额不足");
            }
        } else {
            throw new Error("库存为0");
        }
    }
    //用户确认开团
    async open_team(goods_id, introduce, spec, address, money, openid, ip) {
        const mysql = this.app.mysql;
        let attach = "unsuccess";
        let huidiao_url = "https://caoxianyoushun.cn:8443/zlpt/app/user/team/return";
        let body_data = "开团支付";
        let order_no = new Date().getTime();
        //生成预付款订单
        await mysql.insert('join_order', {
            uid: uid[0],
            order_no: order_no, //订单号
            goods_id: goods_id,
            introduce: introduce,
            money: money,
            spec: spec,
            address: address,
            ctime: new Date(),
            status: 0 //待付款
        });
        let data = await this.ctx.service.tools.weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, attach);

        return data;
    }
    //开团微信回调
    async open_pay_return(body) {
        const mysql = this.app.mysql;
        const xml2json = fxp.parse(body);
        let reData = JSON.stringify(xml2json);

        this.ctx.logger.error("微信返回值内容" + reData);
        if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == 'SUCCESS') {
            // 支付成功处理 
            let openid = reData.openid;
            let order_no = reData.out_trade_no;
            let money = reData.total_fee;
            let wx_num = reData.transaction_id;
            let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });
            let order_res = await mysql.select('join_order', { where: { order_no: order_no } });
            let join_res = await mysql.select('join_specs', { where: { id: spec } })



            //生成 拼团信息
            await mysql.insert('join_team', {
                uid: uid[0],
                order_no: order_no, //订单号
                goods_id: goods_id,
                gold: join_res[0].team_price,//成团需要的积分
                join_number: join_res[0].join_num,
                now_join_num: 0,
                now_gold: 0, //现有积分
                ctime: new Date(),
                status: 0 //成团中
            });
            //修改拼团订单状态
            await mysql.update('join_order', { status: 1 }, { where: { order_no: order_no } });
            //生成积分消费记录
            await mysql.insert('gold_record', {
                uid: uid[0],
                money: order_res[0].gold,
                source: 2, //开团消耗
                ctime: new Date(),
            });
            //生成支付记录
            await mysql.insert('pay_record', {
                uid: uid,
                money: money,
                wx_num: wx_num,
                kind: 1, //微信小程序支付
                status: 2, //开团支付
                ctime: new Date(),
            });
            //扣除开团积分
            let sql = "update  user set banlance = banlance - ? where id= ?";
            let args = [order_res[0].gold, uid[0]];
            await mysql.query(sql, args);
            return true;
        } else {
            return false;
        }
    }
    //用户参加拼团
    async join_team(openid, join_no, money, ip) {
        const mysql = this.app.mysql;
        //判断团是否已经成团
        let team_exist = await mysql.select('join_team', { where: { id: join_id }, columns: ['status'] })
        if (team_exist[0].status == 0) {
            let order_no = new Date().getTime();
            let huidiao_url = "https://caoxianyoushun.cn:8443/zlpt/app/user/join_team/return";;
            let body_data = "参团支付";
            let data = await this.ctx.service.tools.weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, join_no);
            return data;
        } else {
            throw new Error('该团已拼成，请选择其他团')
        }
    }
    //参团支付回调
    async join_pay_return(body) {
        const xml2json = fxp.parse(body);
        let reData = JSON.stringify(xml2json);
        this.ctx.logger.error("微信返回值内容" + reData);

        if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == 'SUCCESS') {

            // 支付成功处理
            let openid = reData.openid;
            let order_no = reData.out_trade_no;
            let money = reData.total_fee;
            let join_no = reData.attach
            let wx_num = reData.transaction_id;
            let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });

            //更新 拼团信息
            let join_sql = "update  join_team set now_gold = now_gold +? , join_num = join_num + 1 where join_no = ?";
            let join_args = [money, join_no];
            await mysql.query(join_sql, join_args);

            //生成积分消费记录
            await mysql.insert('gold_record', {
                uid: uid[0],
                num: money,//预留
                source: 1, //参团赠送
                ctime: new Date(),
                end_time: new Date(new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000) //180天后失效
            });
            //生成支付记录
            await mysql.insert('pay_record', {
                uid: uid[0],
                money: money,
                wx_num: wx_num,
                kind: 1, //微信小程序支付
                status: 1, //参团支付
                ctime: new Date(),
            });
            //增加账号积分
            let user_sql = "update  user set balance = balance + ? where id= ?";
            let user_args = [money, uid[0]];
            await mysql.query(user_sql, user_args);
            return true;
        } else {
            return false;
        }
    }
    // 查询用户拼团列表
    async query_user_team(uid, status) {
        const mysql = this.app.mysql;
        let result = await mysql.select('join_team', { where: { uid: uid, status: status }, columns: ['gold', 'now_gold', 'join_number', 'goods_id', 'spec'] });
        return result;
    }
    //查看用户拼团具体详情
    async query_user_team_info(join_no) {
        const mysql = this.app.mysql;
        let result = await mysql.select('join_team', {
            where: { uid: uid, status: status },
            columns: ['gold', 'now_gold', 'join_number', 'goods_id', 'spec'], order: ['ctime', 'desc']
        });
        let userinfo = await mysql.select('user_join', { where: { join_num: join_no }, columns: ['uid'] });
        //查出用户头像

        let head = await mysql.select('user', { where: { id: userinfo }, columns: ['id', 'head_pic'] });
        for (let i in userinfo) {
            for (let j in head) {
                if (userinfo[i].uid == head[j].id) {
                    userinfo[i].head_pic = head[j].head_pic;
                    break;
                }
            }
        }
        result[0].head = head;

        return result[0];
    }

    //检索同类拼团列表
    async query_same_team(goods_id, limit, skip) {
        const mysql = this.app.mysql;
        let result = await mysql.select('join_team', {
            where: { goods_id: goods_id },
            columns: ['uid'], order: ['ctime', 'desc'], limit: limit, offset: skip
        });
        let head = await mysql.select('user', { where: { id: result }, columns: ['id', 'head_pic'] });
        for (let i in result) {
            for (let j in head) {
                if (result[i].uid == head[j].id) {
                    result[i].head_pic = head[j].head_pic;
                    break;
                }
            }
        }
        return result;
    }


}
module.exports = TeamService;