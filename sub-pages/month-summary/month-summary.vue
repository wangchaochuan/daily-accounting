<template>
	<scroll-view class="container" scroll-y>
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
			<template v-if="monthData.budget>0">
				<view class="budget">
					<view class="origin">
						<view class="label">本月预算:</view>
						<view class="value">
							<u-text mode="price" type="primary" bold :size="16" :text="monthData.budget"></u-text>
						</view>
					</view>
				</view>
				<view class="progress">
					<view class="text">本月所用预算<text class="value">{{progress}}</text></view>
					<u-line-progress :percentage="percentage" height="8"></u-line-progress>
				</view>
			</template>
			<view class="surplus">
				<view class="label">本月结余:</view>
				<view class="value">
					<u-text mode="price" type="primary" bold :size="16" :text="rest"></u-text>
				</view>
			</view>
		</view>
		<view class="classify-list">
			<view class="title">
				<u-text text="本月分类支出排行" bold :size="18" :line-height="24"></u-text>
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
			<view class="title">月度小结</view>
			<view class="summary">
				<u-textarea v-model="monthData.summary"
					placeholder="可以总结一下本月预算的达成情况,有没有超预算;收入情况如何,是否还是只依赖工资的单一收入源,都可以做个简单的总结" :height="160"
					:maxlength="-1"></u-textarea>
			</view>
			<u-button type="primary" shape="circle" @click="save">保存</u-button>
		</view>
		<u-datetime-picker mode="year-month" :show="showDatePicker" v-model="date" :min-date="minDate"
			:max-date="maxDate" @cancel="showDatePicker=false" @confirm="changeDate"
			closeOnClickOverlay></u-datetime-picker>
	</scroll-view>
</template>

<script setup>
	import {
		ref,
		computed,
		onMounted,
		watchEffect
	} from 'vue'
	import {
		onShow
	} from '@dcloudio/uni-app'
	import dayjs from 'dayjs'
	import useBookStore from '@/store/book.js';

	const db = uniCloud.database()
	const dbCmd = db.command
	const bookStore = useBookStore()
	const bookId = computed(() => bookStore.bookId)
	const today = dayjs();
	const maxDate = today.subtract(1, 'month').valueOf();
	const minDate = today.subtract(3, 'year').valueOf()
	const showDatePicker = ref(false)
	const year = ref(today.year())
	const month = ref(today.month())
	const date = ref(maxDate)
	const changeDate = () => {
		const time = dayjs(date.value);
		year.value = time.year()
		month.value = time.month() + 1
		showDatePicker.value = false
	}

	const monthData = ref({})
	const totalExpend = computed(() => {
		return monthData.value?.totalExpend || 0
	})
	const totalIncome = computed(() => {
		return monthData.value?.totalIncome || 0
	})
	const rest = computed(() => {
		return totalIncome.value - totalExpend.value;
	})
	const percentage = computed(() => {
		if (monthData.value.budget === 0) return 0;
		return totalExpend.value / monthData.value.budget * 100
	})
	const progress = computed(() => {
		return percentage.value.toFixed(2) + '%'
	})
	const classifyData = ref([])

	const getMonthData = async () => {
		if (year.value && month.value && bookId.value) {
			const date = `${year.value}-${month.value}`
			const response = await db.collection("account-month").where({
				month: date,
				bookId: bookId.value
			}).get();
			const data = response?.result?.data?.[0];
			if (data) {
				monthData.value = data;
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
				'sum(amount) as totalAmount').get();
			const data = response?.result?.data;
			if (data.length > 0) {
				data.sort((a, b) => b.totalAmount - a.totalAmount)
				classifyData.value = data
			}
		}
	}

	const getPerenct = (amount) => {
		if (!totalExpend.value) return '0%'
		return (amount / totalExpend.value * 100).toFixed(2) + '%'
	}
	const init = () => {
		getMonthData();
		getRecordData();
	}

	const save = async () => {
		const id = monthData.value?._id;
		if (id) {
			await db.collection("account-month").doc(id).update({
				summary: monthData.value.summary
			})
		}
	}

	watchEffect(() => {
		init();
	})
	onShow(() => {
		init()
	})
</script>

<style lang="scss" scoped>
	.container {
		width: 100%;
		min-height: 100%;
		height: fit-content;
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

			.summary {
				margin: 24rpx 0;
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