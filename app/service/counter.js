'use strict';

const Service = require('egg').Service;

class CounterService extends Service {

    /**
 * 
 * @param {表明名} sequenceName 
 * @param {生成数量} count 
 */
    async  getNextSequenceValue(sequenceName, count) {
        let handerThis = this;
        const { ctx, app } = handerThis;
        let db = this.app.mongo.get('GOPAY')['db'];//获取数据库WLWord
        let table_name = 'counter';
        let table_function = db.collection(table_name);
        var cond = { sequenceName: sequenceName };
        var update = { $inc: { seq: count } };
        let item = await table_function.findOneAndUpdate(cond, update);
        if (item.value == null) {
            throw new Error('不支持该种类型的数据');
        }
        let retval=item.value.seq;
        return retval;
    }
}
module.exports = CounterService;
