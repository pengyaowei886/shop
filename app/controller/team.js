'use strict';

const Controller = require('../core/baseController');
class TeamController extends Controller {

    async start_team() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                goods_id: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'int', required: true, allowEmpty: false
                },
                spec: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
            let uid = Number(ctx.request.body.uid);
            let goods_id = Number(ctx.request.body.goods_id);
            let spec = Number(ctx.request.body.spec);
            let data = await service.team.start_team(uid, goods_id, spec);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }


    //开团支付
    async open_team_pay() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                money: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                openid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
            let money = ctx.request.query.money;
            let openid = ctx.request.query.openid;
            let ip_res = ctx.request.header.host
            // let ip_arr=ip_res.split(":");
            // let ip=ip_arr[0];

        let ip="1.193.64.69";
            let data = await service.team.open_team(money, openid, ip);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);

        }

    }

    //开团支付成功回调
    async open_pay_return() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        var body = ctx.request.body;

        let data = await service.team.open_pay_return(body);
        if (data) {
            var message = '<xml><return_code><![CDATA[SUCCESS]]></return_code><return_msg><![CDATA[OK]]></return_msg></xml>';
            ctx.body = message;
        } else {

        }
    }
}
module.exports = TeamController;