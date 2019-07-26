
const Service = require('egg').Service;
const md5 = require('md5');
const xml2js = require('xml2js');
const fxp = require('fast-xml-parser')
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
        console.log(total_fee)
        let appid = this.app.config.info.appid;	//自己的小程序appid
        let mch_id = this.app.config.info.mch_id;	//自己的商户号id
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
            key: this.app.config.info.business_secret,
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
        console.log(order_no);

        xml2js.parseString(result.data, function (error, res) {
            let reData = res.xml;
            console.log(reData);
            if (reData.return_code[0] == 'SUCCESS') {
                responseData = {
                    timeStamp: new Date().getTime(),
                    nonceStr: reData.nonce_str[0],
                    package: reData.prepay_id[0],
                    paySign: reData.sign[0],
                    order_no: order_no
                }
            } else {
                throw new Error(reData.err_code_des[0]);
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

    //定时任务 清除未付款的订单
    async   pay_order() {

        const mysql = this.app.mysql;
        let sql = "delete from join_order where  status = 0 and end_time < ?";
     
        let args = [new Date()]
        await mysql.query(sql, args);

        let other_sql = "delete from goods_order where status = 0  and end_time < ?";
        let other_args = [new Date()]
        await mysql.query(other_sql, other_args);
    }
    //自动收货
    async   shouhuo_order() {

        const mysql = this.app.mysql;
        let sql = "update   join_order set status= 3 ,shouhuo_time = ? where  status = 2 and fahuo_time <  ?";
     
        let args = [new Date(), new Date(new Date()- 10*24*60*60*1000)]
        await mysql.query(sql, args);

        let other_sql = "update  goods_order set status =3 ,shouhuo_time = ? where status = 2  and fahuo_time  < ? ";
        let other_args = [new Date(),new Date(new Date()- 10*24*60*60*1000)]
        await mysql.query(other_sql, other_args);
    }

    // 自动评价
     async   pingjia_order() {

        const mysql = this.app.mysql;
        let sql = "update from join_order set status = 7  where  status = 3 and fahuo_time <  ?";
     
        let args = [new Date(new Date()- 10*24*60*60*1000)]
        await mysql.query(sql, args);

        let other_sql = "update from goods_order set status = 7  and fahuo_time  < ? ";
        let other_args = [new Date(new Date()- 10*24*60*60*1000)]
        await mysql.query(other_sql, other_args);
    }
}
module.exports = ToolsService;