'use strict';

const Controller = require('../core/baseController');



class ToolsController extends Controller {
    /**
       * 上传图片
       */
    async uoloadImg() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        const stream = await ctx.getFileStream();
        const awaitWriteStream = require('await-stream-ready').write;
        const path = require('path');
        const fs = require('fs');
        const sendToWormhole = require('stream-wormhole');
        //当然你也可以不使用这个 哈哈 个人比较赖
        //还有我们这里使用了egg-multipart
        const md5 = require('md5');


        //egg-multipart 已经帮我们处理文件二进制对象
        // node.js 和 php 的上传唯一的不同就是 ，php 是转移一个 临时文件
        // node.js 和 其他语言（java c#） 一样操作文件流
        //新建一个文件名
        const filename = md5(stream.filename) + path
            .extname(stream.filename)
            .toLocaleLowerCase();
        //文件生成绝对路径
        //

        const target = path.join(this.config.baseDir, 'app/public/goods', filename);
        //生成一个文件写入 文件流
        const writeStream = fs.createWriteStream(target);
        try {
            //异步把文件流 写入
            await awaitWriteStream(stream.pipe(writeStream));
        } catch (err) {
            //如果出现错误，关闭管道
            await sendToWormhole(stream);
            throw err;
        }

        let url = this.app.userConfig.info.web + "public/goods/" + filename;
        let data = { url: url }
        return handerThis.succ(data);
    }



    //获取物流信息
    async get_path() {
        //参数校验

        let handerThis = this;
        const { ctx, app, service } = handerThis;
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                order_no: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                kuaidi_no: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                },
                delivery_id: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
                    type: 'string', required: true, allowEmpty: false
                }
            }, ctx.query);
        } catch (e) {
            ctx.logger.warn(e);
            let logContent = e.code + ' ' + e.message + ',';
            for (let i in e.errors) {
                logContent += e.errors[i]['code'] + ' ' + e.errors[i]['field'] + ' ' + e.errors[i]['message'] + ' '
            }
            return handerThis.error('PARAMETERS_ERROR', logContent);
        }
        try {
            //获取token 
            const redis = this.app.redis.get('access_token');
            let token = await redis.get("access_token");
            let token_url = `https://api.weixin.qq.com/cgi-bin/express/business/path/get?access_token=${token}`;

            let formData = {
                order_id: this.ctx.request.body.order_no,
                delivery_id: this.ctx.request.body.delivery_id,
                waybill_id: this.ctx.request.body.kuaidi_no
            }
            let res = await this.ctx.curl(token_url, {
                method: "POST",
                data: formData
            })
            console.log(res);
            return handerThis.succ(res);
        } catch (error) {

        }

    }


    //获取协议信息
    async get_xieyi() {
        //参数校验

        let handerThis = this;
        const { ctx, app, service } = handerThis;

        try {
            //获取token 
            const redis = this.app.redis.get('access_token');
            let xieyi = await redis.get("xieyi");
            return handerThis.succ(xieyi);


        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);

        }

    }

    //获取公告
    async get_gonggao() {
        //参数校验

        let handerThis = this;
        const { ctx, app, service } = handerThis;

        try {
            //获取token 
            const redis = this.app.redis.get('access_token');
            let gonggao = await redis.get("gonggao");
            return handerThis.succ(gonggao);


        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);

        }

    }
    //获取拼团公告
    async get_join_team() {
        //参数校验

        let handerThis = this;
        const { ctx, app, service } = handerThis;

        try {
            //获取token 
            const mysql = this.app.mysql;
            let result = await mysql.select('join_team', { where: { status: 1 }, orders: [['ctime', 'desc']], limit: 10, skip: 0 })
            return handerThis.succ(result);

        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);

        }

    }



}
module.exports = ToolsController;