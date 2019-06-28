

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
        const redis = this.app.redis.get('admin');
        //增加管理员
        if (action == "insert") {

            let result = await mysql.insert('admin', {
                'name': params.name, 'password': params.password,
                'phone': params.phone, ctime: new Date(), 'utime': null, handler: admin.name, status: 1
            })
            if (result.affectedRows === 1) {
                let admin_result = await mysql.query("select @@IDENTITY ");
                let admin_id = admin_result[0]["@@IDENTITY"];
                await redis.set(`role:${admin_id}:order:query`, 0);
                await redis.set(`role:${admin_id}:order:edit`, 0);
                await redis.set(`role:${admin_id}:goods:query`, 0);
                await redis.set(`role:${admin_id}:goods:edit`, 0);
                await redis.set(`role:${admin_id}:join_goods:query`, 0);
                await redis.set(`role:${admin_id}:join_goods:edit`, 0);
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
    //查看权限列表
    async query_admin_role(admin) {

        let handerThis = this;
        const { ctx, app } = handerThis;
        const redis = this.app.redis.get('admin');
        let data = {
            order: {} ,
            goods: {},
            join_goods: {}
        };
    console.log('aaaaa');
        data.order.query = await redis.get(`role:${admin.id}:order:query`);
        data.order.edit = await redis.get(`role:${admin.id}:order:edit`);
        data.goods.query = await redis.get(`role:${admin.id}:goods:query`);
        data.goods.edit = await redis.get(`role:${admin.id}:goods:edit`);
        data.join_goods.read = await redis.get(`role:${admin.id}:join_goods:query`);
        data.join_goods.edit = await redis.get(`role:${admin.id}:join_goods:edit`);
        return data;
    }
    //编辑管理员权限
    async edit_admin_role(role, action, admin) {
        let handerThis = this;
        const { ctx, app } = handerThis;
        const redis = this.app.redis.get('admin');
        let data = {};
        let result = await redis.set(`role:${admin.id}:${role}:${action}`, 1);
        if (result === "OK") {
            return data;
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