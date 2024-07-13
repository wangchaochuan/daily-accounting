//获取数据库对象
const db = uniCloud.database();
const dbCmd = db.command
const $ = dbCmd.aggregate
// user表
const userCollection = db.collection("account-user");
const bookCollection = db.collection("account-book");
const accountCollection = db.collection("account-item");
const mounthCollection = db.collection("account-month");

async function getMonthData(month, bookId) {
	if (!month || !bookId) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await mounthCollection.where({
		month,
		bookId,
	}).get()
	// 不存在这个月的账本，则新建一条记录
	if (response.data.length === 0) {
		const params = {
			month,
			bookId,
			budget: 0,
			summary: '',
			totalExpend: 0,
			totalIncome: 0
		}
		const {
			id
		} = await mounthCollection.add(params)
		// 返回id说明创建成功
		if (id) {
			return {
				errCode: 0,
				errMsg: "success",
				data: {
					...params,
					_id: id
				}
			}
		}
	}
	return {
		errCode: 0,
		errMsg: "success",
		data: response.data[0]
	}
}
// 更新月度预算
async function updateMonthBudget(id, budget) {
	if (!id || !(budget >= 0)) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await mounthCollection.doc(id).update({
		budget
	})

	return {
		errCode: 0,
		errMsg: "设置成功",
		data: response
	}
}
// 更新月度总支出
async function updateMonthTotalExpend(id, expend = 0) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await mounthCollection.doc(id).update({
		totalExpend: dbCmd.inc(expend)
	})

	return {
		errCode: 0,
		errMsg: "设置成功",
		data: response
	}
}

// 更新月度总收入
async function updateMonthTotalIncome(id, income = 0) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await mounthCollection.doc(id).update({
		totalIncome: dbCmd.inc(income)
	})

	return {
		errCode: 0,
		errMsg: "设置成功",
		data: response
	}
}

// 更新月度总结
async function updateMonthSummary(id, summary = '') {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await mounthCollection.doc(id).update({
		summary
	})

	return {
		errCode: 0,
		errMsg: "设置成功",
		data: response
	}
}

module.exports = {
	getMonthData,
	updateMonthBudget,
	updateMonthSummary,
	updateMonthTotalExpend,
	updateMonthTotalIncome
}