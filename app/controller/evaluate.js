
const Controller = require('../core/baseController');

class EvaluateController extends Controller {


    //用户查看订单评价

    async query_self_evaluate() {


        let handerThis = this;
        const { ctx, app, service } = handerThis;

        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
            let uid= Number(this.ctx.request.query.uid);
            let kind= Number(this.ctx.request.query.kind);
            let data = await service.evaluate.query_self_evaluate(uid,kind);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }

    //用户查看订单评价

    async query_goods_evaluate() {


        let handerThis = this;
        const { ctx, app, service } = handerThis;

        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                goods_id: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                limit: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                skip: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
            let goods_id = Number( this.ctx.request.query.goods_id);
            let limit = Number( this.ctx.request.query.limit);
            let skip = Number( this.ctx.request.query.skip);
            let kind = Number( this.ctx.request.query.kind);
            let data = await service.evaluate.query_evaluate(kind,goods_id,limit,skip);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
  //用户发表订单评价

  async edit_evaluate() {


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
            },
            params: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                type: 'array', required: true, allowEmpty: false
            },
            kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
        let handerThis = this;
        const { ctx, service } = handerThis;
   
        let order_no =  this.ctx.request.body.order_no;
        let uid = this.ctx.request.body.uid;
        let kind = this.ctx.request.body.kind;
        let params = this.ctx.request.body.params;
        let data = await service.evaluate.edit_evaluate(uid,order_no,kind,params);
        return handerThis.succ(data);
    } catch (error) {
        return handerThis.error('HANDLE_ERROR', error['message']);
    }
}
}
module.exports = EvaluateController;