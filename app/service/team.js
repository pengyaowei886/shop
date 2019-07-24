
const Service = require('egg').Service;

class TeamService extends Service {

    //用户发起拼团
    async start_team(uid, goods_id, spec) {
        const mysql = this.app.mysql;
        let data = {};
        //判断库存
        let repertory = await mysql.select('join_specs', { where: { id: spec, status: 1 }, columns: ['repertory', 'leader_price', 'spec'] });
        if (repertory[0].repertory > 0) {
            //查询积分余额
            let balance = await mysql.select('user', { where: { id: uid }, columns: ['balance'] });
            if (balance[0].balance >= repertory[0].leader_price) {
                //查询用户收货地址
                let address = await mysql.select('address', { where: { uid: uid, is_default: 1 }, columns: ['address', 'user_name', "phone", 'detailInfo'] });
                //查询商品基本信息
                let goods_info = await mysql.select('join_goods', { where: { id: goods_id, status: 1 }, columns: ['introduce', 'join_xianjin', 'head_pic'] });
                data.join_price = repertory[0].join_price;
                data.balance =
                    data.spec = repertory[0].spec,
                    data.join_xianjin = goods_info[0].join_xianjin;
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
    async open_team(goods_id, spec_id, address_id, youfei, openid, ip) {
        const mysql = this.app.mysql;
        let attach = goods_id;
        let huidiao_url = "http://caoxianyoushun.cn/zlpt/app/user/team/return";
        let body_data = "开团支付";
        let order_no = new Date().getTime();
        let goods_info = await mysql.select('join_goods', { where: { id: goods_id }, columns: ['join_xianjin', 'introduce', 'head_pic'] });

        let spec_info = await mysql.select('join_specs', { where: { id: spec_id }, columns: ['team_price', 'leader_price', 'spec'] });

        let address_info = await mysql.select('address', { where: { id: address_id }, columns: ['phone', 'address', 'user_name', 'detailInfo'] });
        //生成预付款订单
        let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });
        let money = goods_info[0].join_xianjin + youfei;
        await mysql.insert('join_order', {
            uid: uid[0].id,
            order_no: order_no, //订单号
            goods_id: goods_id,
            introduce: goods_info[0].introduce,
            money: goods_info[0].join_xianjin,
            gold: spec_info[0].leader_price,
            youfei: youfei,
            spec: spec_info[0].spec,
            spec_id: spec_id,
            address: address_info[0].address,
            detailInfo: address_info[0].detailInfo,
            shouhuoren: address_info[0].user_name,
            phone: address_info[0].phone,
            ctime: new Date(),
            end_time: new Date(new Date().getTime() + 30 * 60 * 1000),//订单付款截止时间
            status: 0 //待付款
        });
        let data = await this.ctx.service.tools.weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, attach);
        //放入redis 
        await redis.hset(`pay:${uid}:${order_no}`, 'timeStamp', data.timeStamp);
        await redis.hset(`pay:${uid}:${order_no}`, 'nonceStr', data.nonceStr);
        await redis.hset(`pay:${uid}:${order_no}`, 'package', data.package);
        await redis.hset(`pay:${uid}}:${order_no}`, 'paySign', data.paySign);
        await redis.hset(`pay:${uid}:${order_no}`, 'order_no', data.order_no);
        await redis.expire(`${phone}:code`, 2400);//40分钟后过期
        return data;
    }
    //用户继续完成开团支付
    async open_team_again(order_no, uid) {
        const redis = this.app.redis.get('pay');
        let result = redis.hgetall(`pay:${uid}:${order_no}`);
        console.log(result);
        return result;
    }

