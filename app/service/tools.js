
const Service = require('egg').Service;
const md5 = require('md5');
const xml2js = require('xml2js');
const fs = require('fs');
class ToolsService extends Service {



    //微信支付
    async  weixin_pay(order_no, huidiao_url, body_data, money, openid, ip, attach) {


        let nonce_str = randomStr(); //随机字符串
        function createSign(obj) {	//签名算法（把所有的非空的参数，按字典顺序组合起来+key,然后md5加密，再把加密结果都转成大写的即可）
            let stringA = 'appid=' + obj.appid + "&attach=" + obj.attach + '&body=' + obj.body + '&mch_id=' + obj.mch_id + '&nonce_str=' + obj.nonce_str + '&notify_url=' + obj.notify_url + '&openid=' + obj.openid + '&out_trade_no=' + obj.out_trade_no + '&spbill_create_ip=' + obj.spbill_create_ip + '&total_fee=' + obj.total_fee + '&trade_type=' + obj.trade_type;
            let stringSignTemp = stringA + '&key=' + obj.key;
            stringSignTemp = md5(stringSignTemp);
            let signValue = stringSignTemp.toUpperCase();
            return signValue;
        }
        function randomStr() {	//产生一个随机字符串	
            var str = "";
            var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            for (var i = 1; i <= 32; i++) {
                var random = Math.floor(Math.random() * arr.length);
                str += arr[random];
            }

            return str;

        }


        let total_fee = Math.floor(money * 100);


        let appid = this.app.config.info.appid;	//自己的小程序appid
        let mch_id = this.app.config.info.mch_id;	//自己的商户号id
        let key = this.app.config.info.business_secret;	//自己的商户号id

        let sign = createSign({	//签名
            appid: appid,
            attach: attach,
            body: body_data,
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: huidiao_url, //回调地址  
            openid: openid,
            out_trade_no: order_no,
            spbill_create_ip: ip,
            total_fee: total_fee,
            key: key,
            trade_type: 'JSAPI'
        });
        let reqUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
        let formData = `<xml>
                            <appid>${appid}</appid>
                            <attach>${attach}</attach>
                            <body>${body_data}</body>
							<mch_id>${mch_id}</mch_id>
                            <nonce_str>${nonce_str}</nonce_str>
                            <notify_url>${huidiao_url}</notify_url>
                            <openid>${openid}</openid>
                            <out_trade_no>${order_no}</out_trade_no>
							<sign>${sign}</sign>
                            <spbill_create_ip>${ip}</spbill_create_ip>
							<total_fee>${total_fee}</total_fee>
							<trade_type>JSAPI</trade_type>	
                        </xml>`;
        //发起请求，获取微信支付的一些必要信息
        let result = await this.ctx.curl(reqUrl, {
            method: "POST",
            data: formData
        })
        let responseData = {};


        xml2js.parseString(result.data, function (error, res) {
            let reData = res.xml;
            console.log(reData)
            if (reData.return_code[0] == 'SUCCESS') {
                let shijiancuo = new Date().getTime();



                let stringA = 'appId=' + appid + '&nonceStr=' + reData.nonce_str[0] + '&package=' + `prepay_id=${reData.prepay_id[0]}` + '&signType=' + "MD5" + '&timeStamp=' + shijiancuo;
                let stringSignTemp = stringA + '&key=' + key;

                console.log(stringSignTemp);


                stringSignTemp = md5(stringSignTemp);

                let signValue = stringSignTemp.toUpperCase();

                console.log(signValue)




                responseData = {
                    timeStamp: shijiancuo,
                    nonceStr: reData.nonce_str[0],
                    package: `prepay_id=${reData.prepay_id[0]}`,
                    paySign: signValue,
                    order_no: order_no,
                    money: total_fee
                }
            } else {
                throw new Error(reData.err_code_des[0]);
            }
        })
        console.log(responseData)
        return responseData;
    }

