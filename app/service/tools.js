
const Service = require('egg').Service;
const md5 = require('md5');
const xml2js = require('xml2js');
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
        let total_fee = Number(money) * 100;
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
        xml2js.parseString(result.data, function (error, res) {
            let reData = res.xml;
            if (reData.return_code[0] == 'SUCCESS') {
                responseData = {
                    timeStamp: new Date().getTime(),
                    nonceStr: reData.nonce_str[0],
                    package: reData.prepay_id[0],
                    paySign: reData.sign[0],
                    order_no: order_no
                }
            } else {
                throw new Error("获取签名失败")
            }
        })
        return responseData;
    }

    //微信退款
    async  weixin_refund(out_trade_no, money) {


        let time = new Date().getTime();	//商户订单号
        let nonce_str = randomStr(); //随机字符串
        function createSign(obj) {	//签名算法（把所有的非空的参数，按字典顺序组合起来+key,然后md5加密，再把加密结果都转成大写的即可）
            let stringA = 'appid=' + obj.appid + '&mch_id=' + obj.mch_id + '&nonce_str=' + obj.nonce_str + '&out_refund_no='
                + obj.out_refund_no + '&out_trade_no=' + obj.out_trade_no + '&total_fee=' + obj.total_fee;
            stringA + '&key=' + obj.key;
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
        let total_fee = Number(money);
        let appid = this.app.config.info.appid;	//自己的小程序appid

        let mch_id = this.app.config.info.mch_id;	//自己的商户号id

        let sign = createSign({	//签名
            appid: appid,
            mch_id: mch_id,
            nonce_str: nonce_str,
            out_refund_no: time,
            out_trade_no: out_trade_no,
            total_fee: total_fee,
            key: this.app.config.info.key
        });
        let reqUrl = 'https://api.mch.weixin.qq.com/secapi/pay/refund';
        let formData = `<xml>
                            <appid>${appid}</appid>
							<mch_id>${mch_id}</mch_id>
                            <nonce_str>${nonce_str}</nonce_str> 
                            <out_refund_no>${time}</out_refund_no>
                            <out_trade_no>${out_trade_no}</out_trade_no>
							<sign>${sign}</sign>
							<total_fee>${total_fee}</total_fee>
                        </xml>`;

        //发起请求，获取微信支付的一些必要信息
        let result = await this.ctx.curl(reqUrl, {
            method: "POST",
            data: formData
        })
        let responseData = {};
        xml2js.parseString(result.data, function (error, res) {
            let reData = res.xml;
            console.log(JSON.stringify(res));
            if (reData.return_code[0] == 'SUCCESS') {
                return true;
            } else {
                return false;
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
        let responseData = {};
        xml2js.parseString(result.data, function (error, res) {
            //  responseData = res.xml;
            //  console.log(responseData);
            let reData = res.xml;
            if (reData.return_code[0] == 'SUCCESS' && reData.result_code[0] == "SUCCESS") {

                responseData = reData;
            } else {
                throw new Error("付款失败");
            }
        })
        return responseData;
    }
}
module.exports = ToolsService;