    //开团微信回调
    async open_pay_return(body) {
        const mysql = this.app.mysql;


        // // this.ctx.logger.error("微信返回值内容" + body);
        // const xml2json = fxp.parse(body);
        // console.log(xml2json);
        // let res=JSON.stringify(body);
        // // this.ctx.logger.error("微信返回值内容" + res);
        // let reData =res.xml;
        //   console.log(res)

        let reData = await this.ctx.service.tools.query_weixin_order(body);

        let openid = reData.openid[0];
        let order_no = reData.out_trade_no[0];
        let money = reData.total_fee[0];
        let wx_num = reData.transaction_id[0];


        let databack = {};

        let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });

        let order_res = await mysql.select('join_order', { where: { order_no: order_no }, columns: ['spec_id', 'goods_id', 'gold', 'ctime', 'status'] });
        if (order_res[0].status == 0) {
            let join_res = await mysql.select('join_specs', { where: { id: order_res[0].spec_id } });
            let effectiv_time = await mysql.select('join_goods', { where: { id: order_res[0].goods_id }, columns: ['effectiv_time'] });

            //生成 拼团信息
            await mysql.insert('join_team', {
                uid: uid[0].id,
                order_no: order_no, //订单号
                goods_id: join_res[0].goods_id,
                gold: Number(join_res[0].team_price),//成团需要的积分
                join_num: join_res[0].join_number,
                now_join_num: 0,
                now_gold: 0, //现有积分
                ctime: new Date(),
                end_time: new Date(new Date().getTime() + effectiv_time[0].effectiv_time * 60 * 60 * 1000),//拼团结束时间
                status: 0 //成团中
            });
            //修改拼团订单状态
            await mysql.update('join_order', { status: 1 }, { where: { order_no: order_no } });
            //生成积分消费记录
            await mysql.insert('gold_record', {
                uid: uid[0].id,
                num: -join_res[0].leader_price,
                source: 2, //开团消耗
                ctime: new Date(),
            });
            //生成支付记录
            await mysql.insert('pay_record', {
                uid: uid[0].id,
                pay_num: money/100,
                pay_no: wx_num,
                kind: 1, //微信小程序支付
                status: 2, //开团支付
                ctime: new Date(),
            });
            //扣除开团积分
            let sql = "update  user set balance = balance - ? where id= ?";
            let args = [join_res[0].leader_price, uid[0].id];
            await mysql.query(sql, args);
            databack.ctime = order_res[0].ctime;
            databack.gold = order_res[0].gold;
            databack.order_no = order_no;
            databack.wx_no = wx_num;
            return databack;
        } else {
            throw new Error('订单状态异常');
        }
    }
    //用户参加拼团
    async join_team(openid, uid, join_no, money, ip) {
        const mysql = this.app.mysql;
        //判断团是否已经成团
        let team_exist = await mysql.select('join_team', { where: { order_no: join_no }, columns: ['status', 'uid'] })
        if (uid != team_exist[0].uid && eam_exist[0].status == 0) {
            let order_no = new Date().getTime();
            let huidiao_url = "http://caoxianyoushun.cn/zlpt/app/user/join_team/return";
            let body_data = "参团支付";
            let data = await this.ctx.service.tools.weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, join_no);
            return data;
        } else {
            throw new Error('不能参加自己的团或者此团已拼成功')
        }
    }
    //参团支付回调
    async join_pay_return(body) {
        // const xml2json = fxp.parse(body);
        // let reData = JSON.stringify(xml2json);
        // this.ctx.logger.error("微信返回值内容" + reData);
        const mysql = this.app.mysql;
        // if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == 'SUCCESS') {
        let databack = {};
        let reData = await this.ctx.service.tools.query_weixin_order(body);
        //支付成功处理
        let openid = reData.openid[0];
        // let order_no = reData.out_trade_no[0];
        let money = reData.total_fee[0];
        let join_no = reData.attach[0]
        let wx_num = reData.transaction_id[0];



        let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });
        let team = await mysql.select('join_team', { where: { order_no: join_no }, columns: ['id', 'now_gold', 'gold'] });
        //判断此次加入是否成团
        if (team[0].now_gold + money >= team[0].gold) {
            let join_sql = "update  join_team set now_gold = gold , join_num = join_num + 1,sum_gold= sum_gold +? ,status=1   where order_no = ?";
            let join_args = [money, money, join_no];
            await mysql.query(join_sql, join_args);
        } else {
            let join_sql = "update  join_team set now_gold = now_gold +? , join_num = join_num + 1, sum_gold= sum_gold +? ,status=1   where order_no = ?";
            let join_args = [money, money, join_no];
            await mysql.query(join_sql, join_args);
        }
        //更新 拼团信息

        //生成用户参团记录
        await mysql.insert('user_join', {
            uid: uid[0].id,
            num: money,//预留
            ctime: new Date(),
            join_no: join_no
        });

        //生成积分消费记录
        await mysql.insert('gold_record', {
            uid: uid[0].id,
            num: money,//预留
            source: 1, //参团赠送
            ctime: new Date(),
            end_time: new Date(new Date().getTime() + 6 * 30 * 24 * 60 * 60 * 1000) //180天后失效
        });
        //生成支付记录
        await mysql.insert('pay_record', {
            uid: uid[0].id,
            pay_num: money/100,
            pay_no: wx_num,
            kind: 1, //微信小程序支付
            status: 1, //参团支付
            ctime: new Date(),
        });
        //增加账号积分
        let user_sql = "update  user set balance = balance + ? where id= ?";
        let user_args = [money, uid[0].id];
        await mysql.query(user_sql, user_args);

        databack.money = money;
        return databack;

    }
    // 查询用户拼团列表
    async query_user_team(uid, status) {
        const mysql = this.app.mysql;
        let result = await mysql.select('join_team', { where: { uid: uid, status: status }, columns: ['gold', 'now_gold', 'join_number', 'goods_id', 'spec'] });
        return result;
    }
    //    // 查询用户参团列表
    //    async query_user_team(uid, status) {
    //     const mysql = this.app.mysql;
    //     let result = await mysql.select('user_join', { where: { uid: uid, status: status }, columns: ['gold', 'now_gold', 'join_number', 'goods_id', 'spec'] });
    //     return result;
    // }


    //查看用户拼团具体详情
    async query_user_team_info(join_no) {
        const mysql = this.app.mysql;
        let result = await mysql.select('join_team', {
            where: { uid: uid, status: status },
            columns: ['gold', 'now_gold', 'join_number', 'goods_id', 'spec'], order: ['ctime', 'desc']
        });
        let userinfo = await mysql.select('user_join', { where: { join_num: join_no }, columns: ['uid'] });
        //查出用户头像

        let head = await mysql.select('user', { where: { id: userinfo[0].uid }, columns: ['id', 'head_pic'] });
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
        console.log(goods_id)
        let result = await mysql.select('join_team', {
            where: { goods_id : goods_id, status: 0 },
            columns: ['uid', 'end_time', 'order_no'], orders: [['ctime', 'desc']], limit: limit, offset: skip
        });
       if(result.length>0){
        let id = [];
        for (let i in result) {
            id.push(result[i].uid)
        }
        let head = await mysql.select('user', { where: { id: id }, columns: ['id', 'wx_pic', 'wx_nickname'] });

        for (let i in result) {
            for (let j in head) {
                if (result[i].uid == head[j].id) {
                    result[i].head_pic = head[j].wx_pic;
                    result[i].nick_name = head[j].wx_nickname;
                    break;
                }
            }
        }
        return result;
       }else{
           return [];
       }    
    }
    // 用户对自己的团进行包尾
    async join_myself(openid, join_no, ip) {
        const mysql = this.app.mysql;
        //判断团是否已经成团
        let team_exist = await mysql.select('join_team', { where: { id: join_id }, columns: ['status', 'gold', 'now_gold'] })
        if (team_exist[0].status == 0) {
            let gold = team_exist[0].gold;
            let now_gold = team_exist[0].now_gold;
            //判断能否包尾
            if (now_gold / gold >= 0.8) {

                let money = gold - now_gold;
                let order_no = new Date().getTime();
                let huidiao_url = "https://caoxianyoushun.cn:8443/zlpt/app/user/join_myself/return";
                let body_data = "包尾支付";
                let data = await this.ctx.service.tools.weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, join_no);
                return data;
            } else {
                throw new Error('不能包尾，去邀请其他人吧')
            }
        } else {
            throw new Error('该团已拼成，请选择其他团')
        }
    }
    //包尾支付回调
    async join_myself_return(body) {
        // const xml2json = fxp.parse(body);
        // let reData = JSON.stringify(xml2json);
        // this.ctx.logger.error("微信返回值内容" + reData);

        // if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == 'SUCCESS') {


        // 支付成功处理
        const mysql = this.app.mysql;
        // if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == 'SUCCESS') {
        let databack = {};
        let reData = await this.ctx.service.tools.query_weixin_order(body);
        //支付成功处理
        let openid = reData.openid[0];
        let order_no = reData.out_trade_no[0];
        let money = reData.total_fee[0];
        let join_no = reData.attach[0]
        let wx_num = reData.transaction_id[0];
        let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });
        //更新 拼团信息
        let join_sql = "update  join_team set now_gold = gold ,sum_gold= gold ,status=1, is_self=1, self_no =  ? ,self_money = gold - now_gold  where order_no = ?";
        let join_args = [order_no, join_no];
        await mysql.query(join_sql, join_args);
        //生成用户参团记录
        await mysql.insert('user_join', {
            uid: uid[0].id,
            num: money,//预留
            ctime: new Date(),
            join_no: join_no
        });

        //生成支付记录
        await mysql.insert('pay_record', {
            uid: uid[0].id,
            pay_num: money,
            pay_no: wx_num,
            kind: 1, //微信小程序支付
            status: 1, //参团支付
            ctime: new Date(),
        });
        return databack;
    }
}
module.exports = TeamService;