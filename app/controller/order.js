'use strict';

const Controller = require('../core/baseController');



class OrderController extends Controller {


    //用户购买商品
    async trolley_pay() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                address_id: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                goods: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'array', required: true, allowEmpty: false
                },
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                openid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                is_gold: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
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


            const { ctx, service } = handerThis;

            // let ip_arr=ip_res.split(":");
            // let ip=ip_arr[0];

            let ip = "1.193.64.69";
            let openid = this.ctx.request.body.openid;
            let goods = this.ctx.request.body.goods;
            let uid = Number(this.ctx.request.body.uid);
            let address_id = Number(this.ctx.request.body.address_id);
            let is_gold = Number(this.ctx.request.body.is_gold);
            let data = await service.order.trolley_pay(goods, uid, is_gold, address_id, openid, ip);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }

    }

    //用户继续完成开团支付
    async trolley_pay_again() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                order_no: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
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


            const { ctx, service } = handerThis;


            let uid = this.ctx.request.body.uid;
            let order_no = this.ctx.request.body.order_no;
            let data = await service.order.trolley_pay_again(order_no, uid);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }

    //开团支付成功回调
    async goods_pay_return() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        let body = ctx.request.query.order_no;

        try {
            let data = await service.order.goods_pay_return(body);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);

        }

    }
    //用户购查询角标
    async query_order_num() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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


            const { ctx, service } = handerThis;


            let uid = Number(this.ctx.request.query.uid);
            let kind = Number(this.ctx.request.query.kind);
            let data = await service.order.query_order_num(kind, uid);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }

    }

    //用户查询订单列表
    async query_order_list() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                status: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'array', required: true, allowEmpty: false
                },
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                limit: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                skip: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
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


            const { ctx, service } = handerThis;


            let uid = this.ctx.request.body.uid;
            let status = this.ctx.request.body.status;
            let limit = this.ctx.request.body.limit;
            let skip = this.ctx.request.body.skip;
            let kind = this.ctx.request.body.kind;
            let data = await service.order.query_order_list(uid, status, kind, limit, skip);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }

    }
    //用户编辑订单
    async confire_order() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                action: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                order_id: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
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


            const { ctx, service } = handerThis;


            let kind = this.ctx.request.body.kind;
            let action = this.ctx.request.body.action;
            let order_id = this.ctx.request.body.order_id;
            let data = await service.order.confire_order(kind, order_id, action);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }

    }

}
module.exports = OrderController;