    //微信退款
    async  weixin_refund(out_trade_no, money) {


        let time = new Date().getTime();	//商户退款单号
        let nonce_str = randomStr(); //随机字符串
        function createSign(obj) {	//签名算法（把所有的非空的参数，按字典顺序组合起来+key,然后md5加密，再把加密结果都转成大写的即可）
            let stringA = 'appid=' + obj.appid + '&mch_id=' + obj.mch_id + '&nonce_str=' + obj.nonce_str + '&out_refund_no='
                + obj.out_refund_no + '&out_trade_no=' + obj.out_trade_no + '&refund_fee=' + obj.refund_fee + '&total_fee=' + obj.total_fee + "&key=" + obj.key;
            let stringSignTemp = md5(stringA);
            let signValue = stringSignTemp.toUpperCase();
            return signValue;
        }
        function randomStr() {	//产生一个随机字符串	
            var str = "";
            var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            for (var i = 1; i <= 32; i++) {
                var random = Math.floor(Math.random() * arr.length);
                str += arr[random];
            }
            return str;
        }
        let total_fee = Number(money * 100);

        let appid = this.app.config.info.appid;	//自己的小程序appid


        let mch_id = this.app.config.info.mch_id;	//自己的商户号id
        let business_secret = this.app.config.info.business_secret;

        let sign = createSign({	//签名
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            out_refund_no: time,
            out_trade_no: out_trade_no,
            refund_fee: total_fee,
            total_fee: total_fee,
            key: business_secret
        });
        let reqUrl = 'https://api.mch.weixin.qq.com/secapi/pay/refund';
        let formData = `<xml>
                            <appid>${appid}</appid>
							<mch_id>${mch_id}</mch_id>
                            <nonce_str>${nonce_str}</nonce_str> 
                            <out_refund_no>${time}</out_refund_no>
                            <out_trade_no>${out_trade_no}</out_trade_no>
                            <refund_fee>${total_fee}</refund_fee>
							<sign>${sign}</sign>
							<total_fee>${total_fee}</total_fee>
                        </xml>`;

        //发起请求，获取微信支付的一些必要信息
        let result = await this.ctx.curl(reqUrl, {
            method: "POST",
            data: formData,
            pfx: fs.readFileSync('/www/zlpt/https/apiclient_cert.p12'),
            passphrase: mch_id
        })

        let responseData = {};
        xml2js.parseString(result.data, function (error, res) {
            let reData = res.xml;

            if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == 'SUCCESS') {
                // //验证微信返回值
                let sign_again = createSign({	//签名
                    appid: reData.appid[0],
                    mch_id: reData.mch_id[0],
                    nonce_str: reData.nonce_str[0],
                    out_refund_no: reData.out_refund_no[0],
                    out_trade_no: reData.out_trade_no[0],
                    refund_fee: reData.refund_fee[0],
                    total_fee: reData.total_fee[0],
                    key: business_secret
                });
                responseData = reData;
            } else {
                throw new Error(reData.err_code_des[0])
            }

        })
        return responseData;
    }

    //微信查询订单
    async  query_weixin_order(out_trade_no) {



        let nonce_str = randomStr(); //随机字符串
        function createSign(obj) {	//签名算法（把所有的非空的参数，按字典顺序组合起来+key,然后md5加密，再把加密结果都转成大写的即可）
            let stringA = 'appid=' + obj.appid + '&mch_id=' + obj.mch_id + '&nonce_str=' + obj.nonce_str + '&out_trade_no=' + obj.out_trade_no;
            stringA += '&key=' + obj.key;
            let stringSignTemp = md5(stringA);
            let signValue = stringSignTemp.toUpperCase();
            return signValue;
        }
        function randomStr() {	//产生一个随机字符串	
            var str = "";
            var arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

            for (var i = 1; i <= 32; i++) {
                var random = Math.floor(Math.random() * arr.length);
                str += arr[random];
            }
            return str;
        }

        let appid = this.app.config.info.appid;	//自己的小程序appid
        let mch_id = this.app.config.info.mch_id;	//自己的商户号id

        let sign = createSign({	//签名
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            out_trade_no: out_trade_no,
            key: this.app.config.info.business_secret
        });
        let reqUrl = 'https://api.mch.weixin.qq.com/pay/orderquery';
        let formData = `<xml>
                            <appid>${appid}</appid>
							<mch_id>${mch_id}</mch_id>
                            <nonce_str>${nonce_str}</nonce_str> 
                            <out_trade_no>${out_trade_no}</out_trade_no>
							<sign>${sign}</sign>
                        </xml>`;

        //发起请求，获取微信支付的一些必要信息

        let result = await this.ctx.curl(reqUrl, {
            method: "POST",
            data: formData
        })
        return new Promise(function (resolve, reject) {

            xml2js.parseString(result.data, function (error, res) {
                if (error) {
                    reject(error);
                } else {
                    resolve(res.xml);
                }
            })
        });

    }

    //微信消息模版
    async send(openid, template_id, formId, info) {
        let opts = {
            touser: openid,
            template_id: template_id,
            form_id: formId,
            data: {
                "keyword1": {
                    "value": info.keyword1,
                    "color": "#1d1d1d"
                },
                "keyword2": {
                    "value": info.keyword2,
                    "color": "#1d1d1d"
                },
                "keyword3": {
                    "value": info.keyword3,
                    "color": "#1d1d1d"
                }
            }
        }

    }

    //定时任务 清除未付款的订单
    async   pay_order() {

        const mysql = this.app.mysql;
        let sql = "delete from join_order where  status = 0  and unix_timestamp(end_time) < unix_timestamp( ? )  ";

        let args = [new Date()]

        await mysql.query(sql, args);


        let other_sql = "delete from goods_order where  status = 0  and unix_timestamp(end_time) < unix_timestamp( ? )  ";


        await mysql.query(other_sql, args);
    }
    //自动收货
    async   shouhuo_order() {

        const mysql = this.app.mysql;
        let sql = "update   join_order set status= 2 ,shouhuo_time = ? where  status = 2  and  " +
            " unix_timestamp(fahuo_time) is not null and  unix_timestamp(fahuo_time) >  unix_timestamp(?)  ;"


        let args = [new Date(new Date() - 10 * 24 * 60 * 60 * 1000), new Date(new Date() - 10 * 24 * 60 * 60 * 1000)]
        await mysql.query(sql, args);



        let other_sql = "update   goods_order set status= 2 ,shouhuo_time = ? where  status = 2  and  " +
            " unix_timestamp(fahuo_time) is not null and  unix_timestamp(fahuo_time) >  unix_timestamp(?)  ;"


        await mysql.query(other_sql, args);
    }

    // 自动评价
    async   pingjia_order() {

        const mysql = this.app.mysql;
        let sql = "update  join_order set status = 7  where    status = 3   and  " +
            " unix_timestamp(shouhuo_time) is not null and  unix_timestamp(shouhuo_time) >  unix_timestamp(?)  ;"

        let args = [new Date(new Date() - 7 * 24 * 60 * 60 * 1000)]
        await mysql.query(sql, args);

        let other_sql = "update  join_order set status = 7  where    status = 3  and  " +
            " unix_timestamp(shouhuo_time) is not null and  unix_timestamp(shouhuo_time) >  unix_timestamp(?)  ;"


        await mysql.query(other_sql, args);
    }

    //每天统计可用积分


    //定时任务 清除未拼成的团
    async   team_order() {

        const mysql = this.app.mysql;

        let select_sql = "select  id, uid ,order_no  from join_team where status = 0  and unix_timestamp(end_time) < unix_timestamp( ? )"


        let args = [new Date()]

        let info = await mysql.query(select_sql, args);
        if (info.length > 0) {
            let join_id = [];
            let order_no = [];
            for (let i in info) {
                join_id.push(info[i].id);
                order_no.push(info[i].order_no);

            }

            //修改状态
            await mysql.update('join_team', {
                id: join_id, status: -1
            })

            let order_info = await mysql.select('join_order', { where: { order_no: order_no }, columns: ['money', 'order_no', 'gold', 'uid'] })

            //退款
            for (let i in order_info) {

                //退款
                await this.weixin_refund(order_info[i].order_no, order_info[i].money)


                //修改状态
                await mysql.update('join_order', {
                    status: 8
                }, { where: { order_no: order_no } })

                //退积分
                let user_sql = " update user set balance = balance + ? where  id = ?"
                let user_args = [order_info[i].gold, order_info[i].uid];
                await mysql.query(user_sql, user_args);
                //生成积分退款记录

                await mysql.insert('gold_record', {
                    uid: order_info[i].uid,
                    num: order_info[i].gold,
                    source: 4,//开团失败退款
                    ctime: new Date()
                })
            }
        }



    }


}
module.exports = ToolsService;