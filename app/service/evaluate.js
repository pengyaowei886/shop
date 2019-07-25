
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
    async edit_evaluate(uid, order_no, goods_id, kind, num, content) {
        const mysql = this.app.mysql;
        let result = await mysql.insert('evaluate', {
            kind: kind, goods_id: goods_id, evaluate_num: num, content: content, ctime: new Date(), uid: uid, order_no: order_no, is_default: 1

        })
        if (result.affectedRows === 1) {
            return {};
        } else {
            throw new Error("发表评价失败")
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