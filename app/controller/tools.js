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

        try {
            const filename = Math.random().toString(36).substr(2) + new Date().getTime() + ".png";
            const target = path.join(this.config.baseDir, 'app/public/goods', filename);
            let data = {};
            // // 生成一个文件写入 文件流
            var writeStream = fs.createWriteStream(target);
            await awaitWriteStream(stream.pipe(writeStream));
            data.url = "http://127.0.0.1:7001/public/goods/" + filename;
            return handerThis.succ(data);
        } catch (error) {
            return handerThis.error('HANDLE_ERROR', error['message']);
        }

    }

}
module.exports = ToolsController;