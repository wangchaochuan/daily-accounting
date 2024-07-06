// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
module.exports = {
	async getOpenId(code) {
		const params = {
			js_code: code,
			appid: "wxfe36b2900ac8ac84",
			secret: "e15286190840140f738979ac8b0e24d5",
			grant_type: "authorization_code"
		}
		try {
			const {
				data
			} = await uniCloud.httpclient.request("https://api.weixin.qq.com/sns/jscode2session", {
				method: 'GET',
				data: params,
				contentType: 'json', // 指定以application/json发送data内的数据
				dataType: 'json' // 指定返回值为json格式，自动进行parse
			})
			if (!data) {
				return null;
			}
			return data.openid;
		} catch (e) {
			throw new Error(e.message)
		}
	}
}