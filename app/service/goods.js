



const Service = require('egg').Service;
class Goodsservice extends Service {

    //查询商品列表
    async query_goods(limit, skip, name, class_class) {
        const mysql = this.app.mysql;
        let sql = "select id,pic,head_pic,price,class,introduce,repertory,status from goods where status >=0 and  class=" + mysql.escape(class_class);
        if (name) {
            sql += "introduce like " + mysql.escape("%" + name + "%") + " order by ctime  desc  limit ?  offset ? ";
        } else {
            sql += " order by ctime  desc  limit ?  offset ? ";
        }
        let args = [limit, skip];
        let result = await mysql.query(sql, args);
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //查询商品具体详情
    async query_goods_info(id) {
        const mysql = this.app.mysql;
        //先查商品信息
        let result = await mysql.select('goods', {
            where: { id: id }, columns: ['introduce', 'price', 'class',
                'repertory', 'pic', 'head_pic', 'ctime']
        });
        if (result.length < 0) {
            throw new Error("查询商品信息失败");
        } else {
            //再查商品规格信息
            let specs = await mysql.select('specs', {
                where: { goods_id: id }, columns: ['spec', 'price',
                    'repertory']
            });
            if (specs) {
                result[0].specs = specs;
                return result;
            } else {
                throw new Error("查询商品规格失败");
            }
        }
    }
    //编辑商品
    async edit_goods(action, params, admin) {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {

            let result = await mysql.insert('goods', {
                'pic': params.pic, 'head_pic': params.head_pic, class: params.class,
                specs: params.spec_name, class: params.class,
                introduce: params.introduce,
                'cost_price': params.cost_price, 'real_price': params.real_price, 'sell_price': params.sell_price, "repertory": params.repertory, "status": 1, ctime: new Date(), 'utime': null, handler: admin.name
            })
            if (result.affectedRows === 1) {

                let goods_result = await mysql.query("select @@IDENTITY ");
                let goods_id = goods_result[0]["@@IDENTITY"];

                let sql = "insert into specs ( goods_id,repertory,spec,price,ctime) values  ";
                let args = [];
                for (let i = 0; i < params.specs.length; i++) {
                    args.push(goods_id, params.specs[i].repertory, params.specs[i].spec, params.specs[i].price, new Date());
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

            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "update") {
            let rows = {
                'id': params.id, 'cost_price': params.cost_price,
                'pic': params.pic, 'head_pic': params.head_pic, class: params.class, 'real_price': params.real_price,
                'sell_price': params.sell_price, "repertory": params.repertory, utime: new Date(), handler: admin.name
            }
            let result = await mysql.update('goods', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("编辑失败");
            }
        }
        if (action == "xiajia") {
            let rows = { id: params.id, status: 0, utime: new Date(), handler: admin.name }
            let result = await mysql.update('goods', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("下架失败");
            }
        }
        if (action == "delete") {
            let rows = { id: params.id, status: -1, utime: new Date(), handler: admin.name }
            let result = await mysql.update('goods', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("删除失败");
            }
        }
    }
    //编辑商品规格
    async edit_goods_spec(action, prams, admin) {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {

            let result = await mysql.insert('specs', {
                'goods_id': params.goods_id,
                spec: params.spec,
                'price': params.price, "repertory": params.repertory, "status": 1, ctime: new Date(), 'utime': null, handler: admin.name
            })
            if (result.affectedRows === 1) {
                return return_data;

            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "update") {
            let rows = {
                'id': params.spec_id, 'spec': params.spec,
                'price': params.price, "repertory": params.repertory, utime: new Date(), handler: admin.name
            }
            let result = await mysql.update('spec', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("编辑失败");
            }
        }
        if (action == "delete") {
            let rows = { id: params.spec_id, status: 0, utime: new Date(), handler: admin.name }
            let result = await mysql.update('spec', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("下架失败");
            }
        }
    }
}
module.exports = Goodsservice;



