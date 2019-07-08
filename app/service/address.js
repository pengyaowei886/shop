
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
}
module.exports = AddressService;