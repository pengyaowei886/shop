



const Service = require('egg').Service;
class Goodsservice extends Service {



    //用户查询商品列表
    async query_goods(limit, skip, name, class_class) {
        const mysql = this.app.mysql;
        let sql = "select id,pic,head_pic,sell_price,real_price,introduce,repertory from goods where kind =1 and  status =1  " ;
        if (name) {
            if (class_class) {
                sql += " and class = " + mysql.escape(class_class) + "introduce like " +
                    mysql.escape("%" + name + "%") + " order by  ctime  desc  limit ?  offset ? ";
            } else {
                sql += " and introduce like " +
                    mysql.escape("%" + name + "%") + " order by ctime  desc  limit ?  offset ? ";
            }
        } else {
            if (class_class) {
                sql += " and class =  " + mysql.escape(class_class) + "  order by ctime  desc   limit ?  offset ? ";
            }
        }
        let args = [limit, skip];
        let result = await mysql.query(sql, args);
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //用户查询热卖商品列表
    async query_hot_goods() {
        const mysql = this.app.mysql;
        let sql = "select id,pic,head_pic,real_price,sell_price,introduce,succ_volume from goods" +
            " where is_recommend=1 and  status =1 ";
        let result = await mysql.query(sql);
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //用户查看商品具体详情
    async query_goods_info(id) {
        const mysql = this.app.mysql;
        //先查商品信息
        let result = await mysql.select('goods', {
            where: { id: id }, columns: ['introduce', 'real_price', 'sell_price', 'class', 'succ_volume',
                'repertory', 'pic', 'head_pic']
        });
        if (result.length < 0) {
            throw new Error("查询商品信息失败");
        } else {
            //再查商品规格信息 
            let specs = await mysql.select('specs', {
                where: { goods_id: id }, columns: ['spec', 'price',
                    'repertory']
            });
            if (specs.length<1) {
                result[0].specs = null;
                return result;
            } else {
                result[0].specs = specs;
                return result;
            }
        }
    }
    //用户查看商品评价
    async  query_goods_evaluate(id) {
        const mysql = this.app.mysql;
        let data = {};
        let sql = "select  u.name,u.head_pic,e.evaluate from user as u right join evaluate as e on e.uid=u.id where e.goods_id= ? " +
            "order by is_recommend desc , ctime  desc  limit ?  offset ?";
        let args = [id, limit, skip];
        let result = mysql.query(sql, args);
        if (result.length < 0) {
            throw new Error("查询商品信息失败");
        } else {
            return data;
        }
    }
    //用户发表商品评价
    async  edit_goods_evaluate(params, user) {
        const mysql = this.app.mysql;
        let return_data = {};

        let sql = "insert into evaluate ( order_id,goods_id,evaluate_num,content,ctime,uid) values  ";
        let args = [];
        for (let i = 0; i < params.specs.length; i++) {
            args.push(params[i].order_id, params[i].goods_id, params[i].evaluate_num, params[i].content, new Date(), user.id);
            if (i === params.specs.length - 1) {
                sql += "(?,?,?,?,?) ;";
                break;
            } else {
                sql += "(?,?,?,?,?) ,";
            }
        }
        let spec_result = await mysql.query(sql, args);
        if (spec_result.affectedRows === params.specs.length) {
            return return_data;
        } else {
            throw new Error("增加失败");

        }
    }
}
module.exports = Goodsservice;



