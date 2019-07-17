
const Service = require('egg').Service;
class AddressService extends Service {

    //查询用户收货地址
    async query_address(uid) {
        const mysql = this.app.mysql;
        let result = await mysql.select('address', {
            where: { uid: uid }, columns: ['id', 'user_name', 'phone', 'address', 'detailInfo', 'is_default']
        });
        if (result.length >= 1) {
            return result;
        } else {
            throw new Error("空数据");
        }
    }

    //用户编辑收货地址
    async edit_address(action, params) {
        const mysql = this.app.mysql;
        let return_data = {};
        if (action == "insert") {
            if (params.is_default == 1) {
                //修改默认收货地址值
                let is_exist = await mysql.select('address', { where: { uid: params.uid, is_default: 1 } });
                if (is_exist.length > 0) {
                    await mysql.update('address', { id: is_exist[0].id, is_default: 0 });
                }
            }
            let result = await mysql.insert('address', {
                'user_name': params.user_name, 'phone': params.phone, address: params.address, detailInfo: params.detailInfo,
                is_default: params.is_default, ctime: new Date(), uid: params.uid
            })

            if (result.affectedRows === 1) {

                return return_data;

            } else {
                throw new Error("增加失败");
            }
        }
        if (action == "update") {
            if (params.is_default == 1) {
                //修改默认收货地址值
                let is_exist = await mysql.select('address', { where: { uid: params.uid, is_default: 1 } });
                if (is_exist.length > 0) {
                    await mysql.update('address', { id: is_exist[0].id, is_default: 0 });
                }
            }
            // let rows = {
            //     'id': params.id, 'user_name': params.user_name, 'phone': params.phone, address: params.address, is_default: params.is_default,
            //     detailInfo: params.detailInfo
            // }
            // let result = await mysql.update('address', rows);
            // if (result.affectedRows === 1) {
            //     return return_data;
            // } else {
            //     throw new Error("修改失败");
            // }

            let rows = {
                'id': params.id, is_default: params.is_default
            }
            let result = await mysql.update('address', rows);
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("修改失败");
            }
        }
        if (action == "delete") {
            let result = await mysql.delete('address', { where: { id: params.id } });
            if (result.affectedRows === 1) {
                return return_data;
            } else {
                throw new Error("删除失败");
            }
        }


    }

}
module.exports = AddressService;