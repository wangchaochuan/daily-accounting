// 云对象教程: https://uniapp.dcloud.net.cn/uniCloud/cloud-obj
// jsdoc语法提示教程：https://ask.dcloud.net.cn/docs/#//ask.dcloud.net.cn/article/129
const dayjs = require("dayjs");
const {
	updateUser,
	registerUser
} = require("./user.js")
const {
	getBooks,
	createBook,
	deleteBook,
	updateBook,
	addBookMembers
} = require("./book.js")
const {
	getMonthData,
	updateMonthBudget,
	updateMonthSummary,
	updateMonthTotalExpend,
	updateMonthTotalIncome
} = require("./month.js")
const {
	creatRecord,
	getRecordList,
	getRecordById,
	deleteRecord,
	updateRecord
} = require("./record.js")
//获取数据库对象
const db = uniCloud.database();
// user表
const userCollection = db.collection("account-user");
const bookCollection = db.collection("account-book");
const accountCollection = db.collection("account-item");
const mounthCollection = db.collection("account-month");

function getType(val) {
	return Object.prototype.toString.call(val).slice(8, -1).toLowerCase()
}

module.exports = {
	_after(error, result) {
		if (error) {
			// 处理中间件内抛出的标准响应对象
			if (error.errCode && getType(error) === 'object') {
				const errCode = error.errCode
				console.log(error)
				return {
					errCode,
					errMsg: error.errMsg || this.t(errCode, error.errMsgValue)
				}
			}
			throw error
		}
		return Object.assign({}, this.response || {}, result)
	},
	/**  
	 * @description 更新用户
	 * @@param {string} userId  需要更新的用户ID
	 * @param  {Object} user    需要更新的用户信息
	 * @@return {Object} response  更新结果 
	 */
	updateUser,
	/**
	 * @description 注册用户
	 * @@param {string} code    code
	 * @@return {Object} user   注册的用户信息
	 */
	registerUser,
	// 账本相关接口
	getBooks,
	createBook,
	deleteBook,
	updateBook,
	addBookMembers,
	// 月份相关接口
	getMonthData,
	updateMonthBudget,
	updateMonthSummary,
	updateMonthTotalExpend,
	updateMonthTotalIncome,
	// 账单记录相关接口
	creatRecord,
	getRecordList,
	getRecordById,
	deleteRecord,
	updateRecord
}