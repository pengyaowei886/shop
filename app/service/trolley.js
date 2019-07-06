const Service = require('egg').Service;
class TrolleyService extends Service {

    //查询购物车
    async query_trolley(uid) {

        const redis = this.app.redis.get('trolley');
        
    
        let result = await redis.hgetall(`trolley:${uid}`);
        console.log(result);
        // for(let i in result){
        //     console.log("iiiiii"+i);
        //    for(let j in result[i]){
        //        console.log(j);
        //        console.log(result[i][j]);
        //    }
        // }
        return result;
    }
    //编辑购物车
    async edit_trolley(action, goods_id, spec_id, uid, params) {
        const redis = this.app.redis.get('trolley');
        let return_data = {};
        if (action == "insert") {
            //set 集合中存入hash键
            let is_exist = await redis.hget(`trolley:${uid}`, `${goods_id}:${spec_id}`);
            //购物车如果存在，数量+1；
            if (is_exist) {
                let arr = is_exist.split(";")
                let append = Number( arr[4] )+ 1;
                let str = "";
                for (let i = 0; i < 4; i++) {
                    str += arr[i] + ";";
                }
                str += append;
                await redis.hmset(`trolley:${uid}`, `${goods_id}:${spec_id}`, str);
                
            } else {
                //不存在
                await redis.hmset(`trolley:${uid}`, `${goods_id}:${spec_id}`,params+";1");
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