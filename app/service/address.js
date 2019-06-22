
const Service = require('egg').Service;
class AddressService extends Service {

    //查询用户收货地址
    async query_address(uid) {
        const mysql = this.app.mysql;
        let result = await mysql.select('address', {
            where: { status: 1, uid: uid }, columns: ['id', 'user_name', 'phone',
                'provinceName', 'cityName', 'countyName', 'detailInfo', 'is_default']
        });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }
    //编辑用户收货地址
    async edit_address(action, params) {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {
            let result = await mysql.insert('address', {
                'uid': params.uid, 'user_name': params.user_name, 'phone': params.phone,
                'provinceName': params.provinceName, 'cityName': params.cityName, 'detailInfo': params.detailInfo, 'is_default': params.uid, 'ctime': new Date(), utime: null
            })
            if (result.affectedRows === 1) {
                //如果设为默认收获地址
                if (params.is_default == 1) {
                    let is_default_result = await mysql.select('address', { where: { status: 1, uid: uid, is_default: 1 }, columns: ['id'] });
                    if (is_default_result.length == 0) {
                        return return_data;
                    } else {
                        let rows = {
                            'id': params.id, 'is_default': 0, utime: new Date(), handler: admin.name
                        }
                        await mysql.update('address', rows);
                        return return_data;
                    }
                } else {
                    throw new Error("增加失败");
                }
            }
        }
        if (action == "update") {
            let rows = {
                'id': params.id, 'user_name': params.user_name, 'phone': params.phone,
                'provinceName': params.provinceName, 'cityName': params.cityName, 'detailInfo': params.detailInfo, 'is_default': params.is_default, utime: new Date()
            }
            let result = await mysql.update('class', rows);
            if (result.affectedRows === 1) {
                //如果设为默认收获地址
                if (params.is_default == 1) {
                    let is_default_result = await mysql.select('address', { where: { status: 1, uid: uid, is_default: 1 }, columns: ['id'] });
                    if (is_default_result.length == 0) {
                        return return_data;
                    } else {
                        let rows = {
                            'id': params.id, 'is_default': 0, utime: new Date(), handler: admin.name
                        }
                        await mysql.update('address', rows);
                        return return_data;
                    }
                    return return_data;
                } else {
                    throw new Error("编辑失败");
                }
            }
            if (action == "update") {
                let rows = { id: params.id, status: 0, utime: new Date() }
                let result = await mysql.update('address', rows);
                if (result.affectedRows === 1) {
                    return return_data;
                } else {
                    throw new Error("下架失败");
                }
            }
        }
    }
}
module.exports = AddressService;