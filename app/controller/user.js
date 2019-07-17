'use strict';

const Controller = require('../core/baseController');
const crypto = require('crypto');


class UserController extends Controller {
  /**
   * 用户完成注册
 */
  async register() {

    let handerThis = this;
    const { ctx, app, service } = handerThis;
    //参数校验
    try {
      //使用插件进行验证 validate    
      ctx.validate({
        phone: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
          type: 'string', required: true, allowEmpty: false
        },
        password: {
          type: 'string', required: true, allowEmpty: false
        },
        param: {
          type: 'string', required: true, llowEmpty: false
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
      const { ctx, app, service } = handerThis;
      let phone = ctx.request.body.phone;
      let password = ctx.request.body.password;
      let param = ctx.request.body.param;
      let data = await service.user.register(phone, password, param);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }
  /**
 * 用户注册请求短信验证码
 * 
 */
  async req_dx() {
    let handerThis = this;
    const { ctx, app, service } = handerThis;
    //参数校验
    try {
      //使用插件进行验证 validate    
      ctx.validate({
        phone: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
      let phone = ctx.request.query.phone;
      let data = await service.user.req_dx(phone);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }
  /**
 * 用户登陆
 */
  async login() {
    let handerThis = this;
    const { ctx, app, service } = handerThis;
    //参数校验
    try {
      //使用插件进行验证 validate    
      ctx.validate({
        code: {//字符串 必填 不允许为空字符串 
          type: 'string', required: true, allowEmpty: false
        },
        head_pic: {//字符串 必填 不允许为空字符串 
          type: 'string', required: true, allowEmpty: false
        },
        nick_name: {//字符串 必填 不允许为空字符串 
          type: 'string', required: true, allowEmpty: false
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
    //逻辑处理
    try {
      let code = ctx.request.body.code;
      let head_pic = ctx.request.body.head_pic;
      let nick_name=ctx.request.body.nick_name;
      let data = await service.user.login(code, head_pic,nick_name);
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
      let data = await service.user.query_rotate_map(kind);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }

  //用户查看我的收藏
  async query_collation() {
    let handerThis = this;
    const { ctx, app, service } = handerThis;
    //参数校验
    try {
      //使用插件进行验证 validate    
      ctx.validate({
        uid: {//字符串 必填 不允许为空字符串 
          type: 'string', required: true, allowEmpty: false
        },
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
      let uid = Number(ctx.query.uid);
      let kind = Number(ctx.query.kind);
      let data = await service.user.query_collation(uid, kind);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }
  //用户编辑我的收藏
  async edit_collation() {
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
      let data = await service.user.edit_collation(action, params);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }
  //用户查看浏览历史
  async query_history() {
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
      let uid = Number(ctx.request.query.uid);
      let kind = Number(ctx.request.query.kind);
      let data = await service.user.query_history(uid, kind);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }

  //用户编辑历史
  async edit_history() {
    let handerThis = this;
    const { ctx, app, service } = handerThis;
    //参数校验
    try {
      //使用插件进行验证 validate    
      ctx.validate({
        uid: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
          type: 'int', required: true, allowEmpty: false
        },
        kind: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
          type: 'int', required: true, allowEmpty: false
        },
        goods_id: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
      let uid = ctx.request.body.uid;
      let kind = ctx.request.body.kind;
      let goods_id = ctx.request.body.goods_id;
      let data = await service.user.edit_history(uid,goods_id, kind);
      return handerThis.succ(data);
    } catch (error) {
      return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }
//查询用户个人信息
  async query_user_info(){
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
        let uid = Number(ctx.query.uid);
        let data = await service.user.query_user_info(uid);
        return handerThis.succ(data);
    } catch (error) {
        return handerThis.error('HANDLE_ERROR', error['message']);
    }
  }

  
}
module.exports = UserController;