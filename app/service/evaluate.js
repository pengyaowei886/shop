
const Service = require('egg').Service;

class EvaluateService extends Service {


    //用户查看商品评价
    async query_evaluate(kind, goods_id, limit, skip) {
        const mysql = this.app.mysql;

        console.log(kind)
        let result = await mysql.select('evaluate', {
            where: { kind: kind, goods_id: goods_id },
            columns: ['evaluate_num', 'content', 'ctime', 'is_default', 'uid'], orders: [['ctime', 'desc']], limit: limit, offset: skip
        })
        if (result.length > 0) {
            let uid = []
            for (let i in result) {
                uid.push(result[i].uid);
            }
            let user_info = await mysql.select('user', {
                where: { id: uid },
                columns: ['wx_pic', 'wx_nickname', 'id']
            })

            for (let i in result) {
                for (let j in user_info) {
                    if (result[i].uid == user_info[j].id) {
                        result[i].head_pic = user_info[j].wx_pic;
                        result[i].username = user_info[j].wx_nickname;
                        break;
                    }
                }
            }
            return result;
        }else{
            throw new Error("空数据")
        }


    }
    //用户发表评价
    async edit_evaluate(uid, order_no, kind,params) {
        const mysql = this.app.mysql;

        
        // let result = await mysql.insert('evaluate', {
        //     kind: kind, goods_id: goods_id, evaluate_num: num, content: content, ctime: new Date(), uid: uid, order_no: order_no, is_default: 1

        // })
        // if (result.affectedRows === 1) {
        //     return {};
        // } else {
        //     throw new Error("发表评价失败")
        // }
        let sql = "insert into evaluate ( kind,order_no,goods_id,evaluate_num,content,ctime,uid,is_default) values  ";
        let args = [];
        for (let i = 0; i < params.length; i++) {

            args.push(kind, order_no, params[i].goods_id, params[i].num,  params[i].content,
             new Date(), uid,1);
            if (i === params.length - 1) {
                sql += "(?,?,?,?,?,?,?,?) ;";
                break;
            } else {
                sql += "(?,?,?,?,?,?,?,?) ,";
            }
        }
        await mysql.query(sql,args);
        //修改订单状态
        let table_name="";
        if(kind==1){
            table_name="join_order";
        }
        if(kind==2){
            table_name="goods_order";
        }
        let spec_result = await mysql.update(table_name,{status:7},{where:{order_no:order_no}});
        console.log(spec_result);
        if (spec_result.affectedRows ==1) {
            return {};
        } else {
            throw new Error("增加失败");
        }
    }

    //用户查询我的订单评价

    async query_self_evaluate(order_no) {
        const mysql = this.app.mysql;



        let result = await mysql.select('evaluate', {
            where: { order_no: order_no },
            columns: ['evaluate_num', 'content', 'ctime', 'is_default']
        })
        return result;

    }

}
module.exports = EvaluateService;