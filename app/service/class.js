
const Service = require('egg').Service;
class ClassService extends Service {

    //查询分类列表
    async query_class(kind) {
        const mysql = this.app.mysql;
        let result = await mysql.select('class', { where: { status: 1, kind: kind }, columns: ['id', 'name'] });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
}
module.exports = ClassService;