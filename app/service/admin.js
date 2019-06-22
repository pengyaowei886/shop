

const Service = require('egg').Service;
class AdminService extends Service {

    /**
 * 
 * @param {表明名} sequenceName 
 * @param {生成数量} count 
 */
    //查看管理员信息
    async query_admin() {
        const mysql = this.app.mysql;
        let result = await mysql.select('admin', { where: { status: 1 }, columns: ['id', 'name', 'password', 'phone', 'role', 'ctime'] });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //编辑管理员
    async edit_admin(action, params, admin) {
        const mysql = this.app.mysql;
        let return_data = {};
        //增加管理员
        if (action == "insert") {
            let result = await mysql.insert('admin', {
                'name': params.name, 'password': params.password,
                'phone': params.phone, ctime: new Date(), 'utime': null, handler: admin.name, status: 1
            })
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "update") {
            let rows = { id: params.id, name: params.name, password: params.password, phone: params.phone, utime: new Date(), handler: admin.name }
            let result = await mysql.update('admin', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("编辑失败");
            }
        }
        if (action == "delete") {
            let rows = { id: params.id, status: 0, utime: new Date(), handler: admin.name }
            let result = await mysql.update('admin', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("删除失败");
            }
        }
    }

    /**
     * 后台登陆
     * @param {*} phone 
     * @param {*} password 
     */
    async login(name, password) {
        const mysql = this.app.mysql;

        let data = {};

        let result = await mysql.get('admin', { name: name, password: password })
        if (result) {
            this.ctx.session['admin'] = { name: name, id: result.id };
            return data;
        } else {
            throw new Error("账号或者密码错误")
        }


    }
    //查询轮播图
    async query_rotate_map() {
        const mysql = this.app.mysql;
        let result = await mysql.select('rotate_map', {
            where: { status: 1 }, columns: ['id', 'url', 'pic', 'ctime'],
            orders: [['ctime', 'desc']]
        });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //编辑轮播图
    async rotate_map_edit(action, params, admin) {
        const mysql = this.app.mysql;
        let return_data = {};
        //增加轮播图
        if (action == "insert") {
            let result = await mysql.insert('rotate_map', {
                'url': params.url,
                'pic': params.pic, ctime: new Date(), 'utime': null, handler: admin.name, status: 1
            })
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "update") {
            let rows = { id: params.id, pic: params.pic, url: params.url, utime: new Date(), handler: admin.name }
            let result = await mysql.update('rotate_map', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("编辑失败");
            }
        }
        if (action == "delete") {
            let rows = { id: params.id, status: 0, utime: new Date(), handler: admin.name }
            let result = await mysql.update('rotate_map', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("删除失败");
            }
        }
    }

}
module.exports = AdminService;