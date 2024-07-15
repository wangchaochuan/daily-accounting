<template>
	<view class="container">
		<view class="overview">
			<view class="header">
				<view class="date" @click="showDatePicker=true">
					<view class="year">{{year}}年</view>
					<view class="month">
						<text class="text">{{month}}月</text>
						<u-icon name="arrow-down-fill" class="icon"></u-icon>
					</view>
				</view>
				<view class="expend">
					<view class="label">本月支出</view>
					<view class="value">
						<u-text mode="price" type="error" bold :size="16" :text="totalExpend"></u-text>
					</view>
				</view>
				<view class="income">
					<view class="label">本月收入</view>
					<view class="value">
						<u-text mode="price" type="success" bold :size="16" :text="totalIncome"></u-text>
					</view>
				</view>
			</view>
			<view class="surplus">
				<view class="label">本月结余:</view>
				<view class="value">
					<u-text mode="price" type="primary" bold :size="16" :text="rest"></u-text>
				</view>
			</view>
		</view>
		<scroll-view scroll-y>
			<view class="classify-chart">
				<view class="title">
					<u-text text="分类支出比例" bold :size="18" :line-height="24"></u-text>
				</view>
				<view class="empty" v-if="classifyData.length===0">
					<u-empty text="暂无数据"></u-empty>
				</view>
				<view class="charts-box" v-else>
					<qiun-data-charts type="pie" :opts="opts" :chartData="chartData" />
				</view>
			</view>
			<view class="classify-list">
				<view class="title">
					<u-text text="分类支出排行" bold :size="18" :line-height="24"></u-text>
				</view>
				<view class="empty" v-if="classifyData.length===0">
					<u-empty text="暂无数据"></u-empty>
				</view>
				<view class="content" v-else>
					<view class="title">
						<view class="classify">
							<u-text text="类型" :size="18" :line-height="24"></u-text>
						</view>
						<view class="perenct">
							<u-text text="占比" :size="18" :line-height="24"></u-text>
						</view>
						<view class="amount">
							<u-text text="金额" :size="18" :line-height="24"></u-text>
						</view>
					</view>
					<view v-for="item in classifyData" :key="item.classify" class="row">
						<view class="classify">
							<u-text :text="item.classify" :size="16" :line-height="24"></u-text>
						</view>
						<view class="perenct">
							<u-text :text="getPerenct(item.totalAmount)" :size="16" :line-height="24"></u-text>
						</view>
						<view class="amount">
							<u-text :text="item.totalAmount" mode="price" type="error" :size="16"
								:line-height="24"></u-text>
						</view>
					</view>
				</view>
			</view>
			<view class="classify-list">
				<view class="title">
					<u-text text="标签支出排行" bold :size="18" :line-height="24"></u-text>
				</view>
				<view class="empty" v-if="tagsData.length===0">
					<u-empty text="暂无数据"></u-empty>
				</view>
				<view class="content" v-else>
					<view class="title">
						<view class="classify">
							<u-text text="类型" :size="18" :line-height="24"></u-text>
						</view>
						<view class="perenct">
							<u-text text="占比" :size="18" :line-height="24"></u-text>
						</view>
						<view class="amount">
							<u-text text="金额" :size="18" :line-height="24"></u-text>
						</view>
					</view>
					<view v-for="item in tagsData" :key="item.tag" class="row">
						<view class="classify">
							<u-text :text="item.tag" :size="16" :line-height="24"></u-text>
						</view>
						<view class="perenct">
							<u-text :text="getPerenct(item.totalAmount)" :size="16" :line-height="24"></u-text>
						</view>
						<view class="amount">
							<u-text :text="item.totalAmount" mode="price" type="error" :size="16"
								:line-height="24"></u-text>
						</view>
					</view>
				</view>
			</view>
			<view class="classify-list">
				<view class="title">
					<u-text text="单项支出排行(前十)" bold :size="18" :line-height="24"></u-text>
				</view>
				<view class="empty" v-if="expendRecords.length===0">
					<u-empty text="暂无数据"></u-empty>
				</view>
				<view class="content" v-else>
					<view class="item" v-for="item in expendRecords" :key="item._id">
						<view class="left">
							<view class="classify">
								<text class="text">{{item.classify}}</text>
								<u-tag :text="item.tag" v-if="item.tag" plain size="mini" shape="circle"></u-tag>
							</view>
							<view class="remark" v-if="item.remark">{{item.remark}}</view>
						</view>
						<view class="right" :class="{'income':item.type==='income'}">
							￥{{item.amount}}
						</view>
					</view>
				</view>
			</view>
			<view class="classify-list">
				<view class="title">
					<u-text text="单项收入排行(前五)" bold :size="18" :line-height="24"></u-text>
				</view>
				<view class="empty" v-if="incomeRecords.length===0">
					<u-empty text="暂无数据"></u-empty>
				</view>
				<view class="content" v-else>
					<view class="item" v-for="item in incomeRecords" :key="item._id">
						<view class="left">
							<view class="classify">
								<text class="text">{{item.classify}}</text>
								<u-tag :text="item.tag" v-if="item.tag" plain size="mini" shape="circle"></u-tag>
							</view>
							<view class="remark" v-if="item.remark">{{item.remark}}</view>
						</view>
						<view class="right" :class="{'income':item.type==='income'}">
							￥{{item.amount}}
						</view>
					</view>
				</view>
			</view>
		</scroll-view>
		<u-datetime-picker mode="year-month" :show="showDatePicker" v-model="date" :min-date="minDate"
			:max-date="maxDate" @cancel="showDatePicker=false" @confirm="changeDate"
			closeOnClickOverlay></u-datetime-picker>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		watchEffect
	} from 'vue'
	import {
		onShow,
		onShareAppMessage
	} from '@dcloudio/uni-app'
	import dayjs from 'dayjs'
	import useBookStore from '@/store/book.js';
	import useUserStore from '@/store/user.js';

	const db = uniCloud.database()
	const dbCmd = db.command
	const bookStore = useBookStore()
	const bookId = computed(() => bookStore.bookId)
	const userStore = useUserStore()
	const userName = computed(() => userStore.user.nick_name)
	const today = dayjs();
	const maxDate = today.valueOf();
	const minDate = today.subtract(3, 'year').valueOf()
	const showDatePicker = ref(false)
	const year = ref(today.year())
	const month = ref(today.month() + 1)
	const date = ref(maxDate)
	const changeDate = () => {
		const time = dayjs(date.value);
		year.value = time.year()
		month.value = time.month() + 1
		showDatePicker.value = false
	}

	const totalExpend = ref(0)
	const totalIncome = ref(0)
	const rest = computed(() => {
		return totalIncome.value - totalExpend.value;
	})

	const classifyData = ref([])
	const opts = {
		color: ["#1890FF", "#91CB74", "#FAC858", "#EE6666", "#73C0DE", "#3CA272", "#FC8452", "#9A60B4", "#ea7ccc"],
		padding: [5, 5, 5, 5],
		enableScroll: false,
		extra: {
			pie: {
				activeOpacity: 0.5,
				activeRadius: 10,
				offsetAngle: 0,
				labelWidth: 15,
				border: false,
				borderWidth: 3,
				borderColor: "#FFFFFF"
			}
		}
	}
	const chartData = computed(() => {
		const data = {
			series: [{
				data: classifyData.value.map(v => ({
					name: v.classify,
					value: v.totalAmount
				}))
			}]
		}
		return data;
	})

	const tagsData = ref([])

	const expendRecords = ref([])
	const incomeRecords = ref([])

	const getMonthData = async () => {
		if (year.value && month.value && bookId.value) {
			const date = `${year.value}-${month.value}`
			const response = await db.collection("account-month").where({
				month: date,
				bookId: bookId.value
			}).get();
			const data = response?.result?.data?.[0];
			if (data) {
				totalExpend.value = data.totalExpend
				totalIncome.value = data.totalIncome
			}
		}
	}

	const getRecordData = async () => {
		if (year.value && month.value) {
			const date = `${year.value}-${month.value}`
			const startDay = dayjs(date).startOf('M').valueOf()
			const endDay = dayjs(date).endOf('M').valueOf()
			const condition = {
				type: "expend",
				bookId: bookId.value,
				datetime: dbCmd.gte(startDay).and(dbCmd.lte(endDay))
			}
			const response = await db.collection('account-item').where(condition).groupBy('classify').groupField(
				'sum(amount) as totalAmount').orderBy('totalAmount', 'desc').get();
			const data = response?.result?.data;
			if (data.length > 0) {
				classifyData.value = data
			}
		}
	}

	const getPerenct = (amount) => {
		if (!totalExpend.value) return '0%'
		return (amount / totalExpend.value * 100).toFixed(2) + '%'
	}

	const getExpendRecord = async () => {
		if (year.value && month.value) {
			const date = `${year.value}-${month.value}`
			const startDay = dayjs(date).startOf('M').valueOf()
			const endDay = dayjs(date).endOf('M').valueOf()
			const condition = {
				type: "expend",
				bookId: bookId.value,
				datetime: dbCmd.gte(startDay).and(dbCmd.lte(endDay))
			}
			const response = await db.collection('account-item').where(condition).orderBy('amount', 'desc').limit(
				10).get()
			const data = response?.result?.data;
			if (data.length > 0) {
				expendRecords.value = data
			}
		}
	}
	const getIncomeRecord = async () => {
		if (year.value && month.value) {
			const date = `${year.value}-${month.value}`
			const startDay = dayjs(date).startOf('M').valueOf()
			const endDay = dayjs(date).endOf('M').valueOf()
			const condition = {
				type: "income",
				bookId: bookId.value,
				datetime: dbCmd.gte(startDay).and(dbCmd.lte(endDay))
			}
			const response = await db.collection('account-item').where(condition).orderBy('amount', 'desc').limit(
				5).get()
			const data = response?.result?.data;
			if (data.length > 0) {
				incomeRecords.value = data
			}
		}
	}
	const getTagRecord = async () => {
		if (year.value && month.value) {
			const date = `${year.value}-${month.value}`
			const startDay = dayjs(date).startOf('M').valueOf()
			const endDay = dayjs(date).endOf('M').valueOf()
			const condition = {
				type: "expend",
				bookId: bookId.value,
				datetime: dbCmd.gte(startDay).and(dbCmd.lte(endDay))
			}
			const response = await db.collection('account-item').where(condition).groupBy('tag').groupField(
				'sum(amount) as totalAmount').orderBy('totalAmount', 'desc').get();
			const data = (response?.result?.data || []).filter(v => v.tag)
			if (data.length > 0) {
				tagsData.value = data;
			}
		}
	}

	const init = () => {
		getMonthData();
		getRecordData();
		getExpendRecord();
		getIncomeRecord();
		getTagRecord();
	}

	watchEffect(() => {
		init();
	})
	onShow(() => {
		init()
	})
	onShareAppMessage((params) => {
		return {
			title: `${userName.value}邀请您使用青牛记账`,
			path: `/pages/home/home`
		}
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		display: flex;
		flex-direction: column;
		padding: 32rpx;
		box-sizing: border-box;
		background-color: $u-info-light;

		.overview {
			height: fit-content;
			background-color: #fff;
			border-radius: 36rpx;
			padding-bottom: 32rpx;
			box-sizing: border-box;
			margin-bottom: 32rpx;

			.header {
				height: 120rpx;
				position: relative;
				display: flex;
				background-color: #fff;
				border-radius: 36rpx 36rpx 0 0;
				z-index: 8;
				margin-bottom: 16rpx;

				.date {
					flex: 1;
					padding: 32rpx 0 0 32rpx;

					.year {
						font-size: 28rpx;
						color: $u-content-color;
					}

					.month {
						display: flex;

						.text {
							margin-right: 8rpx;
							font-weight: bold;
						}
					}
				}

				.expend,
				.income {
					flex: 1;
					padding-top: 32rpx;

					.label {
						font-size: 28rpx;
						color: $u-content-color;
					}
				}


			}

			.surplus {
				display: flex;
				margin-top: 16rpx;
				margin-right: 8rpx;
				padding: 0 32rpx;

				.label {
					font-size: 28rpx;
					color: $u-content-color;
					margin-right: 8rpx;
				}
			}

		}

		.classify-chart,
		.classify-list {
			height: fit-content;
			background-color: #fff;
			border-radius: 36rpx;
			padding: 32rpx;
			box-sizing: border-box;
			margin-bottom: 32rpx;

			.title {
				margin-bottom: 16rpx;
			}

			.charts-box {
				width: 100%;
				height: 300rpx;
			}

			.content {
				display: flex;
				flex-direction: column;
				gap: 8rpx;

				.title,
				.row {
					display: flex;
				}

				.classify,
				.perenct,
				.amount {
					flex: 1;
					display: flex;
					align-items: center;
					justify-content: center;
				}
			}

			.empty {
				width: 100%;
				height: 300rpx;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.item {
				height: fit-content;
				display: flex;
				padding: 16rpx 32rpx;
				border-bottom: 1px solid $u-border-color;

				.left {
					flex: 2;

					.classify {
						height: 48rpx;
						display: flex;
						align-items: center;
						justify-content: flex-start;

						.text {
							margin-right: 16rpx;
						}
					}

					.remark {
						height: 48rpx;
						display: flex;
						align-items: center;
						color: $u-light-color;
					}
				}

				.right {
					height: 100%;
					flex: 1;
					display: flex;
					justify-content: flex-end;
					align-items: center;
					align-self: center;
					color: $u-error-disabled;

					&.income {
						color: $u-success-disabled
					}
				}

				&:last-child {
					border-bottom: none;
				}
			}

		}
	}
</style>