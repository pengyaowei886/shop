
const Service = require('egg').Service;
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
    async open_team(money, openid, ip) {
        let huidiao_url = "https://caoxianyoushun.cn:8443/";
        let body_data = "开团支付";
        let data = await this.ctx.service.tools.weixin_pay(huidiao_url, body_data, money, openid, ip);
        return data;
    }
    //开团微信回调
    async open_team_return(body) {
        let reData = xml2js.parseString(body, function (error, res) {
            return res;
        });
        if (reData.xml.return_code[0] == 'SUCCESS' && reData.xml.result_code[0] == 'SUCCESS') {


            // 支付成功处理

            //生成 拼团信息
            await mysql.insert('join_team', {
                uid: uid,
                order: order, //订单号
                goods_id: goods_id,
                spec: spec,
                gold: result[0].sum_price,//成团需要的积分
                now_gold: 0, //现有积分
                ctime: new Date(),
                status: 0 //成团中
            });

            //生成积分消费记录
            await mysql.insert('gold_record', {
                uid: uid,
                num: -gold,//预留
                source: 2, //开团消耗
                ctime: new Date(),
            });
            //扣除开团积分
            let sql = "update  user set banlance = banlance - ? where id= ?";
            let args = [gold, uid];
            mysql.query(sql, args);
            return true;
        } else {
            return false;
        }


    }
    //用户参加拼团
    async join_team(openid, join_id, money, ip) {
        const mysql = this.app.mysql;
        //判断团是否已经成团
        let team_exist = await mysql.select('join_team', { where: { id: join_id }, columns: ['status'] })
        if (team_exist[0].status == 0) {
            let huidiao_url = "https://caoxianyoushun.cn:8443/";
            let body_data = "参团支付";
            let data = await this.ctx.service.tools.weixin_pay(huidiao_url, body_data, money, openid, ip);
            return data;
        } else {
            throw new Error('该团已拼成，请选择其他团')
        }
    }
    //参团支付回调
    async join_pay_return(body) {

        let reData = xml2js.parseString(body, function (error, res) {

            return res;

        });

        if (reData.xml.return_code[0] == 'SUCCESS' && reData.xml.result_code[0] == 'SUCCESS') {

            // 支付成功处理

            //更新 拼团信息
            let join_sql = "update  join_team set now_gold = now_gold +? where id= ?";
            let join_args = [gold, join_id];
            await mysql.query(join_sql, join_args);

            //生成积分消费记录
            await mysql.insert('gold_record', {
                uid: uid,
                num: gold,//预留
                source: 1, //参团赠送
                ctime: new Date(),
            });
            //增加账号积分
            let user_sql = "update  user set banlance = banlance + ? where id= ?";
            let user_args = [user_sql, user_args];
            mysql.query(sql, args);
            return true;
        } else {
            return false;
        }


    }

}
module.exports = TeamService;