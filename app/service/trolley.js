const Service = require('egg').Service;
class TrolleyService extends Service {

    //查询购物车
    async query_trolley(uid) {

        const redis = this.app.redis.get('trolley');

        const mysql =this.app.mysql;

        let result = await redis.hgetall(`trolley:${uid}`);
        console.log(result);
        let goods_id = [];
        let spec_id = [];
        let num=[]
        for (let i in result) {
            let a = i.split(":")
            goods_id.push(a[0]);
            spec_id.push(a[1]);
        }
        let spec_info = await mysql.select('specs', { where: { id: spec_id }, columns: ['id','cost_price', 'goods_id', 'spec'] });
        let goods_info = await mysql.select('goods', { where: { id: goods_id }, columns: ['id','introduce', 'head_pic','status'] });
        for (let i in goods_info) {
            if (goods_info[i].status == 1) {
                for(let j in spec_info){
                    if(goods_info[i].id==spec_info[j].goods_id){
                        goods_info[i].spec_name=spec_info[j].spec;
                        goods_info[i].cost_price=spec_info[j].cost_price;
                       let num =`${goods_info[i].id}:${spec_info[j].id}`;
                       goods_info[i].num=result[`${num}`];
                        if(spec_info[j].status!=1 ||spec_info[j].repertory<=0){
                            goods_info[i].fujia="该规格已下架";
                        }else{
                            goods_info[i].fujia="";
                        }
                        break;
                    }
                   
                }

            }else{
                for(let j in spec_info){
                    if(goods_info[i].id==spec_info[j].goods_id){
                        goods_info[i].spec_name=spec_info[j].spec;
                        goods_info[i].cost_price=spec_info[j].cost_price
                        goods_info[i].fujia="该商品已下架";
                        let num =`${goods_info[i].id}:${spec_info[j].id}`;
                        goods_info[i].num=result[`${num}`];
                        break;
                    }
                   
                }
            }
        }
        return goods_info;
    }
    //编辑购物车
    async edit_trolley(action, goods_id, spec_id, uid) {
        const redis = this.app.redis.get('trolley');
        let return_data = {};
        if (action == "insert") {
            //set 集合中存入hash键
            let is_exist = await redis.hget(`trolley:${uid}`, `${goods_id}:${spec_id}`);
            //购物车如果存在，数量+1；
            if (is_exist) {

                await redis.hmset(`trolley:${uid}`, `${goods_id}:${spec_id}`, Number(is_exist) + 1);
            } else {
                //不存在
                await redis.hmset(`trolley:${uid}`, `${goods_id}:${spec_id}`, 1);
            }
            return return_data;
        }
        if (action == "delete") {
            let is_exist = await redis.hget(`trolley:${uid}`, `${goods_id}:${spec_id}`);
            //购物车如果存在；
            if (is_exist) {
                await redis.hdel(`trolley:${uid}`, `${goods_id}:${spec_id}`);
            } else {
                //不存在
                throw new Error("被删除的商品不存在");
            }
            return return_data;
        }
    }
}
module.exports = TrolleyService;