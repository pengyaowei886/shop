'use strict';

const Controller = require('../core/baseController');
class AddressController extends Controller {

    //查看商品列表
    async   query_class() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
 
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
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
            let uid=Number(ctx,query.uid);
            let data = await service.address.query_address(uid);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
    //编辑分类
    async edit_class() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                action: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                params: {
                    type: 'object', required: true, allowEmpty: false
                }
            }, ctx.request.body);
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
            let action = this.ctx.request.body.action;
            let params = this.ctx.request.body.params;

            let data = await service.address.edit_address(action, params);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }

}
module.exports = AddressController;