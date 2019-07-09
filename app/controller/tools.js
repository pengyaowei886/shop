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

    async join_pay() {
        let handerThis = this;
        const { ctx, app, service } = handerThis;
        //参数校验
        try {
            //使用插件进行验证 validate    
            ctx.validate({
                code: {//字符串 必填 不允许为空字符串 ， 小程序使用wx.login得到的 临时登录凭证code,开发者服务器使用,临时登录凭证code获取 session_key和openid
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
            let code = ctx.request.body.code;
            let money =ctx.request.body.money;
            let ip=ctx.request.header.host;
            let data = await service.tools.join_pay(code,money,ip);
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);



            
        }

    }
    async  join_xianjin(){

        let handerThis = this;
        const { ctx, app, service } = handerThis;

        if (true) {
            //修改订单状态

            //减去库存





        }
    }
}
module.exports = ToolsController;