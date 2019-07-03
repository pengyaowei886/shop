'use strict';

const Controller = require('../core/baseController');
class ClassController extends Controller {

       //查看分类列表
       async   query_class() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
            try {
                //使用插件进行验证 validate    
                ctx.validate({
                    kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                        type: 'string', required: true, allowEmpty: false
                    }
                }, ctx.request.query);
            } catch (e) {
                ctx.logger.warn(e);
                let logContent = e.code + ' ' + e.message + ',';
                for (let i in e.errors) {
                    logContent += e.errors[i]['code'] + ' ' + e.errors[i]['field'] + ' ' + e.errors[i]['message'] + ' '
                }
                return handerThis.error('PARAMETERS_ERROR', logContent);
            }
        //逻辑判断
        try {
            let handerThis = this;
            const { ctx, service } = handerThis;
            let kind =Number(ctx.request.query.kind);
            let data = await service.class.query_class(kind);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
}
module.exports = ClassController;