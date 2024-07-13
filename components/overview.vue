<template>
	<view class="overview">
		<view class="background"></view>
		<view class="header">
			<view class="date" @click="showDatePicker=true">
				<view class="year">{{year}}年</view>
				<view class="month">
					<text class="text">{{month}}月</text>
					<u-icon name="arrow-down-fill" class="icon"></u-icon>
				</view>
			</view>
			<view class="expend">
				<view class="label">支出</view>
				<view class="value">
					<u-text mode="price" type="error" bold :size="16" :text="totalExpend"></u-text>
				</view>
			</view>
			<view class="income">
				<view class="label">收入</view>
				<view class="value">
					<u-text mode="price" type="success" bold :size="16" :text="totalIncome"></u-text>
				</view>
			</view>
		</view>
		<template v-if="budget>0">
			<view class="budget">
				<view class="origin">
					<view class="label">本月预算:</view>
					<view class="value">
						<u-text mode="price" type="primary" bold :size="16" :text="budget"></u-text>
					</view>
				</view>
				<view class="rest">
					<view class="label">剩余预算:</view>
					<view class="value">
						<u-text mode="price" type="warning" bold :size="16" :text="restBudget"></u-text>
					</view>
				</view>
			</view>
			<view class="progress">
				<view class="text">本月已用预算<text class="value">{{progress}}</text></view>
				<u-line-progress :percentage="percentage" height="8"></u-line-progress>
			</view>
			<view class="update_budget" @click="showModal=true">修改本月预算</view>
		</template>
		<view class="set_budget" v-else @click="showModal=true">设置本月预算</view>
		<view class="surplus">
			<view class="label">本月结余:</view>
			<view class="value">
				<u-text mode="price" type="primary" bold :size="16" :text="rest"></u-text>
			</view>
		</view>
		<u-datetime-picker mode="year-month" :show="showDatePicker" v-model="date" :min-date="minDate"
			:max-date="maxDate" @cancel="showDatePicker=false" @confirm="changeDate"
			closeOnClickOverlay></u-datetime-picker>
		<u-modal :show="showModal" title="设置预算" showCancelButton @cancel="showModal=false" @confirm="changeBudget">
			<u-input type="digit" placeholder="请输入预算" v-model="new_budget"></u-input>
		</u-modal>
	</view>
</template>

<script setup>
	import {
		ref,
		computed,
		watchEffect,
		onMounted,
		onUnmounted
	} from 'vue'
	import dayjs from 'dayjs'
	import useBookStore from '@/store/book.js';

	const CO = uniCloud.importObject("account-co");
	const bookStore = useBookStore()
	const bookId = computed(() => bookStore.bookId)
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

	const id = ref('')
	const budget = ref(0)
	const totalExpend = ref(0)
	const totalIncome = ref(0)
	const showModal = ref(false)
	const new_budget = ref()
	const restBudget = computed(() => {
		return budget.value - totalExpend.value
	})
	const percentage = computed(() => {
		if (budget.value === 0) return 0;
		return totalExpend.value / budget.value * 100
	})
	const progress = computed(() => {
		return percentage.value.toFixed(2) + '%'
	})
	const rest = computed(() => {
		return totalIncome.value - totalExpend.value;
	})
	const changeBudget = async () => {
		if (new_budget.value >= 0) {
			budget.value = new_budget.value
			await CO.updateMonthBudget(id.value, Number(new_budget.value))
		}
		showModal.value = false
	}

	const getData = async () => {
		if (year.value && month.value && bookId.value) {
			const date = `${year.value}-${month.value}`
			bookStore.setSelectMonth(date);
			const {
				data
			} = await CO.getMonthData(date, bookId.value);
			id.value = data._id;
			budget.value = data.budget;
			new_budget.value = data.budget;
			totalExpend.value = data.totalExpend
			totalIncome.value = data.totalIncome
		}
	}
	watchEffect(() => {
		getData()
	})

	onMounted(() => {
		uni.$on("changeMonthTotal", async ({
			type,
			amount,
			action
		}) => {
			if (type === "expend") {
				totalExpend.value = totalExpend.value + amount;
				await CO.updateMonthTotalExpend(id.value, amount)
			} else {
				totalIncome.value = totalIncome.value + amount;
				await CO.updateMonthTotalIncome(id.value, amount)
			}
		})
	})
	onUnmounted(() => {
		uni.$off("changeMonthTotal")
	})
</script>

<style lang="scss">
	.overview {
		position: relative;
		height: fit-content;
		background-color: #fff;
		border-radius: 36rpx;
		margin-left: 32rpx;
		margin-right: 32rpx;
		padding-bottom: 32rpx;
		box-sizing: border-box;

		.background {
			width: 100vw;
			height: 100rpx;
			position: absolute;
			top: 0;
			left: -32rpx;
			background-color: $u-primary;
		}

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

		.budget {
			height: fit-content;
			display: flex;
			flex-direction: column;
			align-items: flex-start;
			justify-content: center;
			padding: 0 32rpx;

			.origin,
			.rest {
				display: flex;

				.label {
					font-size: 28rpx;
					color: $u-content-color;
					margin-right: 8rpx;
				}

			}
		}

		.progress {
			margin-top: 8rpx;
			padding: 0 32rpx;

			.text {
				font-size: 28rpx;
				color: $u-content-color;
				margin-bottom: 4rpx;

				.value {
					color: $u-primary;
					margin-left: 8rpx;
				}
			}
		}

		.update_budget {
			padding: 16rpx 32rpx;
			padding-bottom: 0;
			font-size: 28rpx;
			color: $u-content-color;
			margin-right: 8rpx;
		}

		.set_budget {
			padding: 0 32rpx;
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
</style>