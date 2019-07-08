
const Service = require('egg').Service;
class ToolsService extends Service {

    //参团支付
    async  join_pay(openid, money, ip) {



        let time = new Date().getTime();	//商户订单号
        let nonce_str = randomStr();
        // let openid = null;

        let total_fee = Number(money) * 100;
        let appid = this.app.config.info.appid;	//自己的小程序appid
        let mch_id = this.app.config.info.mch_id;	//自己的商户号id



        let sign = createSign({	//签名
            appid: appid,
            body: "拼团支付",
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: 'https://www.kdsou.com/kdchange/service_bak/notify.php', //回调地址  
            openid: openid,
            out_trade_no: time,
            spbill_create_ip: ip,
            total_fee: total_fee,
            trade_type: 'JSAPI'
        });

        let reqUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
		/*var reqData = {
			appid: '',	//小程序appid
			mch_id: '',	//商户号
			nonce_str: nonce_str,	//随机字符串
			sign: sign,	//签名
			body: '微信支付，商品详细描述',	//商品描述
			out_trade_no: time,	//商品订单号
			total_fee: total_fee,	//商品价格
			spbill_create_ip: '127.0.0.1',	//本地服务器地址
			notify_url: 'https://www.kdsou.com/kdchange/service_bak/notify.php',	//通知地址
			trade_type: 'JSAPI',	//交易类型，JSAPI为小程序交易类型
			openid: openid,	//交易类型是JSAPI的话，此参数必传
		}*/

        let formData = `<xml>
							<appid>${appid}</appid>
							<mch_id>${mch_id}</mch_id>
							<nonce_str>${nonce_str}</nonce_str>
							<sign>${sign}</sign>
							<body>微信支付，商品详细描述</body>
							<out_trade_no>${time}</out_trade_no>
							<total_fee>${total_fee}</total_fee>
							<spbill_create_ip>127.0.0.1</spbill_create_ip>
							<notify_url>https://www.kdsou.com/kdchange/service_bak/notify.php</notify_url>
							<trade_type>JSAPI</trade_type>
							<openid>${openid}</openid>
						</xml>`;

        //console.log(formData,'xml格式')
        //发起请求，获取微信支付的一些必要信息

        let result = await this.ctx.curl(reqUrl, {
            method: "POST",
            dataType: "json",
            data: formData
        })
        console.log(JSON.stringify(result), 'xml解析成惊悚字符串')
        let reData = JSON.stringify(result);
        let responseData = {
            timeStamp: new Date().getTime(),
            nonceStr: reData.nonce_str[0],
            package: reData.prepay_id[0],
            paySign: reData.sign[0]
        }
        return responseData;

    }

    //参团微信回调
    async join_pay_return() {
        //如果成功
        //生成 拼团信息
        await mysql.insert('join_team', {
            uid: uid,
            order: order,
            goods_id: goods_id,
            spec: spec,
            gold: result[0].sum_price,
            now_gold: 0,
            spec_name: repertory[0].spec,
            ctime: new Date(),
            status: 0
        })

        //失败  参团的积分退回去



    }

    //承包余额支付
    async  join_yue_pay(openid, order) {

        //先判断一下是否能进行余额支付

        // let time = new Date().getTime();	//商户订单号
        let nonce_str = randomStr();
        let openid = null;
        let total_fee = Number(query.money) * 100;
        let appid = '';	//自己的小程序appid
        let mch_id = '';	//自己的商户号id



        let sign = createSign({	//签名
            appid: appid,
            body: "拼团支付",
            mch_id: mch_id,
            nonce_str: nonce_str,
            notify_url: 'https://www.kdsou.com/kdchange/service_bak/notify.php', //回调地址
            openid: openid,
            out_trade_no: order,
            spbill_create_ip: '127.0.0.1',
            total_fee: total_fee,
            trade_type: 'JSAPI'
        });

        let reqUrl = 'https://api.mch.weixin.qq.com/pay/unifiedorder';
		/*var reqData = {
			appid: '',	//小程序appid
			mch_id: '',	//商户号
			nonce_str: nonce_str,	//随机字符串
			sign: sign,	//签名
			body: '微信支付，商品详细描述',	//商品描述
			out_trade_no: time,	//商品订单号
			total_fee: total_fee,	//商品价格
			spbill_create_ip: '127.0.0.1',	//本地服务器地址
			notify_url: 'https://www.kdsou.com/kdchange/service_bak/notify.php',	//通知地址
			trade_type: 'JSAPI',	//交易类型，JSAPI为小程序交易类型
			openid: openid,	//交易类型是JSAPI的话，此参数必传
		}*/

        let formData = `<xml>
							<appid>${appid}</appid>
							<mch_id>${mch_id}</mch_id>
							<nonce_str>${nonce_str}</nonce_str>
							<sign>${sign}</sign>
							<body>微信支付，商品详细描述</body>
							<out_trade_no>${time}</out_trade_no>
							<total_fee>${total_fee}</total_fee>
							<spbill_create_ip>127.0.0.1</spbill_create_ip>
							<notify_url>https://www.kdsou.com/kdchange/service_bak/notify.php</notify_url>
							<trade_type>JSAPI</trade_type>
							<openid>${openid}</openid>
						</xml>`;

        //console.log(formData,'xml格式')
        //发起请求，获取微信支付的一些必要信息
        request({
            url: reqUrl,
            method: "POST",
            json: true,
            headers: {
                "content-type": "application/json",
            },
            body: formData
        }, function (error, response, body) {
            if (!error && response.statusCode == 200) {
                console.log(body, '统一下单接口返回的数据') // 请求成功的处理逻辑
                xml2js.parseString(body, function (error, result) {
                    console.log(JSON.stringify(result), 'xml解析成惊悚字符串')
                    let reData = result.xml;

                    let responseData = {
                        timeStamp: new Date().getTime(),
                        nonceStr: reData.nonce_str[0],
                        package: reData.prepay_id[0],
                        paySign: reData.sign[0]
                    }

                    res.end(JSON.stringify(responseData))

                })
            }
        });





    }
    //承包余额回调
    async join_pay_yue_return() {
        //如果成功 修改订单状态

        //记录一下消费记录

    }
    //购买商品支付

    //购买商品回调

    //拼团商品退款

}
module.exports = ToolsService;