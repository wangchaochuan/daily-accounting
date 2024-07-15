const dayjs = require("dayjs");

//获取数据库对象
const db = uniCloud.database();
// user表
const userCollection = db.collection("account-user");
const bookCollection = db.collection("account-book");

async function getOpenId(code) {
	const params = {
		js_code: code,
		appid: "wx95b5970336ce7475",
		secret: "666ffbbedcfdbb587d3acb5b8d40a956",
		grant_type: "authorization_code"
	}
	const {
		data
	} = await uniCloud.httpclient.request("https://api.weixin.qq.com/sns/jscode2session", {
		method: 'GET',
		data: params,
		contentType: 'json', // 指定以application/json发送data内的数据
		dataType: 'json' // 指定返回值为json格式，自动进行parse
	})
	return {
		openid: data.openid
	}
}

async function findUserByOpenid(openid) {
	const response = await userCollection.where({
		mp_wx_openid: openid
	}).get()
	const user = response?.data?.[0];
	return user;
}

async function findeUserById(id) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误：缺少必要的参数 id"
		}
	}
	const response = await userCollection.where({
		_id: id
	}).get()
	const user = response?.data?.[0];
	if (!user) {
		return {
			errCode: 40002,
			errMsg: `未找到id为${id}的用户`
		}
	}
	return {
		errCode: 0,
		errMsg: "成功",
		data: {
			user
		}
	}
}

async function registerUser(code) {
	if (!code) {
		return {
			errCode: 10001,
			errMsg: "参数错误：缺少必要的参数 code"
		}
	}
	const {
		openid
	} = await getOpenId(code)
	if (!openid) {
		return {
			errCode: 50001,
			errMsg: "服务器内部错误:获取openid失败"
		}
	}
	const user = await findUserByOpenid(openid);
	// 如果是已经存在的用户,直接返回即可；否则注册新的用户
	if (user) {
		return {
			errCode: 0,
			errMsg: "已存在该用户",
			data: {
				user
			}
		}
	}
	const params = {
		nick_name: "路人甲",
		mp_wx_openid: openid,
		register_date: dayjs().format("YYYY-MM-DD HH:mm")
	}
	const {
		id
	} = await userCollection.add(params);
	// id存在表示用户表中插入成功
	if (id) {
		// 创建用户时给用户创建默认账本
		await bookCollection.add({
			name: "默认账本",
			type: "private",
			creator: id,
			members: [id],
			expendClassify: ["餐饮", "买菜", "水果", "宝宝", "网购", "交通", "居家", "医疗", "零食", "房贷", "房租", "其他"],
			incomeClassify: ["工资", "奖金", "理财", "兼职", "人情", "转账", "红包", "其他"]
		})
		return {
			errCode: 0,
			errMsg: "用户注册成功",
			data: {
				user: Object.assign({}, params, {
					_id: id
				})
			}
		}
	}
	return {
		errCode: 50001,
		errMsg: "内部服务错误: 注册用户失败"
	}
}

async function updateUser(id, user) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误:缺少必填参数 id"
		}
	}
	if (!user.nick_name) {
		return {
			errCode: 10001,
			errMsg: "参数错误:缺少必填参数 用户昵称"
		}
	}
	const response = await userCollection.doc(id).update(user)
	return {
		errCode: 0,
		errMsg: "更新成功",
		data: response.data
	}
}

module.exports = {
	updateUser,
	registerUser,
	findeUserById,
}