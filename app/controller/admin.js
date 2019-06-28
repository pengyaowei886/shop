'use strict';

const Controller = require('../core/baseController');



class AdminController extends Controller {

    //查看管理员
    async query_admin() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;

        //逻辑判断
        try {
            let handerThis = this;
            const { ctx, service } = handerThis;

            let data = await service.admin.query_admin();
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
    //查看管理员权限
    async query_admin_role() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;

        //逻辑判断
        try {
            let handerThis = this;
            const { ctx, service } = handerThis;
            let admin = this.ctx.session.admin;
            let data = await service.admin.query_admin_role(admin);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }


    //编辑管理员权限
    async edit_admin_role() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                action: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                role: {
                    type: 'string', required: true, allowEmpty: false
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
            let role = this.ctx.request.body.role;
            let action = this.ctx.request.body.action;
            let admin = this.ctx.session.admin;
            let data = await service.admin.edit_admin_role(role, action, admin);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
    //编辑管理员
    async edit_admin() {
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
            let admin = this.ctx.session.admin;
            let data = await service.admin.edit_admin(action, params, admin);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
    /**
   * 管理员登陆
   */
    async login() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                username: {//字符串 必填 不允许为空字符串 
                    type: 'string', required: true, allowEmpty: false
                },
                password: {//字符串 必填 不允许为空字符串 
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
        //逻辑处理
        try {
            let name = ctx.request.query.username;
            let password = ctx.request.query.password;
            let data = await service.admin.login(name, password);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
    /**
     *   /查看轮播图(根据分类查询)
     */
    async   query_rotate_map() {

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                kind: {//字符串 必填 不允许为空字符串 
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
            let kind = Number(ctx.query.kind);
            let data = await service.admin.query_rotate_map(kind);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }
    //编辑轮播图
    async rotate_map_edit() {
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
            let admin = this.ctx.session.admin;
            let data = await service.admin.rotate_map_edit(action, params, admin);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }
    }

}
module.exports = AdminController;