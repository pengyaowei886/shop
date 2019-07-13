



const Service = require('egg').Service;
class Goodsservice extends Service {



    // 用户查询商品列表
    async query_goods(limit, skip, name,is_recommend,class_class) {
        const mysql = this.app.mysql;
        //先查商品基本属性
        let sql = "select g.id,g.head_pic,s.sell_price, s.real_price, g.introduce,g.succ_volume  from goods g left join specs s  on g.id=s.goods_id " +
            " where g.status=1 and s.is_default=1 ";
            if (name) {
                sql += "and g.introduce like " + mysql.escape("%" + name + "%");
            }
            if (is_recommend) {
                sql += "and g.is_recommend = 1 ";
            }
            if (class_class) {
                sql += "and g.class = " + mysql.escape( class_class );
    
            }
            sql += "  order by g.ctime  desc  limit ?  offset ? ";
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
        let sql = "select g.id,g.head_pic,s.sell_price, s.real_price, g.introduce,g.succ_volume  from goods g left join specs s  on g.id=s.goods_id " +
            " where g.status=1 and s.is_default=1 and is_recommend=1"
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
            where: { id: id }, columns: ['introduce', "head_pic", "pic", 'repertory', 'succ_volume', "details", "video", "goods_rotate"]
        });

        if (result.length > 0) {
            //再查商品规格信息
            let specs = await mysql.select('specs', {
                where: { goods_id: id }, columns: ["id", 'spec', 'sell_price', 'pic', "repertory"]
            });
            // 再查收藏记录
            let collation = await mysql.select('collation', {
                where: { goods_id: id, kind: 1 }, columns: ["id"]
            });
            if (collation.length >= 1) { //已经收藏过
                result[0].collation = 1;
            } else {
                result[0].collation = 0;
            }
            result[0].specs = specs;
            return result;
        } else {
            throw new Error("没有这个商品ID");
        }
    }
    //用户查询拼团商品列表
    async query_join_goods(limit, skip, name, class_class, is_recommend) {
        const mysql = this.app.mysql;
        let sql = "select g.id,g.head_pic,s.join_price,s.leader_price,s.join_number,g.succ_volume,g.introduce " +
            "from join_goods g left join join_specs s  on g.id= s.goods_id  where  g.status=1 and s.is_default=1 and s.status=1 ";
        if (name) {
            sql += "and g.introduce like " + mysql.escape("%" + name + "%");
        }
        if (is_recommend) {
            sql += "and g.is_recommend = 1 ";
        }
        if (class_class) {
            sql += "and g.class = " + mysql.escape( class_class );

        }
        sql += "  order by g.ctime  desc  limit ?  offset ? ";

        let args = [limit, skip];
        let result = await mysql.query(sql, args);
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //用户查看拼团商品具体详情
    async query_join_goods_info(id) {
        const mysql = this.app.mysql;
        //先查商品信息
        let result = await mysql.select('join_goods', {
            where: { id: id, status: 1 }, columns: ['introduce', "effectiv_time", "join_xianjin", "details", "video", "goods_rotate",
                'succ_volume', "specs_name",
                'repertory', 'pic', 'head_pic', 'good_romate']
        });
        if (result.length < 1) {
            throw new Error("查询商品信息失败");
        } else {
            //再查商品规格信息 
            let specs = await mysql.select('join_specs', {
                where: { goods_id: id, status: 1 }, columns: ['id', 'spec', 'join_price', "join_number", "leader_price",
                    'repertory']
            });
            let collation = await mysql.select('collation', {
                where: { goods_id: id, kind: 2 }, columns: ["id"]
            });
            if (collation.length >= 1) { //已经收藏过
                result[0].collation = 1;
            } else {
                result[0].collation = 0;
            }
            result[0].specs = specs;
            return result;
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



