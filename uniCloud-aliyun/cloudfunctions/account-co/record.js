//获取数据库对象
const db = uniCloud.database();
const dbCmd = db.command
const $ = dbCmd.aggregate
// user表
const userCollection = db.collection("account-user");
const bookCollection = db.collection("account-book");
const accountCollection = db.collection("account-item");
const mounthCollection = db.collection("account-month");

async function creatRecord(params) {
	if (!(params.bookId && params.amount)) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await accountCollection.add(params)
	return {
		errCode: 0,
		errMsg: "新增成功",
		data: response
	}
}

async function getRecordList(params) {
	const {
		type,
		bookId,
		classify,
		startDay,
		endDay
	} = params
	if (!bookId) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const condition = {
		bookId
	}
	if (startDay && endDay) {
		condition.datetime = dbCmd.gte(startDay).and(dbCmd.lte(endDay))
	}
	if (startDay && !endDay) {
		condition.datetime = dbCmd.gte(startDay)
	}
	if (!startDay && endDay) {
		condition.datetime = dbCmd.lte(endDay)
	}
	if (type) {
		condition.type = type
	}
	const response = await accountCollection.where(condition).orderBy("datetime", "desc").get()
	return {
		errCode: 0,
		errMsg: "查询成功",
		data: response.data
	}
}

async function getRecordById(id) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await accountCollection.doc(id).get()
	return {
		errCode: 0,
		errMsg: "查询成功",
		data: response.data[0]
	}
}

async function deleteRecord(id) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await accountCollection.doc(id).remove();
	return {
		errCode: 0,
		errMsg: "删除成功",
		data: response
	}
}

async function updateRecord(id, params) {
	if (!id) {
		return {
			errCode: 10001,
			errMsg: "参数错误: 缺少必要的参数"
		}
	}
	const response = await accountCollection.doc(id).update(params);
	return {
		errCode: 0,
		errMsg: "更新成功",
		data: response
	}
}

module.exports = {
	creatRecord,
	getRecordList,
	getRecordById,
	deleteRecord,
	updateRecord
}