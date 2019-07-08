
const Service = require('egg').Service;
class TeamService extends Service {

    //用户发起拼团
    async start_team(uid, goods_id, spec) {
        const mysql = this.app.mysql;
        let data = {};
        //判断库存
        let repertory = await mysql.select('join_spec', { where: { id: spec, status: 1 }, columns: ['repertory', 'leader_price', 'join_xianjin', 'spec'] });
        if (repertory > 0) {
            //查询用户收货地址
            let address = await mysql.select('address', { where: { uid: uid, is_default: 1 } });
            //查询商品基本信息
            let goods_info = await mysql.select('join_goods', { where: { id: goods_id, status: 1 }, columns: ['introduce', 'head_pic'] });
            data.join_price = repertory[0].join_price;
            data.join_xianjin = repertory[0].join_xianjin;
            data.introduce = goods_info[0].introduce;
            data.head_pic = oods_info[0].head_pic;
            data.address = address;
            return data;
        } else {
            throw new Error("库存为0");
        }
    }



    //用户参加拼团
    async join_team(uid, goods_id, spec) {
        const mysql = this.app.mysql;
        let data = {};
        //判断库存
        let repertory = await mysql.select('join_spec', { where: { id: spec, status: 1 }, columns: ['repertory', 'leader_price', 'join_xianjin', 'spec'] });
        if (repertory > 0) {
            //查询用户收货地址
            let address = await mysql.select('address', { where: { uid: uid, is_default: 1 } });
            //查询商品基本信息
            let goods_info = await mysql.select('join_goods', { where: { id: goods_id, status: 1 }, columns: ['introduce', 'head_pic'] });
            data.join_price = repertory[0].join_price;
            data.join_xianjin = repertory[0].join_xianjin;
            data.introduce = goods_info[0].introduce;
            data.head_pic = oods_info[0].head_pic;
            data.address = address;
            return data;
        } else {
            throw new Error("库存为0");
        }
    }
    

    //用户提交拼团订单

    async start_team_order(uid, goods_id, spec, address) {
        const mysql = this.app.mysql;
        let data = {};
        let repertory = await mysql.select('join_spec', { where: { id: spec, status: 1 },
         columns: ['team_price', 'leader_price', 'join_xianjin', 'spec'] });
        //生成预付款拼团订单

        let order = new Date().getTime();//订单编号

  

        await mysql.insert('join_order', {
            uid: uid,
            team: order,
            goods_id: goods_id,
            spec: spec,
            leader_price: repertory[0].leader_price,
            join_xianjin: repertory[0].join_xianjin,
            spec_name: repertory[0].spec,
            team_price:repertory[0].team_price,
            address:address,
            ctime: new Date(),
            status: 0
        })
        return data;
    }





    async start_team_order(uid, goods_id, spec, address) {
        const mysql = this.app.mysql;
        let data = {};
        let repertory = await mysql.select('join_spec', { where: { id: spec, status: 1 },
         columns: ['team_price', 'leader_price', 'join_xianjin', 'spec'] });
        //生成预付款拼团订单

        let order = new Date().getTime();//订单编号

        await mysql.insert('join_order', {
            uid: uid,
            team: order,
            goods_id: goods_id,
            spec: spec,
            leader_price: repertory[0].leader_price,
            join_xianjin: repertory[0].join_xianjin,
            spec_name: repertory[0].spec,
            team_price:repertory[0].team_price,
            address:address,
            ctime: new Date(),
            status: 0
        })
        return data;
    }


}
module.exports = TeamService;