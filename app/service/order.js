const Service = require('egg').Service;
class OrderService extends Service {

    //用户发起购买
    async start_pay_goods(goods) {

        let goods_id = [];
        let spec_id = [];
        let return_data={
            cost_price:0,
            gold:0,
            goods_info
        }
        for (let i in goods) {
            goods_id.push(goods[i].goods_id);
            spec_id.push(goods[i].spec_id);
        }
        let goods_info = await mysql.select('goods', { where: { id: goods_id}, columns: ['id', 'introduce', 'head_pic'] });
        let spec_info = await mysql.select('specs', { where: { id: spec_id }, columns: ['cost_price', 'goods_id', 'spec_name'] });
        for (let i in goods_info) {
            for (let j in spec_info) {
                if(goods_info[i].id==spec_info[i].goods_info){
                    goods_info[i].cost_price=spec_info[i].cost_price;
                    goods_info[i].spec_name=spec_info[i].spec_name;
                    return_data.cost_price+=spec_info[i].cost_price;
                    break;
                }
             }
        }
        return_data.gold=Math.floor(return_data.cost_price);
        return goods_info;
    }


    //用户结算购物车
    async trolley_pay(uid, goods) {
        const mysql = this.app.mysql;

        for (let i in goods) {
            goods_id.push(goods[i].goods_id);
        }
        await mysql.select('goods', { where: { id: goods_id }, columns: ['introduce', 'head_pic'] });

        let spec_id = [];
        for (let i in goods) {
            goods_id.push(goods[i].spec_id);
        }
        await mysql.select('specs', { where: { id: spec_id }, columns: ['cost_price', 'goods_id', 'spec_name'] });


        await mysql.insert('goods_order', {

        })
    }

}
module.exports = OrderService;