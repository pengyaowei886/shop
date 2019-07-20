const Service = require('egg').Service;
class OrderService extends Service {

    // //用户发起购买
    // async start_pay_goods(goods) {

    //     let goods_id = [];
    //     let spec_id = [];
    //     let return_data = {
    //         money: 0,
    //         gold: 0,
    //         goods_info
    //     }
    //     for (let i in goods) {
    //         goods_id.push(goods[i].goods_id);
    //         spec_id.push(goods[i].spec_id);
    //     }
    //     let goods_info = await mysql.select('goods', { where: { id: goods_id }, columns: ['id', 'introduce', 'head_pic'] });
    //     let spec_info = await mysql.select('specs', { where: { id: spec_id }, columns: ['cost_price', 'goods_id', 'spec'] });
    //     for (let i in goods_info) {
    //         for (let j in spec_info) {
    //             if (goods_info[i].id == spec_info[i].goods_info) {
    //                 goods_info[i].sell_price = spec_info[i].sell_price;
    //                 goods_info[i].spec_name = spec_info[i].spec;
    //                 return_data.money += spec_info[i].sell_price;
    //                 break;
    //             }
    //         }
    //     }
    //     return_data.gold = Math.floor(return_data.cost_price);
    //     return goods_info;
    // }


    //用户结算购物车
    async trolley_pay(goods, uid, is_gold, youfei, address_id, openid, ip) {
        const mysql = this.app.mysql;
        let goods_id = [];
        let spec_id = [];
        for (let i in goods) {
            goods_id.push(goods[i].goods_id);
        }
        let goods_info = await mysql.select('goods', { where: { id: goods_id }, columns: ['id', 'introduce', 'head_pic'] });

        for (let i in goods) {
            spec_id.push(goods[i].spec_id);
        }
        let spec_info = await mysql.select('specs', { where: { id: spec_id }, columns: ['sell_price', 'goods_id', 'spec'] });

        let money = 0;
        for (let i in goods) {
            for (let j in goods_info) {
                for (let k in spec_info) {
                    if (goods[i].goods_id == goods_info[j].id && goods_info[j].id == spec_info[k].goods_id) {
                        goods[i].introduce = goods_info[j].introduce
                        goods[i].head_pic = goods_info[j].head_pic
                        goods[i].sell_price = spec_info[k].sell_price;
                        goods[i].spec_name = spec_info[k].spec;
                        money += goods[i].sell_price * goods[i].num;
                        break;
                    }
                }
            }
        }

        let order_no = new Date().getTime();
        let gold_info = await mysql.select('user', { where: { id: uid }, columns: ['balance'] })

        let address = await mysql.select('address', { where: { id: address_id }, columns: ['address', 'phone', 'user_name', 'detailInfo'] })

        let gold = 0;
        if (is_gold == 1) {
            if (gold_info[0].balance >= money * 10) {
                gold = money * 10;
            } else {
                gold = gold_info[0].balance
            }
        } else {
            gold = 0;
        }

        await mysql.insert('goods_order', {
            order_no: order_no,
            uid: uid,
            money: money,
            gold: gold,
            youfei: youfei,
            shouhuoren: address[0].user_name,
            phone: address[0].phone,
            address: address[0].address,
            detailInfo: address[0].detailInfo,
            ctime: new Date(),
            status: 0
        })

        let sql = "insert into goods_order_info ( order_no,introduce,head_pic,spec_name,num,goods_id,money) values  ";
        let args = [];
        for (let i = 0; i < goods.length; i++) {

            args.push(order_no, goods[i].introduce, goods[i].head_pic, goods[i].spec_name, goods[i].num, goods[i].goods_id, goods[i].sell_price);
            if (i === goods.length - 1) {
                sql += "(?,?,?,?,?,?,?) ;";
                break;
            } else {
                sql += "(?,?,?,?,?,?,?) ,";
            }
        }
        await mysql.query(sql, args);
        let huidiao_url = "http://caoxianyoushun.cn/zlpt/app/user/team/return";
        let body_data = "订单付款";
        let attach = order_no;
        //付款
        let data = await this.ctx.service.tools.weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, attach);
        return data;
    }
    //用户完成购买
    async goods_pay_return(body) {
        const mysql = this.app.mysql;

        let reData = await this.ctx.service.tools.query_weixin_order(body);

        let openid = reData.openid[0];
        let order_no = reData.out_trade_no[0];
        let money = reData.total_fee[0];
        let wx_num = reData.transaction_id[0];


        let databack = {};

        let uid = await mysql.select('user', { where: { openid: openid }, columns: ['id'] });

        let order_res = await mysql.select('goods_order', { where: { order_no: order_no }, columns: ['status', 'gold'] });
        if (order_res[0].status == 0) {
            //生成积分消费记录
            await mysql.insert('gold_record', {
                uid: uid[0].id,
                num: -order_res[0].gold,
                source: 3, //商店抵扣
                ctime: new Date(),
            });
            //生成支付记录
            await mysql.insert('pay_record', {
                uid: uid[0].id,
                pay_num: money,
                pay_no: wx_num,
                kind: 1, //微信小程序支付
                status: 3, //商城商品支付
                ctime: new Date(),
            });
            //扣除开团积分
            let sql = "update  user set balance = balance - ? where id= ?";
            let args = [order_res[0].gold, uid[0].id];
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

}
module.exports = OrderService;