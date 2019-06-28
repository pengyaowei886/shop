
const Service = require('egg').Service;
class ClassService extends Service {

    //查询分类列表
    async query_class() {
        const mysql = this.app.mysql;
        let result = await mysql.select('class', { where: { status: 1 }, columns: ['id', 'name'] });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //编辑分类
    async edit_goods(action, params, admin) {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {

            let result = await mysql.insert('goods', {
                'name': params.name, 'ctime': new Date(), utime: null, handler: admin.name
            })
            if (result.affectedRows === 1) {
                return return_data;

            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "update") {
            let rows = {
                'id': params.id, 'name': params.name, utime: new Date(), handler: admin.name
            }
            let result = await mysql.update('class', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("编辑失败");
            }
        }
        if (action == "update") {
            let rows = { id: params.id, status: 0, utime: new Date(), handler: admin.name }
            let result = await mysql.update('goods', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("下架失败");
            }
        }
    }
}
module.exports = ClassService;