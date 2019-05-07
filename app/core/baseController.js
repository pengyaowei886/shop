'use strict';

const { Controller } = require('egg');

const RETURN_CODE = {
    'OK': 0, // 处理成功
    'URL_ERROR': 1, // api错误
    'AUTH_ERROR': 2, // app_key, app_seceret认证信息错误
    'PARAMETERS_ERROR': 3, // 上送参数错误
    'HANDLE_ERROR': 4, // 业务处理错误
    'NULL_ERROR': 5, // 空数据
    'EXCEED_FRQ_ERROR': 6, // 访问频率过快
    'AUTH_FAILURE': 1000, //认证失败
};

const RETURN_MSG = {
    'OK': 'OK', // 处理成功
    'URL_ERROR': 'api not found', // api错误
    'AUTH_ERROR': 'authentication error', // app_key, app_seceret认证信息错误
    'PARAMETERS_ERROR': 'parameters error', // 上送参数错误
    'HANDLE_ERROR': 'servercie error', // 业务处理错误
    'NULL_ERROR': 'cannot query data', // 查询不到数据
    'EXCEED_FRQ_ERROR': 'api freq out of limit', // 访问频率过快
    'AUTH_FAILURE': 'invalid_request' //认证失败
};
class BaseController extends Controller {

    /**
     *获取请求的用户信息 
     */
    user() {
        return this.ctx.session['user'];
    }
    /**
     * 
     * @param {错误返回数据处理码} type 
     * @param {错误返回数据描述} desc 
     * @param {错误返回数据数据} data 
     */
    error(type, desc, data) {
        this.ctx.status = 200;
        let msg = desc ? desc : RETURN_MSG[type];
        this.ctx.body = {
            code: RETURN_CODE[type],
            msg: msg,
            data: data || null,
        };
    }
    /**
     * 
     * @param {返回成功数据} data 
     */
    succ(data) {
        this.ctx.status = 200;
        this.ctx.body = {
            code: RETURN_CODE['OK'],
            msg: RETURN_MSG['OK'],
            data: data,
        };
    }
    /**
     * 
     * @param {直接返回客户端请求} data 
     */
    send(data) {
        this.ctx.status = 200;
        data.data = data.data || null;
        this.ctx.body = data;
    }
}

module.exports = BaseController;
